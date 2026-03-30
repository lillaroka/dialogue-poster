import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Project,
  Page,
  DialogueBlock,
  Participant,
  Spacing,
  DEFAULT_THEME,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SAFE_MARGIN,
} from '../types';

// 生成唯一ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// 默认参与者
const defaultParticipants: Participant[] = [
  {
    id: 'participant-left',
    side: 'left',
    name: '说话人A',
    avatarUrl: '',
    bubbleStyle: 'speakerA',
  },
  {
    id: 'participant-right',
    side: 'right',
    name: '说话人B',
    avatarUrl: '',
    bubbleStyle: 'speakerB',
  },
];

// 默认对话块（Mock 数据）
const defaultBlocks: DialogueBlock[] = [
  {
    id: generateId(),
    participantId: 'participant-left',
    text: '你好，今天想和你聊聊关于设计的话题。在数字产品设计中，什么样的对话界面最能传达"舒适感"和"专业感"的平衡？',
    spacing: 'normal',
  },
  {
    id: generateId(),
    participantId: 'participant-right',
    text: '这是一个很好的问题。我认为关键在于"克制的细节"——不是堆砌视觉效果，而是通过微妙的阴影、柔和的圆角、以及恰当的留白来营造氛围。',
    spacing: 'normal',
  },
  {
    id: generateId(),
    participantId: 'participant-left',
    text: '"克制的细节"这个表述很精准。你能具体说说吗？',
    spacing: 'normal',
  },
  {
    id: generateId(),
    participantId: 'participant-right',
    text: '当然。比如圆角，过大会显得随意，过小则显得生硬。12px 是一个经验值，既保留了柔和感，又不失专业。再比如阴影，我们使用内阴影而非外阴影，这样气泡看起来更轻盈，像纸张浮在背景上。',
    spacing: 'normal',
  },
  {
    id: generateId(),
    participantId: 'participant-left',
    text: '这种设计哲学其实也适用于更广泛的场景——不只是视觉设计，也包括产品设计、甚至生活方式。少即是多，但"少"不等于简陋。',
    spacing: 'wide',
  },
  {
    id: generateId(),
    participantId: 'participant-right',
    text: '完全同意。好的设计应该是"看不见的设计"——用户不会注意到它有多好，但会觉得使用起来很舒服。当他们遇到糟糕的设计时，才会意识到好设计的重要性。',
    spacing: 'normal',
  },
];

// 默认页面
const defaultPages: Page[] = [
  {
    id: generateId(),
    blocks: defaultBlocks,
  },
];

// 默认项目
const defaultProject: Project = {
  id: generateId(),
  title: '关于设计的对话',
  subtitle: '克制与细节',
  showHeader: true,
  showFooter: true,
  showPageNumber: true,
  pages: defaultPages,
  participants: defaultParticipants,
  theme: DEFAULT_THEME,
};

interface StoreState {
  // 项目数据
  project: Project;

  // UI 状态
  selectedBlockId: string | null;
  currentPageIndex: number;
  previewScale: number;

  // 项目操作
  updateProject: (updates: Partial<Project>) => void;

  // 页面操作
  addPage: () => void;
  deletePage: (pageId: string) => void;
  moveBlockToPage: (blockId: string, fromPageIndex: number, toPageIndex: number) => void;

  // 对话块操作
  addBlock: (pageIndex: number, participantId: string) => void;
  updateBlock: (pageIndex: number, blockId: string, updates: Partial<DialogueBlock>) => void;
  deleteBlock: (pageIndex: number, blockId: string) => void;
  moveBlock: (pageIndex: number, blockId: string, direction: 'up' | 'down') => void;
  setSelectedBlockId: (blockId: string | null) => void;

  // 参与者操作
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;

  // UI 操作
  setCurrentPageIndex: (index: number) => void;
  setPreviewScale: (scale: number) => void;

  // 导出
  exportPage: (pageIndex: number) => Promise<void>;
  exportAllPages: () => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // 初始状态
      project: defaultProject,
      selectedBlockId: null,
      currentPageIndex: 0,
      previewScale: 0.5,

      // 项目操作
      updateProject: (updates) =>
        set((state) => ({
          project: { ...state.project, ...updates },
        })),

      // 页面操作
      addPage: () =>
        set((state) => ({
          project: {
            ...state.project,
            pages: [
              ...state.project.pages,
              { id: generateId(), blocks: [] },
            ],
          },
        })),

      deletePage: (pageId) =>
        set((state) => {
          const newPages = state.project.pages.filter((p) => p.id !== pageId);
          if (newPages.length === 0) return state;
          return {
            project: { ...state.project, pages: newPages },
            currentPageIndex: Math.min(state.currentPageIndex, newPages.length - 1),
          };
        }),

      moveBlockToPage: (blockId, fromPageIndex, toPageIndex) =>
        set((state) => {
          const pages = [...state.project.pages];
          if (toPageIndex < 0 || toPageIndex >= pages.length) return state;

          const fromPage = { ...pages[fromPageIndex] };
          const toPage = { ...pages[toPageIndex] };
          const blockIndex = fromPage.blocks.findIndex((b) => b.id === blockId);
          if (blockIndex === -1) return state;

          const [block] = fromPage.blocks.splice(blockIndex, 1);
          toPage.blocks.push(block);

          pages[fromPageIndex] = fromPage;
          pages[toPageIndex] = toPage;

          return {
            project: { ...state.project, pages },
            currentPageIndex: toPageIndex,
          };
        }),

      // 对话块操作
      addBlock: (pageIndex, participantId) =>
        set((state) => {
          const pages = [...state.project.pages];
          const newBlock: DialogueBlock = {
            id: generateId(),
            participantId,
            text: '',
            spacing: 'normal',
          };
          pages[pageIndex] = {
            ...pages[pageIndex],
            blocks: [...pages[pageIndex].blocks, newBlock],
          };
          return {
            project: { ...state.project, pages },
            selectedBlockId: newBlock.id,
          };
        }),

      updateBlock: (pageIndex, blockId, updates) =>
        set((state) => {
          const pages = [...state.project.pages];
          const blocks = pages[pageIndex].blocks.map((b) =>
            b.id === blockId ? { ...b, ...updates } : b
          );
          pages[pageIndex] = { ...pages[pageIndex], blocks };
          return { project: { ...state.project, pages } };
        }),

      deleteBlock: (pageIndex, blockId) =>
        set((state) => {
          const pages = [...state.project.pages];
          pages[pageIndex] = {
            ...pages[pageIndex],
            blocks: pages[pageIndex].blocks.filter((b) => b.id !== blockId),
          };
          return {
            project: { ...state.project, pages },
            selectedBlockId: null,
          };
        }),

      moveBlock: (pageIndex, blockId, direction) =>
        set((state) => {
          const pages = [...state.project.pages];
          const blocks = [...pages[pageIndex].blocks];
          const index = blocks.findIndex((b) => b.id === blockId);
          if (index === -1) return state;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= blocks.length) return state;

          [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
          pages[pageIndex] = { ...pages[pageIndex], blocks };

          return { project: { ...state.project, pages } };
        }),

      setSelectedBlockId: (blockId) => set({ selectedBlockId: blockId }),

      // 参与者操作
      updateParticipant: (participantId, updates) =>
        set((state) => ({
          project: {
            ...state.project,
            participants: state.project.participants.map((p) =>
              p.id === participantId ? { ...p, ...updates } : p
            ),
          },
        })),

      // UI 操作
      setCurrentPageIndex: (index) => set({ currentPageIndex: index }),
      setPreviewScale: (scale) => set({ previewScale: scale }),

      // 导出
      exportPage: async (pageIndex) => {
        const canvas = document.querySelector(`[data-page-index="${pageIndex}"]`);
        if (!canvas) return;

        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(canvas, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          pixelRatio: 2,
          cacheBust: true,
        });

        const link = document.createElement('a');
        link.download = `dialogue-${String(pageIndex + 1).padStart(2, '0')}.png`;
        link.href = dataUrl;
        link.click();
      },

      exportAllPages: async () => {
        const { project, exportPage } = get();
        for (let i = 0; i < project.pages.length; i++) {
          await exportPage(i);
          // 添加延迟避免浏览器阻塞
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      },
    }),
    {
      name: 'dialogue-poster-storage',
      partialize: (state) => ({
        project: state.project,
      }),
    }
  )
);

// 导出常量供其他模块使用
export { CANVAS_WIDTH, CANVAS_HEIGHT, SAFE_MARGIN };
