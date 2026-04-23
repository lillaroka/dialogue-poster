import { Page, Project, getCanvasSize, getSafeMargin, LONG_IMAGE, BackgroundTexture } from '../types';

// 背景纹理样式生成
function getTextureOverlayStyle(texture: BackgroundTexture, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
  };
  switch (texture) {
    case 'dots':
      return {
        ...base,
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        opacity: 0.04,
      };
    case 'lines':
      return {
        ...base,
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 28px)`,
        opacity: 0.04,
      };
    case 'paper':
      return {
        ...base,
        boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(0, 0, 0, 0.04)',
        opacity: 0.5,
      };
    case 'noise':
      return {
        ...base,
        opacity: 0.035,
      };
    default:
      return { display: 'none' };
  }
}
import { DialogueBlock } from './DialogueBlock';
import { useStore } from '../store/useStore';

interface PageCanvasProps {
  page: Page;
  pageIndex: number;
  project: Project;
}

export function PageCanvas({ page, pageIndex, project }: PageCanvasProps) {
  const { selectedBlockId, setSelectedBlockId } = useStore();
  const theme = project.theme;
  const isLongMode = project.layoutMode === 'long';

  const getParticipant = (participantId: string) => {
    return project.participants.find((p) => p.id === participantId)!;
  };

  // 分页模式参数
  const pagedSize = getCanvasSize(project.canvasPreset);
  const safeMargin = isLongMode ? 60 : getSafeMargin(project.canvasPreset);

  // 长图模式参数
  const canvasWidth = isLongMode ? LONG_IMAGE.width : pagedSize.width;
  const canvasHeight = isLongMode ? undefined : pagedSize.height;

  const titleFontSize = isLongMode ? 32 : project.canvasPreset === 'large' ? 32 : 24;
  const subtitleFontSize = isLongMode ? 18 : project.canvasPreset === 'large' ? 18 : 14;
  const headerPaddingBottom = isLongMode ? 48 : project.canvasPreset === 'large' ? 48 : 36;
  const bodyTopPadding = project.showHeader ? 0 : safeMargin;
  const footerHeight = isLongMode ? 72 : project.canvasPreset === 'large' ? 72 : 56;

  return (
    <div
      data-page-index={pageIndex}
      className="relative flex flex-col"
      style={{
        width: canvasWidth,
        height: canvasHeight,
        flexShrink: 0,
        backgroundColor: theme.backgroundColor,
        fontFamily: '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        ...(isLongMode ? { minHeight: 400 } : {}),
      }}
    >
      {/* 背景纹理层 */}
      {theme.backgroundTexture !== 'none' && (
        theme.backgroundTexture === 'noise' ? (
          <div style={getTextureOverlayStyle('noise', theme.speakerNameColor)}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id={`noise-filter-${pageIndex}`}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves="3"
                  stitchTiles="stitch"
                />
              </filter>
              <rect width="100%" height="100%" filter={`url(#noise-filter-${pageIndex})`} fill={theme.speakerNameColor} opacity="1" />
            </svg>
          </div>
        ) : (
          <div style={getTextureOverlayStyle(theme.backgroundTexture, theme.speakerNameColor)} />
        )
      )}

      {/* 顶部区域 */}
      {project.showHeader && (
        <div
          className="relative z-10 flex-shrink-0 text-center"
          style={{
            paddingTop: safeMargin,
            paddingBottom: headerPaddingBottom,
            paddingLeft: safeMargin,
            paddingRight: safeMargin,
          }}
        >
          {project.title && (
            <h1
              style={{
                fontSize: titleFontSize,
                fontWeight: 700,
                color: theme.titleColor,
                marginBottom: 8,
                letterSpacing: '-0.01em',
              }}
            >
              {project.title}
            </h1>
          )}
          {project.subtitle && (
            <p
              style={{
                fontSize: subtitleFontSize,
                color: theme.speakerNameColor,
                letterSpacing: '0.05em',
                fontWeight: 400,
                marginTop: project.title ? 4 : 0,
              }}
            >
              {project.subtitle}
            </p>
          )}
        </div>
      )}

      {/* 正文区域 */}
      <div
        className={`relative z-10 ${isLongMode ? '' : 'flex-1 overflow-hidden'}`}
        style={{
          paddingLeft: safeMargin,
          paddingRight: safeMargin,
          paddingTop: bodyTopPadding,
        }}
      >
        {page.blocks.map((block) => (
          <DialogueBlock
            key={block.id}
            block={block}
            participant={getParticipant(block.participantId)}
            preset={isLongMode ? 'small' : project.canvasPreset}
            fontSize={project.fontSize}
            theme={theme}
            isSelected={selectedBlockId === block.id}
            onClick={() => setSelectedBlockId(block.id)}
          />
        ))}
      </div>

      {/* 底部区域 */}
      {project.showFooter && (
        <div
          className="relative z-10 flex-shrink-0 flex flex-col items-center justify-center"
          style={{
            height: footerHeight,
            paddingLeft: safeMargin,
            paddingRight: safeMargin,
          }}
        >
          {/* 装饰细线 */}
          <div
            style={{
              width: 40,
              height: 1,
              backgroundColor: theme.speakerNameColor,
              opacity: 0.2,
              marginBottom: 10,
            }}
          />
          {/* 页码或 END 装饰 */}
          <span
            style={{
              fontSize: 11,
              color: theme.textColorSecondary,
              letterSpacing: '0.15em',
            }}
          >
            {isLongMode ? '· END ·' : project.showPageNumber ? `${pageIndex + 1} / ${project.pages.length}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}
