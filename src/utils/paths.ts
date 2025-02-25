export const getBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  }
  return '';
}; 