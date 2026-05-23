import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteRecord } from '../utils/storage';
import { cancelNotification } from '../utils/notifications';
import { getDaysUntil, formatDate, getStatusColor, getStatusLabel, getRecordDateField } from '../utils/dateHelpers';

export default function RecordDetailScreen({ route, navigation }) {
  const { record, category } = route.params;
  const dateStr = getRecordDateField(record);
  const days = getDaysUntil(dateStr);
  const statusColor = getStatusColor(days);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: category.name,
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('AddEditRecord', { category, record })}>
            <MaterialCommunityIcons name="pencil" size={22} color="#fff" style={{ marginRight: 14 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete}>
            <MaterialCommunityIcons name="trash-can" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const confirmDelete = () => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteRecord(record.id);
          await cancelNotification(record.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
        <MaterialCommunityIcons name={category.icon} size={28} color="#fff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.statusLabel}>{getStatusLabel(days)}</Text>
          <Text style={styles.statusDate}>{formatDate(dateStr)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {category.fields.map((field) => {
          const val = record[field.key];
          if (!val) return null;
          return (
            <View key={field.key} style={styles.row}>
              <Text style={styles.rowLabel}>{field.label}</Text>
              <Text style={styles.rowValue}>
                {field.type === 'date' ? formatDate(val) : String(val)}
              </Text>
            </View>
          );
        })}
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notify Before</Text>
          <Text style={styles.rowValue}>{record.notifyDaysBefore || 7} days</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 14,
    padding: 16, marginBottom: 16,
  },
  statusLabel: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statusDate: { color: '#ffffffcc', fontSize: 13, marginTop: 2 },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  rowLabel: { fontSize: 14, color: '#757575', flex: 1 },
  rowValue: { fontSize: 14, color: '#212121', fontWeight: '600', flex: 1, textAlign: 'right' },
});
