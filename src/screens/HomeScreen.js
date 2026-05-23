import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRecords } from '../utils/storage';
import { CATEGORIES } from '../config/categories';
import { getDaysUntil, formatDate, getStatusColor, getStatusLabel, getRecordDateField } from '../utils/dateHelpers';

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const all = await getRecords();
    const enriched = all
      .map((r) => {
        const cat = CATEGORIES.find((c) => c.id === r.categoryId);
        const dateStr = getRecordDateField(r);
        const days = getDaysUntil(dateStr);
        return { ...r, cat, dateStr, days };
      })
      .filter((r) => r.cat)
      .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
    setItems(enriched);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const getTitle = (r) =>
    r.cardName || r.policyName || r.provider || r.software ||
    r.vehicleNo || r.planName || r.accountNo || r.title || r.number || '—';

  const urgent = items.filter((i) => i.days !== null && i.days <= 30);
  const rest = items.filter((i) => i.days === null || i.days > 30);

  const renderItem = ({ item }) => {
    const color = getStatusColor(item.days);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('RecordDetail', { record: item, category: item.cat })}
      >
        <View style={[styles.iconBox, { backgroundColor: item.cat.color + '22' }]}>
          <MaterialCommunityIcons name={item.cat.icon} size={24} color={item.cat.color} />
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{getTitle(item)}</Text>
          <Text style={styles.cardCat}>{item.cat.name}</Text>
          <Text style={styles.cardDate}>{formatDate(item.dateStr)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{getStatusLabel(item.days)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const listData = [
    ...(urgent.length ? [{ type: 'header', title: '🔔 Upcoming (≤30 days)', id: 'h1' }] : []),
    ...urgent.map((i) => ({ type: 'item', ...i })),
    ...(rest.length ? [{ type: 'header', title: '📋 All Records', id: 'h2' }] : []),
    ...rest.map((i) => ({ type: 'item', ...i })),
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        keyExtractor={(item, idx) => item.id || idx.toString()}
        renderItem={({ item }) =>
          item.type === 'header'
            ? <Text style={styles.sectionHeader}>{item.title}</Text>
            : renderItem({ item })
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="calendar-blank" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No records yet.{'\n'}Go to Categories to add one.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#555', marginTop: 12, marginBottom: 6 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#212121' },
  cardCat: { fontSize: 12, color: '#757575', marginTop: 1 },
  cardDate: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#aaa', textAlign: 'center', marginTop: 12, fontSize: 15 },
});
