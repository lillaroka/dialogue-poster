// 说话人位置
export type Side = 'left' | 'right';

// 间距档位
export type Spacing = 'narrow' | 'normal' | 'wide';

// 气泡样式
export type BubbleStyle = 'speakerA' | 'speakerB';

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
  backgroundColor: string;
  leftBubbleColor: string;
  rightBubbleColor: string;
  leftShadowColor: string;
  rightShadowColor: string;
  textColor: string;
  borderRadius: number;
  padding: number;
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
  pages: Page[];
  participants: Participant[];
  theme: Theme;
}

// 间距映射
export const SPACING_VALUES: Record<Spacing, number> = {
  narrow: 16,
  normal: 24,
  wide: 36,
};

// 默认主题
export const DEFAULT_THEME: Theme = {
  backgroundColor: '#F8F7F5',
  leftBubbleColor: '#E8EAF6',
  rightBubbleColor: '#F5F1E8',
  leftShadowColor: '#D1D9E6',
  rightShadowColor: '#E8DFC8',
  textColor: '#333333',
  borderRadius: 12,
  padding: 20,
  fontSize: 16,
  lineHeight: 1.6,
};

// 画布尺寸
export const CANVAS_WIDTH = 1440;
export const CANVAS_HEIGHT = 1920;
export const SAFE_MARGIN = 80;
