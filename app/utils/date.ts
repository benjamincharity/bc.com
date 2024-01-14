export const formatDate = (date: string | undefined) => {
  return date
    ? new Date(date).toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
};
