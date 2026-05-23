import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getRecords } from '../utils/storage';
import { rescheduleAll } from '../utils/notifications';
import { CATEGORIES } from '../config/categories';

export default function SettingsScreen() {
  const handleReschedule = async () => {
    const records = await getRecords();
    await rescheduleAll(records, CATEGORIES);
    Alert.alert('Done', 'All notifications have been rescheduled.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.infoBox}>
        <MaterialCommunityIcons name="cellphone-lock" size={40} color="#1E88E5" />
        <Text style={styles.infoTitle}>Offline App</Text>
        <Text style={styles.infoText}>
          All your data is stored locally on this device.{'\n'}
          No internet connection required.
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleReschedule}>
        <MaterialCommunityIcons name="bell-ring" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.btnText}>Reschedule All Notifications</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  infoBox: {
    backgroundColor: '#E3F2FD', borderRadius: 14, padding: 24,
    alignItems: 'center', marginBottom: 28,
  },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#1E88E5', marginTop: 10 },
  infoText: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  btn: {
    backgroundColor: '#1E88E5', borderRadius: 12, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
