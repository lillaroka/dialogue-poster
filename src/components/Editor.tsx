import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  Spacing,
  CANVAS_PRESETS,
  CanvasPreset,
  FontSize,
  FONT_SIZE_NAMES,
  THEME_PRESETS,
  LayoutMode,
  LONG_IMAGE,
  BACKGROUND_TEXTURE_OPTIONS,
} from '../types';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Settings,
  Eye,
  EyeOff,
  MousePointerClick,
  GripVertical,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 背景纹理 CSS 生成（用于预览缩略图）
function getTextureCSS(texture: string, color: string): React.CSSProperties {
  const base: React.CSSProperties = {};
  switch (texture) {
    case 'dots':
      return {
        ...base,
        backgroundImage: `radial-gradient(circle, ${color} 0.5px, transparent 0.5px)`,
        backgroundSize: '4px 4px',
      };
    case 'lines':
      return {
        ...base,
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 6px)`,
      };
    case 'paper':
      return {
        ...base,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.15)',
      };
    case 'noise':
      return {
        ...base,
        filter: 'url(#noise)',
      };
    default:
      return base;
  }
}

// 可排序的对话列表项
function SortableBlockItem({
  block,
  index,
  isSelected,
  participant,
  spacingLabel,
  onSelect,
}: {
  block: { id: string; participantId: string; text: string; spacing: Spacing };
  index: number;
  isSelected: boolean;
  participant: { side: string } | undefined;
  spacingLabel: (s: Spacing) => string;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isLeft = participant?.side === 'left';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-stretch rounded cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-600/30 border border-blue-500'
          : 'bg-neutral-700 hover:bg-neutral-600 border border-transparent'
      }`}
    >
      {/* 拖拽手柄 */}
      <button
        className="flex-shrink-0 flex items-center px-1.5 cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-300"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      {/* 内容区 */}
      <div
        className="flex-1 py-3 pr-3"
        onClick={onSelect}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${
                isLeft ? 'bg-slate-500 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {isLeft ? '左' : '右'}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              block.spacing === 'narrow'
                ? 'bg-neutral-600 text-neutral-300'
                : block.spacing === 'wide'
                ? 'bg-emerald-700 text-emerald-200'
                : 'bg-neutral-600 text-neutral-300'
            }`}>
              {spacingLabel(block.spacing)}
            </span>
          </div>
          <span className="text-xs text-neutral-500">#{index + 1}</span>
        </div>
        <p className="text-sm text-neutral-300 line-clamp-2">
          {block.text || <span className="italic text-neutral-500">空内容</span>}
        </p>
      </div>
    </div>
  );
}

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
    reorderBlocks,
    moveBlockToPage,
    addPage,
    deletePage,
    updateParticipant,
    setSelectedBlockId,
    exportPage,
    exportAllPages,
    applyThemePreset,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'export'>('content');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = currentPage.blocks.findIndex((b) => b.id === active.id);
    const newIndex = currentPage.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderBlocks(currentPageIndex, oldIndex, newIndex);
    }
  };

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

  const handleFontSizeChange = (size: FontSize) => {
    updateProject({ fontSize: size });
  };

  const spacingLabel = (s: Spacing) => s === 'narrow' ? '窄' : s === 'normal' ? '标准' : '宽';

  return (
    <div className="flex-1 bg-neutral-800 flex flex-col border-r border-neutral-700">
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

      <div className="flex-1 overflow-hidden">
        {/* ===== 内容 Tab ===== */}
        {activeTab === 'content' && (
          <div className="h-full flex">
            {/* 左栏 — 元信息 */}
            <div className="w-[38%] border-r border-neutral-700 p-4 space-y-5 overflow-auto">
              {/* 项目信息 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">项目信息</h3>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject({ title: e.target.value })}
                  placeholder="标题"
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={project.subtitle}
                  onChange={(e) => updateProject({ subtitle: e.target.value })}
                  placeholder="副标题"
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 页面管理 — 长图模式隐藏 */}
              {project.layoutMode !== 'long' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-300">页面管理</h3>
                  <button
                    onClick={addPage}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-700 hover:bg-neutral-600 rounded text-neutral-300"
                  >
                    <Plus size={14} />
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.pages.map((page, index) => (
                    <div
                      key={page.id}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                        index === currentPageIndex
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      第 {index + 1} 页
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
              )}

              {/* 添加对话 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">添加对话</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddBlock('left')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-white text-sm"
                  >
                    <Plus size={14} />
                    左侧
                  </button>
                  <button
                    onClick={() => handleAddBlock('right')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-700 hover:bg-amber-600 rounded text-white text-sm"
                  >
                    <Plus size={14} />
                    右侧
                  </button>
                </div>
              </div>

              {/* 显示选项 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">显示选项</h3>
                <div className="space-y-1.5">
                  {([
                    { label: '标题区域', key: 'showHeader' as const, value: project.showHeader },
                    { label: '底部区域', key: 'showFooter' as const, value: project.showFooter },
                    ...(project.layoutMode !== 'long'
                      ? [{ label: '页码', key: 'showPageNumber' as const, value: project.showPageNumber }]
                      : []),
                  ]).map(({ label, key, value }) => (
                    <label
                      key={key}
                      className="flex items-center justify-between p-2 bg-neutral-700 rounded cursor-pointer"
                    >
                      <span className="text-sm text-neutral-300">{label}</span>
                      <button
                        onClick={() => updateProject({ [key]: !value })}
                        className="p-1"
                      >
                        {value ? (
                          <Eye size={16} className="text-green-400" />
                        ) : (
                          <EyeOff size={16} className="text-neutral-500" />
                        )}
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 右栏 — 对话列表 + 编辑面板 */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* 对话列表 — 独立滚动 + 拖拽排序 */}
              <div className="flex-1 overflow-auto p-4 space-y-2">
                <h3 className="text-sm font-medium text-neutral-300 mb-2">
                  当前页对话 ({currentPage?.blocks.length || 0})
                </h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentPage?.blocks.map((b) => b.id) || []}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentPage?.blocks.map((block, index) => {
                      const participant = project.participants.find((p) => p.id === block.participantId);
                      return (
                        <SortableBlockItem
                          key={block.id}
                          block={block}
                          index={index}
                          isSelected={selectedBlockId === block.id}
                          participant={participant}
                          spacingLabel={spacingLabel}
                          onSelect={() => setSelectedBlockId(block.id)}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </div>

              {/* 编辑面板 — 固定底部 */}
              <div className="flex-shrink-0 border-t border-neutral-700">
                {selectedBlock ? (
                  <div className="p-4 space-y-3 bg-neutral-750">
                    {/* 标题行 */}
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
                      className="w-full h-28 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                    />

                    {/* 属性行 — 横向排列 */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* 说话人 */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-neutral-400">说话人</span>
                        {project.participants.map((p) => (
                          <button
                            key={p.id}
                            onClick={() =>
                              updateBlock(currentPageIndex, selectedBlockId!, { participantId: p.id })
                            }
                            className={`px-2.5 py-1 text-xs rounded ${
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

                      {/* 间距 */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-neutral-400">间距</span>
                        {(['narrow', 'normal', 'wide'] as Spacing[]).map((spacing) => (
                          <button
                            key={spacing}
                            onClick={() =>
                              updateBlock(currentPageIndex, selectedBlockId!, { spacing })
                            }
                            className={`px-2.5 py-1 text-xs rounded ${
                              selectedBlock.spacing === spacing
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                            }`}
                          >
                            {spacingLabel(spacing)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 排序按钮 */}
                    <div className="flex items-center gap-1.5">
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
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center text-neutral-500">
                    <MousePointerClick size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">点击列表或预览区选择对话块进行编辑</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== 样式 Tab ===== */}
        {activeTab === 'style' && (
          <div className="h-full flex">
            {/* 左栏 — 配色 + 布局/画布/字号 */}
            <div className="w-[45%] border-r border-neutral-700 p-4 space-y-5 overflow-auto">
              {/* 布局模式 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">布局模式</h3>
                <div className="flex gap-2">
                  {([
                    { value: 'paged' as LayoutMode, label: '分页' },
                    { value: 'long' as LayoutMode, label: '长图' },
                  ]).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateProject({ layoutMode: value })}
                      className={`flex-1 px-3 py-2 text-xs rounded ${
                        project.layoutMode === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 画布尺寸 — 长图模式隐藏 */}
              {project.layoutMode !== 'long' && (
              <div className="space-y-2">
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
              )}

              {/* 配色方案 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">配色方案</h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {THEME_PRESETS.map((preset) => {
                    const isActive = project.theme.rightBubbleColor === preset.theme.rightBubbleColor
                      && project.theme.backgroundColor === preset.theme.backgroundColor;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => applyThemePreset(preset)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                          isActive
                            ? 'bg-neutral-600 border-blue-500'
                            : 'bg-neutral-700 border-transparent hover:bg-neutral-600'
                        }`}
                      >
                        <div className="flex gap-0.5 flex-shrink-0">
                          <div
                            className="w-4 h-4 rounded-full border border-neutral-500"
                            style={{ backgroundColor: preset.theme.leftBubbleColor }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-neutral-500 -ml-0.5"
                            style={{ backgroundColor: preset.theme.rightBubbleColor }}
                          />
                        </div>
                        <span className="text-[11px] text-neutral-200 truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 背景纹理 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">背景纹理</h3>
                <div className="flex gap-2">
                  {BACKGROUND_TEXTURE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateProject({
                        theme: { ...project.theme, backgroundTexture: opt.value },
                      })}
                      className={`flex flex-col items-center gap-1 ${
                        project.theme.backgroundTexture === opt.value
                          ? 'opacity-100'
                          : 'opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div
                        className={`w-[30px] h-[30px] rounded border-2 ${
                          project.theme.backgroundTexture === opt.value
                            ? 'border-blue-500'
                            : 'border-neutral-500'
                        }`}
                        style={{
                          backgroundColor: project.theme.backgroundColor,
                          ...getTextureCSS(opt.value, project.theme.speakerNameColor),
                          opacity: 0.8,
                        }}
                      />
                      <span className="text-[10px] text-neutral-400">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 字号 */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-neutral-300">字号</h3>
                <div className="flex gap-2">
                  {(Object.keys(FONT_SIZE_NAMES) as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`flex-1 px-3 py-2 text-xs rounded ${
                        project.fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                      }`}
                    >
                      {FONT_SIZE_NAMES[size]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右栏 — 说话人设置 */}
            <div className="flex-1 p-4 space-y-4 overflow-auto">
              <h3 className="text-sm font-medium text-neutral-300">说话人设置</h3>
              {project.participants.map((participant) => (
                <div key={participant.id} className="space-y-2 p-3 bg-neutral-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                      style={{
                        background: participant.avatarUrl
                          ? `url(${participant.avatarUrl}) center/cover`
                          : participant.side === 'left'
                          ? '#C7C7CC'
                          : '#1B8C6E',
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {!participant.avatarUrl && participant.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, { name: e.target.value })}
                        className="w-full px-2 py-1 bg-neutral-600 border border-neutral-500 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                        placeholder={participant.side === 'left' ? '左侧说话人名称' : '右侧说话人名称'}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[participant.id] = el)}
                      onChange={(e) => handleAvatarUpload(participant.id, e)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRefs.current[participant.id]?.click()}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {participant.avatarUrl ? '更换头像' : '上传头像'}
                    </button>
                    {participant.avatarUrl && (
                      <button
                        onClick={() => updateParticipant(participant.id, { avatarUrl: '' })}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        删除头像
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 导出 Tab ===== */}
        {activeTab === 'export' && (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-neutral-300">导出图片</h3>
              <p className="text-xs text-neutral-500">
                {project.layoutMode === 'long'
                  ? `长图模式: ${LONG_IMAGE.width}px 宽，高度随内容自适应，2x 高清`
                  : `当前尺寸: ${CANVAS_PRESETS[project.canvasPreset].width} x ${CANVAS_PRESETS[project.canvasPreset].height} 像素，2x 高清`
                }
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => exportPage(currentPageIndex)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium"
              >
                <Download size={18} />
                {project.layoutMode === 'long' ? '导出长图' : '导出当前页'}
              </button>
              {project.layoutMode !== 'long' && (
                <button
                  onClick={exportAllPages}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium"
                >
                  <Download size={18} />
                  导出全部页面 ({project.pages.length} 页)
                </button>
              )}
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
