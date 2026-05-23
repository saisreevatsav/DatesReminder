export const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const getStatusColor = (days) => {
  if (days === null) return '#9E9E9E';
  if (days < 0) return '#B71C1C';
  if (days <= 7) return '#E53935';
  if (days <= 30) return '#FB8C00';
  return '#43A047';
};

export const getStatusLabel = (days) => {
  if (days === null) return 'No date';
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Due Today!';
  if (days === 1) return 'Due Tomorrow!';
  return `${days} days left`;
};

export const getRecordDateField = (record) =>
  record.expiryDate || record.dueDate || record.renewalDate;
