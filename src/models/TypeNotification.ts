export type TypeNotification = {
  id: string;
  type: 'success' | 'error';
  delay: number;
  status: 'entering' | 'leaving';
  height?: number;
  message: string;
};
