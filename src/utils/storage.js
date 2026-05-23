import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'dates_reminder_records';

const getAll = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

const saveAll = async (records) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(records));
};

export const getRecords = async (categoryId) => {
  const all = await getAll();
  return categoryId ? all.filter((r) => r.categoryId === categoryId) : all;
};

export const addRecord = async (categoryId, data) => {
  const record = {
    id: Date.now().toString(),
    categoryId,
    ...data,
    notifyDaysBefore: data.notifyDaysBefore || 7,
    createdAt: new Date().toISOString(),
  };
  const all = await getAll();
  all.push(record);
  await saveAll(all);
  return record;
};

export const updateRecord = async (id, data) => {
  const all = await getAll();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...data };
  await saveAll(all);
};

export const deleteRecord = async (id) => {
  const all = await getAll();
  await saveAll(all.filter((r) => r.id !== id));
};
