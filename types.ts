
export enum AppMode {
  OBSERVE = 'Observe',
  SUGGEST = 'Suggest',
  APPLY = 'Apply'
}

export interface ClipboardItem {
  id: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'code' | 'form-data';
  appSource?: string;
  analysis?: string;
}

export interface SavedFlow {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type BubbleState = 'idle' | 'hover' | 'active' | 'expanded';
