import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getRecords, deleteRecord } from '../utils/storage';
import { cancelNotification } from '../utils/notifications';
import { getDaysUntil, formatDate, getStatusColor, getStatusLabel, getRecordDateField } from '../utils/dateHelpers';

export default function CategoryRecordsScreen({ route, navigation }) {
  const { category } = route.params;
  const [records, setRecords] = useState([]);

  const load = async () => {
    const data = await getRecords(category.id);
    setRecords(data.sort((a, b) => getDaysUntil(getRecordDateField(a)) - getDaysUntil(getRecordDateField(b))));
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: category.name,
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate('AddEditRecord', { category })}
        >
          <MaterialCommunityIcons name="plus" size={26} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, category]);

  const confirmDelete = (record) => {
    Alert.alert('Delete Record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteRecord(record.id);
          await cancelNotification(record.id);
          load();
        },
      },
    ]);
  };

  const getTitle = (r) =>
    r.cardName || r.policyName || r.provider || r.software ||
    r.vehicleNo || r.planName || r.accountNo || r.title || r.number || '—';

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const dateStr = getRecordDateField(item);
          const days = getDaysUntil(dateStr);
          const color = getStatusColor(days);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecordDetail', { record: item, category })}
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{getTitle(item)}</Text>
                <Text style={styles.cardDate}>{formatDate(dateStr)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={[styles.badge, { backgroundColor: color }]}>
                  <Text style={styles.badgeText}>{getStatusLabel(days)}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => navigation.navigate('AddEditRecord', { category, record: item })}>
                    <MaterialCommunityIcons name="pencil" size={20} color="#1E88E5" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(item)} style={{ marginLeft: 12 }}>
                    <MaterialCommunityIcons name="trash-can" size={20} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="plus-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No records yet.{'\n'}Tap + to add one.</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: category.color }]}
        onPress={() => navigation.navigate('AddEditRecord', { category })}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#212121' },
  cardDate: { fontSize: 12, color: '#9E9E9E', marginTop: 3 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', marginTop: 8 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', elevation: 6,
  },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 12, fontSize: 15 },
});
