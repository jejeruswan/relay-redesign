import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Slot = {
  id: string;
  time: string;
  provider: string;
};

type Day = {
  id: string;
  weekday: string;
  date: string;
  slots: Slot[];
};

const REASONS = ['Cold/flu symptoms', 'Vaccination', 'Mental health check-in', 'Injury', 'Other'];

const SLOT_TIMES: Record<string, [string, string][]> = {
  mon: [['10:00 AM', 'Dr. Patel'], ['10:30 AM', 'Dr. Patel'], ['11:30 AM', 'N.P. Garcia'], ['2:00 PM', 'Dr. Kim']],
  tue: [['9:30 AM', 'N.P. Garcia'], ['1:00 PM', 'Dr. Okafor'], ['3:30 PM', 'Dr. Okafor']],
  wed: [['10:00 AM', 'Dr. Kim'], ['10:30 AM', 'Dr. Kim'], ['11:00 AM', 'Dr. Patel'], ['1:30 PM', 'N.P. Garcia'], ['4:00 PM', 'Dr. Okafor']],
  thu: [['11:00 AM', 'Dr. Okafor'], ['2:30 PM', 'Dr. Patel']],
  fri: [['9:00 AM', 'N.P. Garcia'], ['10:30 AM', 'Dr. Kim'], ['12:00 PM', 'Dr. Kim']],
  sat: [],
  sun: [],
};

const DAYS: Day[] = [
  ['mon', 'Mon', 'Nov 30'],
  ['tue', 'Tue', 'Dec 1'],
  ['wed', 'Wed', 'Dec 2'],
  ['thu', 'Thu', 'Dec 3'],
  ['fri', 'Fri', 'Dec 4'],
  ['sat', 'Sat', 'Dec 5'],
  ['sun', 'Sun', 'Dec 6'],
].map(([id, weekday, date]) => ({
  id,
  weekday,
  date,
  slots: SLOT_TIMES[id].map(([time, provider], index) => ({ id: `${id}-${index}`, time, provider })),
}));

export default function CampusHealthScreen() {
  const [reason, setReason] = useState<string | null>(null);
  const [dayId, setDayId] = useState(DAYS[0].id);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const day = DAYS.find((d) => d.id === dayId) ?? DAYS[0];
  const slot = day.slots.find((s) => s.id === slotId);

  const selectDay = (id: string) => {
    setDayId(id);
    setSlotId(null);
  };

  const confirm = () => {
    if (!reason || !slot) {
      Alert.alert('Missing info', 'Please choose a reason for your visit and a time slot.');
      return;
    }
    setTimeout(() => {
      Alert.alert(
        'Appointment booked',
        `${reason}\n${day.weekday}, ${day.date} at ${slot.time} with ${slot.provider}`,
      );
    }, 1800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="medkit-outline" size={28} color="#2A7F72" />
        <Text style={styles.appName}>Campus Health</Text>
        <Text style={styles.subtitle}>Book a visit at the student health center</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Reason for visit</Text>
        <View style={styles.innerCard}>
          <View style={styles.reasonWrap}>
            {REASONS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.reasonChip, reason === r && styles.reasonChipActive]}
                onPress={() => setReason(r)}
              >
                <Text style={[styles.reasonText, reason === r && styles.reasonTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose a day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {DAYS.map((d) => (
            <TouchableOpacity
              key={d.id}
              style={[styles.datePill, d.id === dayId && styles.datePillActive]}
              onPress={() => selectDay(d.id)}
            >
              <Text style={[styles.dateText, d.id === dayId && { color: '#fff' }]}>
                {d.weekday} {d.date}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.innerCard}>
          <Text style={styles.label}>Available times</Text>
          <View style={styles.slotWrap}>
            {day.slots.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.slot, s.id === slotId && styles.slotActive]}
                onPress={() => setSlotId(s.id)}
              >
                <Text style={[styles.slotText, s.id === slotId && { color: '#fff' }]}>
                  {s.time} · {s.provider}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Notes for your provider</Text>
        <View style={styles.innerCard}>
          <TextInput
            style={styles.notesInput}
            placeholder="Symptoms, how long, anything else we should know"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={confirm}>
        <Text style={styles.confirmText}>Confirm appointment</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 12, color: '#6B7F7B', textAlign: 'center', marginTop: 14 }}>
        For emergencies, call 911. Cancel at least 2 hours before your visit.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF5F3',
  },
  content: {
    padding: 6,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3D38',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#557069',
    marginTop: 13,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D5E3E0',
    padding: 5,
    marginBottom: 7,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  innerCard: {
    backgroundColor: '#F8FBFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDE8E5',
    padding: 13,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F3D38',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#557069',
    textAlign: 'center',
    marginBottom: 3,
  },
  reasonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  reasonChip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: '#E6ECEB',
    borderWidth: 1,
    borderColor: '#D3DCDA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonChipActive: {
    backgroundColor: '#2A7F72',
    borderColor: '#2A7F72',
  },
  reasonText: {
    fontSize: 14,
    color: '#3A4D49',
    textAlign: 'center',
  },
  reasonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  dateRow: {
    gap: 6,
    paddingTop: 17,
  },
  datePill: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C9D8D4',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  datePillActive: {
    backgroundColor: '#2A7F72',
    borderColor: '#2A7F72',
  },
  dateText: {
    fontSize: 12,
    color: '#3A4D49',
  },
  slotWrap: {
    alignItems: 'center',
    gap: 6,
  },
  slot: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C9D8D4',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  slotActive: {
    backgroundColor: '#2A7F72',
    borderColor: '#2A7F72',
  },
  slotText: {
    fontSize: 12,
    color: '#3A4D49',
    textAlign: 'center',
  },
  confirmButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: '#E6ECEB',
    borderWidth: 1,
    borderColor: '#D3DCDA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  confirmText: {
    fontSize: 14,
    color: '#3A4D49',
  },
  notesInput: {
    minHeight: 80,
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    textAlignVertical: 'top',
  },
});
