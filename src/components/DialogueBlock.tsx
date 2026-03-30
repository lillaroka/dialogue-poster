import {
  DialogueBlock as DialogueBlockType,
  Participant,
  Spacing,
  getSpacingValues,
  getAvatarSize,
  CanvasPreset,
} from '../types';

interface DialogueBlockProps {
  block: DialogueBlockType;
  participant: Participant;
  preset: CanvasPreset;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DialogueBlock({
  block,
  participant,
  preset,
  isSelected,
  onClick,
}: DialogueBlockProps) {
  const isLeft = participant.side === 'left';
  const spacing = getSpacingValues(preset)[block.spacing];
  const avatarSize = getAvatarSize(preset);
  const gap = preset === 'large' ? 20 : 15;

  // 气泡样式 - 雾感、极浅半透明
  const bubbleStyle = {
    backgroundColor: isLeft
      ? 'rgba(240, 242, 244, 0.85)' // 偏冷，淡青灰
      : 'rgba(245, 242, 237, 0.85)', // 偏暖，淡米色
    boxShadow: isLeft
      ? '0 1px 3px rgba(200, 210, 220, 0.15), 0 1px 2px rgba(200, 210, 220, 0.1)'
      : '0 1px 3px rgba(210, 200, 180, 0.15), 0 1px 2px rgba(210, 200, 180, 0.1)',
    borderRadius: 16,
  };

  // 字体大小
  const fontSize = preset === 'large' ? 18 : 14;
  const padding = preset === 'large' ? 28 : 22;

  return (
    <div
      className={`flex items-start cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#FAF9F6]' : ''
      }`}
      style={{ marginBottom: spacing }}
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
              style={{ border: '2px solid rgba(255,255,255,0.8)' }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, #B8C5D0 0%, #9BAAB8 100%)',
                border: '2px solid rgba(255,255,255,0.8)',
              }}
            />
          )}
        </div>
      )}

      {/* 对话气泡 */}
      <div className="flex-1">
        <div
          className="inline-block max-w-[92%]"
          style={{
            ...bubbleStyle,
            padding: padding,
          }}
        >
          <div
            style={{
              fontSize,
              lineHeight: 1.75,
              color: '#2C2C2C',
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Source Han Serif CN", serif',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {block.text || (
              <span style={{ color: '#999999', fontStyle: 'italic' }}>
                点击输入内容...
              </span>
            )}
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
              style={{ border: '2px solid rgba(255,255,255,0.8)' }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, #D4C4B0 0%, #C2B094 100%)',
                border: '2px solid rgba(255,255,255,0.8)',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
