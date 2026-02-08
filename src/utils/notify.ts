import { toast } from 'react-toastify';

type NotifyOptions = {
  autoClose?: number;
};

const canNotify = () => typeof window !== 'undefined';

export const notify = {
  success: (message: string, options?: NotifyOptions) =>
    canNotify() ? toast.success(message, options) : undefined,
  error: (message: string, options?: NotifyOptions) =>
    canNotify() ? toast.error(message, options) : undefined,
  info: (message: string, options?: NotifyOptions) =>
    canNotify() ? toast.info(message, options) : undefined,
  warning: (message: string, options?: NotifyOptions) =>
    canNotify() ? toast.warning(message, options) : undefined,
};
