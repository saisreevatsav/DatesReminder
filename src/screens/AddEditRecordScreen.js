import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addRecord, updateRecord } from '../utils/storage';
import { scheduleNotification } from '../utils/notifications';
import { formatDate } from '../utils/dateHelpers';

const NOTIFY_OPTIONS = [1, 3, 7, 15, 30];

export default function AddEditRecordScreen({ route, navigation }) {
  const { category, record } = route.params;
  const isEdit = !!record;

  const [form, setForm] = useState({});
  const [notifyDays, setNotifyDays] = useState(7);
  const [datePickerField, setDatePickerField] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? 'Edit Record' : `Add ${category.name}` });
    if (isEdit) {
      setForm(record);
      setNotifyDays(record.notifyDaysBefore || 7);
    }
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openDatePicker = (key) => {
    setDatePickerField(key);
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date && datePickerField) {
      set(datePickerField, date.toISOString().split('T')[0]);
    }
  };

  const validate = () => {
    for (const field of category.fields) {
      if (field.required && !form[field.key]) {
        Alert.alert('Required', `${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;
    const data = { ...form, notifyDaysBefore: notifyDays };
    let saved;
    if (isEdit) {
      await updateRecord(record.id, data);
      saved = { ...record, ...data };
    } else {
      saved = await addRecord(category.id, data);
    }
    await scheduleNotification(saved, category.name);
    navigation.goBack();
  };

  const renderField = (field) => {
    if (field.type === 'date') {
      return (
        <TouchableOpacity key={field.key} style={styles.dateInput} onPress={() => openDatePicker(field.key)}>
          <Text style={form[field.key] ? styles.dateText : styles.datePlaceholder}>
            {form[field.key] ? formatDate(form[field.key]) : `Select ${field.label}`}
          </Text>
          <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
        </TouchableOpacity>
      );
    }

    if (field.type === 'select') {
      return (
        <View key={field.key} style={styles.selectRow}>
          {field.options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.selectChip, form[field.key] === opt && styles.selectChipActive]}
              onPress={() => set(field.key, opt)}
            >
              <Text style={[styles.selectChipText, form[field.key] === opt && styles.selectChipTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        key={field.key}
        style={styles.input}
        placeholder={field.label + (field.required ? ' *' : '')}
        placeholderTextColor="#BDBDBD"
        value={form[field.key] ? String(form[field.key]) : ''}
        onChangeText={(v) => set(field.key, v)}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      />
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {category.fields.map((field) => (
        <View key={field.key} style={styles.fieldWrap}>
          <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
          {renderField(field)}
        </View>
      ))}

      <Text style={styles.label}>Notify me before</Text>
      <View style={styles.selectRow}>
        {NOTIFY_OPTIONS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.selectChip, notifyDays === d && styles.selectChipActive]}
            onPress={() => setNotifyDays(d)}
          >
            <Text style={[styles.selectChipText, notifyDays === d && styles.selectChipTextActive]}>
              {d}d
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: category.color }]} onPress={save}>
        <Text style={styles.saveBtnText}>{isEdit ? 'Update Record' : 'Save Record'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form[datePickerField] ? new Date(form[datePickerField]) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    fontSize: 15, color: '#212121', borderWidth: 1, borderColor: '#E0E0E0',
  },
  dateInput: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  dateText: { fontSize: 15, color: '#212121' },
  datePlaceholder: { fontSize: 15, color: '#BDBDBD' },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0',
  },
  selectChipActive: { backgroundColor: '#1E88E5', borderColor: '#1E88E5' },
  selectChipText: { fontSize: 13, color: '#555' },
  selectChipTextActive: { color: '#fff', fontWeight: '700' },
  saveBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
