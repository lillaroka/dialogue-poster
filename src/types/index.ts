// 说话人位置
export type Side = 'left' | 'right';

// 间距档位
export type Spacing = 'narrow' | 'normal' | 'wide';

// 字号档位
export type FontSize = 'small' | 'medium' | 'large';

// 气泡样式
export type BubbleStyle = 'speakerA' | 'speakerB';

// 画布尺寸预设
export type CanvasPreset = 'large' | 'small';

export const CANVAS_PRESETS: Record<CanvasPreset, { width: number; height: number; name: string }> = {
  large: { width: 1440, height: 2400, name: '大尺寸 1440×2400' },
  small: { width: 1080, height: 1920, name: '小尺寸 1080×1920' },
};

// 布局模式
export type LayoutMode = 'paged' | 'long';

export const LONG_IMAGE = {
  width: 1080,
  maxHeight: 8000,
  bottomMargin: 80,
} as const;

// 参与者（说话人）
export interface Participant {
  id: string;
  side: Side;
  name: string;
  avatarUrl: string;
  bubbleStyle: BubbleStyle;
}

// 对话块
export interface DialogueBlock {
  id: string;
  participantId: string;
  text: string;
  spacing: Spacing;
}

// 页面
export interface Page {
  id: string;
  blocks: DialogueBlock[];
}

// 背景纹理类型
export type BackgroundTexture = 'none' | 'dots' | 'lines' | 'paper' | 'noise';

// 项目主题 — 现代聊天风格
export interface Theme {
  // 画布背景
  backgroundColor: string;
  // 标题颜色
  titleColor: string;
  // 左侧气泡（接收方）
  leftBubbleColor: string;
  leftBubbleTextColor: string;
  // 右侧气泡（发送方）
  rightBubbleColor: string;
  rightBubbleTextColor: string;
  // 说话人名称
  speakerNameColor: string;
  // 次要文字
  textColorSecondary: string;
  // 圆角
  borderRadius: number;
  // 气泡内边距
  blockPadding: number;
  // 字体
  fontSize: number;
  lineHeight: number;
  // 背景纹理
  backgroundTexture: BackgroundTexture;
}

// 完整项目
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  showHeader: boolean;
  showFooter: boolean;
  showPageNumber: boolean;
  canvasPreset: CanvasPreset;
  layoutMode: LayoutMode;
  fontSize: FontSize;
  pages: Page[];
  participants: Participant[];
  theme: Theme;
}

// 间距映射 - 根据画布尺寸调整
export const getSpacingValues = (preset: CanvasPreset): Record<Spacing, number> => {
  const scale = preset === 'large' ? 1 : 0.75;
  return {
    narrow: Math.round(8 * scale),
    normal: Math.round(24 * scale),
    wide: Math.round(48 * scale),
  };
};

// 安全边距 - 根据画布尺寸调整
export const getSafeMargin = (preset: CanvasPreset): number => {
  return preset === 'large' ? 80 : 60;
};

// 头像尺寸
export const getAvatarSize = (preset: CanvasPreset): number => {
  return preset === 'large' ? 52 : 40;
};

// 字号配置名称
export const FONT_SIZE_NAMES: Record<FontSize, string> = {
  small: '小',
  medium: '中',
  large: '大',
};

// 字号映射 - 根据画布尺寸和字号档位调整
export const getFontSizeValue = (preset: CanvasPreset, fontSize: FontSize): number => {
  if (preset === 'large') {
    switch (fontSize) {
      case 'small': return 28;
      case 'medium': return 34;
      case 'large': return 40;
    }
  }
  switch (fontSize) {
    case 'small': return 22;
    case 'medium': return 26;
    case 'large': return 30;
  }
};

// 默认主题 — 现代聊天风格：白底 + 蓝绿撞色
export const DEFAULT_THEME: Theme = {
  // 背景色 — 纯净浅灰白
  backgroundColor: '#F0F0F3',
  // 标题颜色
  titleColor: '#1A1A1A',
  // 左侧气泡 — 白色卡片感
  leftBubbleColor: '#FFFFFF',
  leftBubbleTextColor: '#1A1A1A',
  // 右侧气泡 — 鲜明蓝绿色
  rightBubbleColor: '#1B8C6E',
  rightBubbleTextColor: '#FFFFFF',
  // 说话人名称
  speakerNameColor: '#8E8E93',
  // 次要文字
  textColorSecondary: '#8E8E93',
  // 圆角 — 大圆角现代感
  borderRadius: 22,
  // 气泡内边距
  blockPadding: 26,
  // 基准字号（由 getFontSizeValue 覆盖）
  fontSize: 28,
  lineHeight: 1.65,
  // 背景纹理
  backgroundTexture: 'none',
};

// 获取画布尺寸
export const getCanvasSize = (preset: CanvasPreset) => {
  return CANVAS_PRESETS[preset];
};

// 配色方案预设
export interface ThemePreset {
  name: string;
  label: string;
  theme: Theme;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'mint',
    label: '清新薄荷',
    theme: {
      ...DEFAULT_THEME,
    },
  },
  {
    name: 'ocean',
    label: '海洋蓝',
    theme: {
      ...DEFAULT_THEME,
      rightBubbleColor: '#2B6CB0',
      rightBubbleTextColor: '#FFFFFF',
    },
  },
  {
    name: 'coral',
    label: '珊瑚橙',
    theme: {
      ...DEFAULT_THEME,
      rightBubbleColor: '#E07A5F',
      rightBubbleTextColor: '#FFFFFF',
    },
  },
  {
    name: 'lavender',
    label: '薰衣草',
    theme: {
      ...DEFAULT_THEME,
      rightBubbleColor: '#7C6FAF',
      rightBubbleTextColor: '#FFFFFF',
    },
  },
  {
    name: 'midnight',
    label: '暗夜',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#1A1B2E',
      titleColor: '#E8E8F0',
      leftBubbleColor: '#2A2B3D',
      leftBubbleTextColor: '#E0E0E0',
      rightBubbleColor: '#4A6CF7',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#8E8EA0',
      textColorSecondary: '#8E8EA0',
    },
  },
  {
    name: 'rosegold',
    label: '玫瑰金',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#FDF6F0',
      titleColor: '#3D2C2C',
      leftBubbleColor: '#FFFFFF',
      leftBubbleTextColor: '#3D2C2C',
      rightBubbleColor: '#C4726C',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#B8A09A',
      textColorSecondary: '#B8A09A',
    },
  },
  {
    name: 'matcha',
    label: '抹茶',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#F4F7F0',
      titleColor: '#2D3B1E',
      leftBubbleColor: '#FFFFFF',
      leftBubbleTextColor: '#2D3B1E',
      rightBubbleColor: '#6B8F4B',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#8FA882',
      textColorSecondary: '#8FA882',
    },
  },
  {
    name: 'amber',
    label: '琥珀',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#FBF8F1',
      titleColor: '#3D3222',
      leftBubbleColor: '#FFFFFF',
      leftBubbleTextColor: '#3D3222',
      rightBubbleColor: '#C4933F',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#B8A882',
      textColorSecondary: '#B8A882',
    },
  },
  {
    name: 'graphite',
    label: '石墨',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#F2F2F2',
      titleColor: '#1A1A1A',
      leftBubbleColor: '#FFFFFF',
      leftBubbleTextColor: '#1A1A1A',
      rightBubbleColor: '#4A4A4A',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#8A8A8A',
      textColorSecondary: '#8A8A8A',
    },
  },
  {
    name: 'deepsea',
    label: '深海',
    theme: {
      ...DEFAULT_THEME,
      backgroundColor: '#0F1923',
      titleColor: '#C0E8F0',
      leftBubbleColor: '#1A2A38',
      leftBubbleTextColor: '#D0E0E8',
      rightBubbleColor: '#00BCD4',
      rightBubbleTextColor: '#FFFFFF',
      speakerNameColor: '#6A8A98',
      textColorSecondary: '#6A8A98',
    },
  },
];

// 背景纹理选项
export const BACKGROUND_TEXTURE_OPTIONS: { value: BackgroundTexture; label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'dots', label: '圆点' },
  { value: 'lines', label: '横线' },
  { value: 'paper', label: '纸张' },
  { value: 'noise', label: '噪点' },
];
