export interface FormattingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormattingExample {
  name: string;
  description: string;
  syntax: string;
  preview: string;
}
