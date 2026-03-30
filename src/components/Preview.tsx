import { useStore } from '../store/useStore';
import { PageCanvas } from './PageCanvas';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../types';
import { ZoomIn, ZoomOut } from 'lucide-react';

export function Preview() {
  const { project, currentPageIndex, previewScale, setPreviewScale, setCurrentPageIndex } = useStore();

  const handleZoomIn = () => {
    setPreviewScale(Math.min(previewScale + 0.1, 1));
  };

  const handleZoomOut = () => {
    setPreviewScale(Math.max(previewScale - 0.1, 0.2));
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-neutral-700 text-neutral-300"
            title="缩小"
          >
            <ZoomOut size={18} />
          </button>
          <span className="text-sm text-neutral-400 min-w-[60px] text-center">
            {Math.round(previewScale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-neutral-700 text-neutral-300"
            title="放大"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        {/* 页面切换 */}
        <div className="flex items-center gap-2">
          {project.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageIndex(index)}
              className={`px-3 py-1 rounded text-sm ${
                currentPageIndex === index
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              第 {index + 1} 页
            </button>
          ))}
        </div>
      </div>

      {/* 预览区域 */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-8">
        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'top center',
          }}
        >
          <PageCanvas
            page={project.pages[currentPageIndex]}
            pageIndex={currentPageIndex}
            project={project}
          />
        </div>
      </div>
    </div>
  );
}
