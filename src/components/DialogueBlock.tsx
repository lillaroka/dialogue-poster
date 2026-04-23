import {
  DialogueBlock as DialogueBlockType,
  Participant,
  Theme,
  getSpacingValues,
  CanvasPreset,
  FontSize,
  getFontSizeValue,
} from '../types';

interface DialogueBlockProps {
  block: DialogueBlockType;
  participant: Participant;
  preset: CanvasPreset;
  fontSize: FontSize;
  theme: Theme;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DialogueBlock({
  block,
  participant,
  preset,
  fontSize,
  theme,
  isSelected,
  onClick,
}: DialogueBlockProps) {
  const isLeft = participant.side === 'left';
  const spacing = getSpacingValues(preset)[block.spacing];

  const avatarSize = preset === 'large' ? 52 : 40;
  const gap = preset === 'large' ? 20 : 16;
  const fontSizeValue = getFontSizeValue(preset, fontSize);
  const padding = preset === 'large' ? 28 : 22;
  const bubbleMaxWidth = preset === 'large' ? '70%' : '72%';
  const nameFontSize = preset === 'large' ? 18 : 14;

  // 统一圆角
  const borderRadius = `${theme.borderRadius}px`;

  // 头像占位 — 显示名称首字
  const initial = participant.name ? participant.name.charAt(0) : '?';

  // 根据背景明暗判断阴影和选中样式
  const isDarkBg = theme.backgroundColor !== '#F0F0F3';
  const selectionRingOffset = isDarkBg ? theme.backgroundColor : '#F0F0F3';

  // 柔和阴影 — 更大的 blur radius，更低的透明度
  const bubbleBorder = isDarkBg
    ? '1px solid rgba(255, 255, 255, 0.06)'
    : '1px solid rgba(0, 0, 0, 0.06)';
  const rightShadow = isDarkBg
    ? '0 2px 12px rgba(74, 108, 247, 0.12)'
    : '0 2px 12px rgba(0, 0, 0, 0.06)';
  const leftShadow = isDarkBg
    ? '0 2px 10px rgba(0, 0, 0, 0.2)'
    : '0 2px 10px rgba(0, 0, 0, 0.05)';

  return (
    <div
      className={`flex items-start cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      }`}
      style={{
        marginBottom: spacing,
        ...(isSelected ? { ['--tw-ring-offset-color' as string]: selectionRingOffset } as React.CSSProperties : {}),
      }}
      onClick={onClick}
    >
      {/* 左侧头像 */}
      {isLeft && (
        <div
          className="flex-shrink-0"
          style={{ width: avatarSize, height: avatarSize, marginRight: gap }}
        >
          {participant.avatarUrl ? (
            <img
              src={participant.avatarUrl}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: '#C7C7CC',
                color: '#FFFFFF',
                fontSize: avatarSize * 0.4,
                fontWeight: 600,
                fontFamily: '"Noto Sans SC", sans-serif',
              }}
            >
              {initial}
            </div>
          )}
        </div>
      )}

      {/* 气泡区域 */}
      <div
        className="flex-1"
        style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end' }}
      >
        <div style={{ maxWidth: bubbleMaxWidth }}>
          {/* 说话人名称 */}
          <div
            style={{
              fontSize: nameFontSize,
              color: theme.speakerNameColor,
              marginBottom: 6,
              paddingLeft: isLeft ? 4 : undefined,
              paddingRight: isLeft ? undefined : 4,
              textAlign: isLeft ? 'left' : 'right',
              fontFamily: '"Noto Sans SC", sans-serif',
              fontWeight: 500,
            }}
          >
            {participant.name}
          </div>
          {/* 气泡 */}
          <div
            style={{
              backgroundColor: isLeft ? theme.leftBubbleColor : theme.rightBubbleColor,
              borderRadius,
              padding,
              border: bubbleBorder,
              boxShadow: isLeft ? leftShadow : rightShadow,
            }}
          >
            <div
              style={{
                fontSize: fontSizeValue,
                lineHeight: theme.lineHeight,
                color: isLeft ? theme.leftBubbleTextColor : theme.rightBubbleTextColor,
                fontFamily: '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                letterSpacing: '0.01em',
              }}
            >
              {block.text || (
                <span style={{ opacity: 0.4, fontStyle: 'italic' }}>
                  点击输入内容...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧头像 */}
      {!isLeft && (
        <div
          className="flex-shrink-0"
          style={{ width: avatarSize, height: avatarSize, marginLeft: gap }}
        >
          {participant.avatarUrl ? (
            <img
              src={participant.avatarUrl}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: '#1B8C6E',
                color: '#FFFFFF',
                fontSize: avatarSize * 0.4,
                fontWeight: 600,
                fontFamily: '"Noto Sans SC", sans-serif',
              }}
            >
              {initial}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
