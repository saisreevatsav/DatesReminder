import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { CATEGORIES } from '../config/categories';
import { getRecords } from '../utils/storage';

export default function CategoriesScreen({ navigation }) {
  const [counts, setCounts] = useState({});

  useFocusEffect(useCallback(() => {
    getRecords().then((all) => {
      const c = {};
      all.forEach((r) => { c[r.categoryId] = (c[r.categoryId] || 0) + 1; });
      setCounts(c);
    });
  }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={CATEGORIES}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={() => navigation.navigate('CategoryRecords', { category: item })}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
            </View>
            <Text style={styles.tileName}>{item.name}</Text>
            <Text style={styles.tileCount}>{counts[item.id] || 0} records</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  tile: {
    flex: 1, margin: 6, backgroundColor: '#fff', borderRadius: 14,
    padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  tileName: { fontSize: 13, fontWeight: '700', color: '#212121', textAlign: 'center' },
  tileCount: { fontSize: 11, color: '#9E9E9E', marginTop: 4 },
});
