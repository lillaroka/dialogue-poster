import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Spacing, CANVAS_PRESETS, CanvasPreset } from '../types';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Image,
  FileText,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

export function Editor() {
  const {
    project,
    updateProject,
    currentPageIndex,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    moveBlockToPage,
    addPage,
    deletePage,
    updateParticipant,
    setSelectedBlockId,
    exportPage,
    exportAllPages,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'export'>('content');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const currentPage = project.pages[currentPageIndex];
  const selectedBlock = currentPage?.blocks.find((b) => b.id === selectedBlockId);

  const selectedBlockIndex = currentPage?.blocks.findIndex((b) => b.id === selectedBlockId) ?? -1;
  const isFirstBlock = selectedBlockIndex === 0;
  const isLastBlock = selectedBlockIndex === currentPage?.blocks.length - 1;

  const handleAddBlock = (side: 'left' | 'right') => {
    const participant = project.participants.find((p) => p.side === side);
    if (participant) {
      addBlock(currentPageIndex, participant.id);
    }
  };

  const handleAvatarUpload = (participantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateParticipant(participantId, { avatarUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoveToPrevPage = () => {
    if (selectedBlockId && currentPageIndex > 0) {
      moveBlockToPage(selectedBlockId, currentPageIndex, currentPageIndex - 1);
    }
  };

  const handleMoveToNextPage = () => {
    if (selectedBlockId && currentPageIndex < project.pages.length - 1) {
      moveBlockToPage(selectedBlockId, currentPageIndex, currentPageIndex + 1);
    }
  };

  const handleCanvasPresetChange = (preset: CanvasPreset) => {
    updateProject({ canvasPreset: preset });
  };

  return (
    <div className="w-[380px] bg-neutral-800 flex flex-col border-r border-neutral-700">
      {/* 标签页 */}
      <div className="flex border-b border-neutral-700">
        {[
          { id: 'content', label: '内容', icon: FileText },
          { id: 'style', label: '样式', icon: Settings },
          { id: 'export', label: '导出', icon: Download },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm ${
              activeTab === id
                ? 'bg-neutral-700 text-white border-b-2 border-blue-500'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-750'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'content' && (
          <div className="p-4 space-y-4">
            {/* 项目标题 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">项目信息</h3>
              <input
                type="text"
                value={project.title}
                onChange={(e) => updateProject({ title: e.target.value })}
                placeholder="标题"
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={project.subtitle}
                onChange={(e) => updateProject({ subtitle: e.target.value })}
                placeholder="副标题"
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 页面管理 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-300">页面管理</h3>
                <button
                  onClick={addPage}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                >
                  <Plus size={14} />
                  新增页面
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.pages.map((page, index) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                      index === currentPageIndex
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-sm">第 {index + 1} 页</span>
                    {project.pages.length > 1 && (
                      <button
                        onClick={() => deletePage(page.id)}
                        className="p-0.5 hover:bg-red-500 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 添加对话 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">添加对话</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddBlock('left')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
                >
                  <Plus size={16} />
                  左侧发言
                </button>
                <button
                  onClick={() => handleAddBlock('right')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-700 hover:bg-amber-600 rounded text-white text-sm"
                >
                  <Plus size={16} />
                  右侧发言
                </button>
              </div>
            </div>

            {/* 对话块列表 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">
                当前页对话 ({currentPage?.blocks.length || 0})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-auto">
                {currentPage?.blocks.map((block, index) => {
                  const participant = project.participants.find((p) => p.id === block.participantId);
                  const isLeft = participant?.side === 'left';
                  return (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`p-3 rounded cursor-pointer transition-colors ${
                        selectedBlockId === block.id
                          ? 'bg-blue-600/30 border border-blue-500'
                          : 'bg-neutral-700 hover:bg-neutral-600 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            isLeft ? 'bg-slate-500 text-white' : 'bg-amber-600 text-white'
                          }`}
                        >
                          {isLeft ? '左' : '右'}
                        </span>
                        <span className="text-xs text-neutral-500">#{index + 1}</span>
                      </div>
                      <p className="text-sm text-neutral-300 line-clamp-2">
                        {block.text || <span className="italic text-neutral-500">空内容</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 选中块的编辑 */}
            {selectedBlock && (
              <div className="space-y-3 p-3 bg-neutral-750 rounded-lg border border-neutral-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-300">编辑对话</h3>
                  <button
                    onClick={() => deleteBlock(currentPageIndex, selectedBlockId!)}
                    className="p-1.5 hover:bg-red-500 rounded text-red-400 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* 文本编辑 */}
                <textarea
                  value={selectedBlock.text}
                  onChange={(e) =>
                    updateBlock(currentPageIndex, selectedBlockId!, { text: e.target.value })
                  }
                  placeholder="输入对话内容..."
                  className="w-full h-32 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                />

                {/* 说话人切换 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">说话人:</span>
                  <div className="flex gap-1">
                    {project.participants.map((p) => (
                      <button
                        key={p.id}
                        onClick={() =>
                          updateBlock(currentPageIndex, selectedBlockId!, { participantId: p.id })
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          selectedBlock.participantId === p.id
                            ? p.side === 'left'
                              ? 'bg-slate-500 text-white'
                              : 'bg-amber-600 text-white'
                            : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                        }`}
                      >
                        {p.side === 'left' ? '左侧' : '右侧'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 间距切换 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">间距:</span>
                  <div className="flex gap-1">
                    {(['narrow', 'normal', 'wide'] as Spacing[]).map((spacing) => (
                      <button
                        key={spacing}
                        onClick={() =>
                          updateBlock(currentPageIndex, selectedBlockId!, { spacing })
                        }
                        className={`px-3 py-1 text-xs rounded ${
                          selectedBlock.spacing === spacing
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                        }`}
                      >
                        {spacing === 'narrow' ? '窄' : spacing === 'normal' ? '标准' : '宽'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 排序按钮 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => moveBlock(currentPageIndex, selectedBlockId!, 'up')}
                    disabled={isFirstBlock}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-neutral-300"
                  >
                    <ChevronUp size={14} />
                    上移
                  </button>
                  <button
                    onClick={() => moveBlock(currentPageIndex, selectedBlockId!, 'down')}
                    disabled={isLastBlock}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-neutral-300"
                  >
                    <ChevronDown size={14} />
                    下移
                  </button>
                  <button
                    onClick={handleMoveToPrevPage}
                    disabled={currentPageIndex === 0}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-neutral-300"
                  >
                    <ChevronLeft size={14} />
                    上页
                  </button>
                  <button
                    onClick={handleMoveToNextPage}
                    disabled={currentPageIndex === project.pages.length - 1}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-neutral-300"
                  >
                    下页
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="p-4 space-y-4">
            {/* 画布尺寸 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">画布尺寸</h3>
              <div className="flex gap-2">
                {(Object.keys(CANVAS_PRESETS) as CanvasPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleCanvasPresetChange(preset)}
                    className={`flex-1 px-3 py-2 text-xs rounded ${
                      project.canvasPreset === preset
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                  >
                    {CANVAS_PRESETS[preset].name}
                  </button>
                ))}
              </div>
            </div>

            {/* 头像设置 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">头像设置</h3>
              {project.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-600 flex items-center justify-center"
                    style={{
                      background: participant.avatarUrl
                        ? `url(${participant.avatarUrl}) center/cover`
                        : participant.side === 'left'
                        ? 'linear-gradient(135deg, #B8C5D0 0%, #9BAAB8 100%)'
                        : 'linear-gradient(135deg, #D4C4B0 0%, #C2B094 100%)',
                    }}
                  >
                    {!participant.avatarUrl && (
                      <Image size={20} className="text-white/50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-300">
                      {participant.side === 'left' ? '左侧' : '右侧'}说话人
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[participant.id] = el)}
                      onChange={(e) => handleAvatarUpload(participant.id, e)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRefs.current[participant.id]?.click()}
                      className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                    >
                      {participant.avatarUrl ? '更换头像' : '上传头像'}
                    </button>
                  </div>
                  {participant.avatarUrl && (
                    <button
                      onClick={() => updateParticipant(participant.id, { avatarUrl: '' })}
                      className="p-1.5 hover:bg-red-500 rounded text-red-400 hover:text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 显示选项 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">显示选项</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 bg-neutral-700 rounded cursor-pointer">
                  <span className="text-sm text-neutral-300">显示标题区域</span>
                  <button
                    onClick={() => updateProject({ showHeader: !project.showHeader })}
                    className="p-1"
                  >
                    {project.showHeader ? (
                      <Eye size={18} className="text-green-400" />
                    ) : (
                      <EyeOff size={18} className="text-neutral-500" />
                    )}
                  </button>
                </label>
                <label className="flex items-center justify-between p-2 bg-neutral-700 rounded cursor-pointer">
                  <span className="text-sm text-neutral-300">显示底部区域</span>
                  <button
                    onClick={() => updateProject({ showFooter: !project.showFooter })}
                    className="p-1"
                  >
                    {project.showFooter ? (
                      <Eye size={18} className="text-green-400" />
                    ) : (
                      <EyeOff size={18} className="text-neutral-500" />
                    )}
                  </button>
                </label>
                <label className="flex items-center justify-between p-2 bg-neutral-700 rounded cursor-pointer">
                  <span className="text-sm text-neutral-300">显示页码</span>
                  <button
                    onClick={() => updateProject({ showPageNumber: !project.showPageNumber })}
                    className="p-1"
                  >
                    {project.showPageNumber ? (
                      <Eye size={18} className="text-green-400" />
                    ) : (
                      <EyeOff size={18} className="text-neutral-500" />
                    )}
                  </button>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">导出图片</h3>
              <p className="text-xs text-neutral-500">
                当前尺寸: {CANVAS_PRESETS[project.canvasPreset].width} x {CANVAS_PRESETS[project.canvasPreset].height} 像素，2x 高清
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => exportPage(currentPageIndex)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium"
              >
                <Download size={18} />
                导出当前页
              </button>
              <button
                onClick={exportAllPages}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium"
              >
                <Download size={18} />
                导出全部页面 ({project.pages.length} 页)
              </button>
            </div>

            <div className="p-3 bg-neutral-700 rounded-lg">
              <p className="text-xs text-neutral-400">
                提示: 导出时请确保页面内容已完全加载。批量导出时会有短暂延迟。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
