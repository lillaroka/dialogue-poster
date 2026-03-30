// 说话人位置
export type Side = 'left' | 'right';

// 间距档位
export type Spacing = 'narrow' | 'normal' | 'wide';

// 气泡样式
export type BubbleStyle = 'speakerA' | 'speakerB';

// 画布尺寸预设
export type CanvasPreset = 'large' | 'small';

export const CANVAS_PRESETS: Record<CanvasPreset, { width: number; height: number; name: string }> = {
  large: { width: 1440, height: 2400, name: '大尺寸 1440×2400' },
  small: { width: 1080, height: 1920, name: '小尺寸 1080×1920' },
};

// 参与者（说话人）
export interface Participant {
  id: string;
  side: Side;
  name: string; // 内部标识，不显示
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

// 项目主题
export interface Theme {
  // 背景 - 暖白/淡米白
  backgroundColor: string;
  // 左侧说话人 - 偏冷色调
  leftBubbleColor: string;
  leftBubbleColorRgba: string;
  // 右侧说话人 - 偏暖色调
  rightBubbleColor: string;
  rightBubbleColorRgba: string;
  // 文字
  textColor: string;
  textColorSecondary: string;
  // 圆角 - 更柔和
  borderRadius: number;
  // 内边距
  blockPadding: number;
  // 字体
  fontSize: number;
  lineHeight: number;
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
  pages: Page[];
  participants: Participant[];
  theme: Theme;
}

// 间距映射 - 根据画布尺寸调整
export const getSpacingValues = (preset: CanvasPreset): Record<Spacing, number> => {
  const scale = preset === 'large' ? 1 : 0.75;
  return {
    narrow: Math.round(20 * scale),
    normal: Math.round(32 * scale),
    wide: Math.round(48 * scale),
  };
};

// 安全边距 - 根据画布尺寸调整
export const getSafeMargin = (preset: CanvasPreset): number => {
  return preset === 'large' ? 100 : 75;
};

// 头像尺寸
export const getAvatarSize = (preset: CanvasPreset): number => {
  return preset === 'large' ? 56 : 42;
};

// 默认主题 - 暖白底色，雾感块
export const DEFAULT_THEME: Theme = {
  // 背景色 - 暖白，接近纸面
  backgroundColor: '#FAF9F6',
  // 左侧说话人 - 偏冷，淡青灰
  leftBubbleColor: '#F0F2F4',
  leftBubbleColorRgba: 'rgba(240, 242, 244, 0.85)',
  // 右侧说话人 - 偏暖，淡米色
  rightBubbleColor: '#F5F2ED',
  rightBubbleColorRgba: 'rgba(245, 242, 237, 0.85)',
  // 文字色
  textColor: '#2C2C2C',
  textColorSecondary: '#666666',
  // 圆角 - 柔和
  borderRadius: 16,
  // 块内边距
  blockPadding: 28,
  // 字体
  fontSize: 18,
  lineHeight: 1.75,
};

// 获取画布尺寸
export const getCanvasSize = (preset: CanvasPreset) => {
  return CANVAS_PRESETS[preset];
};
