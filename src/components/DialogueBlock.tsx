import { DialogueBlock as DialogueBlockType, Participant, SPACING_VALUES } from '../types';

interface DialogueBlockProps {
  block: DialogueBlockType;
  participant: Participant;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DialogueBlock({ block, participant, isSelected, onClick }: DialogueBlockProps) {
  const isLeft = participant.side === 'left';
  const spacing = SPACING_VALUES[block.spacing];

  const bubbleStyle = {
    backgroundColor: isLeft ? '#E8EAF6' : '#F5F1E8',
    boxShadow: `inset 0 1px 4px 0 ${isLeft ? '#D1D9E6' : '#E8DFC8'}`,
  };

  return (
    <div
      className={`flex items-start gap-4 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#F8F7F5]' : ''
      }`}
      style={{ marginBottom: spacing }}
      onClick={onClick}
    >
      {/* 头像区域 */}
      <div
        className={`flex-shrink-0 ${isLeft ? 'order-1' : 'order-3'}`}
        style={{ width: 48, height: 48 }}
      >
        {participant.avatarUrl ? (
          <img
            src={participant.avatarUrl}
            alt=""
            className="w-full h-full rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div
            className={`w-full h-full rounded-full border-2 border-white ${
              isLeft
                ? 'bg-gradient-to-br from-blue-300 to-purple-400'
                : 'bg-gradient-to-br from-amber-200 to-orange-300'
            }`}
          />
        )}
      </div>

      {/* 对话气泡 */}
      <div
        className={`flex-1 order-2 ${isLeft ? '' : 'flex justify-end'}`}
      >
        <div
          className="inline-block max-w-[85%] px-5 py-4 text-[16px] leading-[1.6] text-[#333333]"
          style={{
            ...bubbleStyle,
            borderRadius: 12,
            wordBreak: 'break-word',
          }}
        >
          {block.text || (
            <span className="text-[#999999] italic">点击输入内容...</span>
          )}
        </div>
      </div>
    </div>
  );
}
