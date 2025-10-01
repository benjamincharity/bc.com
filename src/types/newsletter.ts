/**
 * Newsletter subscription type definitions
 */

export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
  source: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
}

export interface NewsletterFormData {
  email: string;
  source?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
  error?: {
    code: 'INVALID_EMAIL' | 'ALREADY_SUBSCRIBED' | 'SERVICE_ERROR';
    message: string;
  };
}

export interface NewsletterFormProps {
  source?: string;
  className?: string;
  onSuccess?: (data: NewsletterResponse) => void;
  onError?: (error: string) => void;
}

export interface NewsletterApiRequest {
  email: string;
  source?: string;
}

export interface NewsletterApiResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
  error?: {
    code: string;
    message: string;
  };
}