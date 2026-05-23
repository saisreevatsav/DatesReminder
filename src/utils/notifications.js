import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestPermissions = async () => {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleNotification = async (record, categoryName) => {
  const dateField = record.expiryDate || record.dueDate || record.renewalDate;
  if (!dateField) return;

  const dueDate = new Date(dateField);
  const notifyDays = record.notifyDaysBefore || 7;
  const triggerDate = new Date(dueDate);
  triggerDate.setDate(triggerDate.getDate() - notifyDays);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate <= new Date()) return;

  const title = record.cardName || record.policyName || record.provider ||
    record.software || record.vehicleNo || record.operator ||
    record.accountNo || record.title || categoryName;

  await Notifications.cancelScheduledNotificationAsync(record.id).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: record.id,
    content: {
      title: `⏰ ${categoryName} Reminder`,
      body: `"${title}" is due in ${notifyDays} day(s) on ${dueDate.toLocaleDateString('en-IN')}`,
      data: { recordId: record.id, categoryId: record.categoryId },
    },
    trigger: { date: triggerDate },
  });
};

export const cancelNotification = async (recordId) => {
  await Notifications.cancelScheduledNotificationAsync(recordId).catch(() => {});
};

export const rescheduleAll = async (records, categories) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const record of records) {
    const cat = categories.find((c) => c.id === record.categoryId);
    if (cat) await scheduleNotification(record, cat.name);
  }
};
