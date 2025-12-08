export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, reviewText: string, reviewHtml: string) => Promise<void>;
  initialRating?: number;
  initialReviewText?: string;
  initialReviewHtml?: string;
  isEditMode?: boolean;
  bookTitle: string;
}
