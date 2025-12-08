export interface RichTextEditorProps {
  value: string;
  onChange: (value: string, html: string) => void;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  error?: string;
  onShowHelp?: () => void;
}

export interface FormattingButton {
  name: string;
  icon: string;
  title: string;
  action: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'link' | 'spoiler' | 'heading' | 'quote' | 'code' | 'list';
  tag?: string;
  requiresInput?: boolean;
}

export interface SelectionInfo {
  start: number;
  end: number;
  selectedText: string;
}
