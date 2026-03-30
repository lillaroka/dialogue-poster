import { Page, Project, getCanvasSize, getSafeMargin } from '../types';
import { DialogueBlock } from './DialogueBlock';
import { useStore } from '../store/useStore';

interface PageCanvasProps {
  page: Page;
  pageIndex: number;
  project: Project;
}

export function PageCanvas({ page, pageIndex, project }: PageCanvasProps) {
  const { selectedBlockId, setSelectedBlockId } = useStore();
  const { width, height } = getCanvasSize(project.canvasPreset);
  const safeMargin = getSafeMargin(project.canvasPreset);

  const getParticipant = (participantId: string) => {
    return project.participants.find((p) => p.id === participantId)!;
  };

  // 标题区域样式
  const titleFontSize = project.canvasPreset === 'large' ? 36 : 28;
  const subtitleFontSize = project.canvasPreset === 'large' ? 18 : 14;
  const headerPaddingBottom = project.canvasPreset === 'large' ? 48 : 36;

  return (
    <div
      data-page-index={pageIndex}
      className="relative flex flex-col"
      style={{
        width,
        height,
        flexShrink: 0,
        backgroundColor: '#FAF9F6',
        fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Source Han Serif CN", serif',
      }}
    >
      {/* 顶部区域 - 器物铭牌感 */}
      {project.showHeader && (
        <div
          className="flex-shrink-0 text-center"
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
                fontWeight: 500,
                color: '#2C2C2C',
                marginBottom: 8,
                letterSpacing: '0.02em',
              }}
            >
              {project.title}
            </h1>
          )}
          {project.subtitle && (
            <p
              style={{
                fontSize: subtitleFontSize,
                color: '#666666',
                letterSpacing: '0.04em',
              }}
            >
              {project.subtitle}
            </p>
          )}
        </div>
      )}

      {/* 正文区域 */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          paddingLeft: safeMargin,
          paddingRight: safeMargin,
          paddingTop: project.showHeader ? 0 : safeMargin,
        }}
      >
        {page.blocks.map((block) => (
          <DialogueBlock
            key={block.id}
            block={block}
            participant={getParticipant(block.participantId)}
            preset={project.canvasPreset}
            isSelected={selectedBlockId === block.id}
            onClick={() => setSelectedBlockId(block.id)}
          />
        ))}
      </div>

      {/* 底部区域 - 呼吸区 */}
      {project.showFooter && (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            height: safeMargin,
            paddingLeft: safeMargin,
            paddingRight: safeMargin,
          }}
        >
          {project.showPageNumber && (
            <span
              style={{
                fontSize: 12,
                color: '#999999',
                letterSpacing: '0.1em',
              }}
            >
              {pageIndex + 1} / {project.pages.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
