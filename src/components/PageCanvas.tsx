import { Page, Project, CANVAS_WIDTH, CANVAS_HEIGHT, SAFE_MARGIN } from '../types';
import { DialogueBlock } from './DialogueBlock';
import { useStore } from '../store/useStore';

interface PageCanvasProps {
  page: Page;
  pageIndex: number;
  project: Project;
}

export function PageCanvas({ page, pageIndex, project }: PageCanvasProps) {
  const { selectedBlockId, setSelectedBlockId } = useStore();

  const getParticipant = (participantId: string) => {
    return project.participants.find((p) => p.id === participantId)!;
  };

  return (
    <div
      data-page-index={pageIndex}
      className="relative bg-[#F8F7F5] flex flex-col"
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        flexShrink: 0,
      }}
    >
      {/* 顶部区域 */}
      {project.showHeader && (
        <div
          className="flex-shrink-0 text-center"
          style={{
            paddingTop: SAFE_MARGIN,
            paddingBottom: 40,
            paddingLeft: SAFE_MARGIN,
            paddingRight: SAFE_MARGIN,
          }}
        >
          {project.title && (
            <h1 className="text-[32px] font-semibold text-[#333333] mb-2">
              {project.title}
            </h1>
          )}
          {project.subtitle && (
            <p className="text-[18px] text-[#666666]">
              {project.subtitle}
            </p>
          )}
        </div>
      )}

      {/* 正文区域 */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          paddingLeft: SAFE_MARGIN,
          paddingRight: SAFE_MARGIN,
          paddingTop: project.showHeader ? 0 : SAFE_MARGIN,
        }}
      >
        {page.blocks.map((block) => (
          <DialogueBlock
            key={block.id}
            block={block}
            participant={getParticipant(block.participantId)}
            isSelected={selectedBlockId === block.id}
            onClick={() => setSelectedBlockId(block.id)}
          />
        ))}
      </div>

      {/* 底部区域 */}
      {project.showFooter && (
        <div
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            height: SAFE_MARGIN,
            paddingLeft: SAFE_MARGIN,
            paddingRight: SAFE_MARGIN,
          }}
        >
          {project.showPageNumber && (
            <span className="text-[14px] text-[#999999]">
              {pageIndex + 1} / {project.pages.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
