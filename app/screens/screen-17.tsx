import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type ExtendOption = {
  id: string;
  minutes: number;
  price: number;
};

type Session = {
  id: string;
  date: string;
  location: string;
  duration: string;
  cost: string;
};

const ZONE = {
  number: '4521',
  street: 'Telegraph Ave & Durant Ave',
  rate: 3.0,
  maxMinutes: 120,
};

const PLATE = '8ABC123';
const STARTING_MINUTES = 42;
const USED_MINUTES = 60;

const EXTEND_OPTIONS: ExtendOption[] = [
  { id: 'e15', minutes: 15, price: 0.75 },
  { id: 'e30', minutes: 30, price: 1.5 },
  { id: 'e60', minutes: 60, price: 3.0 },
];

const RECENT_SESSIONS: Session[] = [
  { id: 's1', date: 'Nov 20', location: 'Zone 4518 · Bancroft Way', duration: '1 hr 30 min', cost: '$4.50' },
  { id: 's2', date: 'Nov 18', location: 'Zone 4302 · Shattuck Ave', duration: '45 min', cost: '$2.25' },
  { id: 's3', date: 'Nov 14', location: 'Zone 4521 · Telegraph Ave', duration: '2 hr', cost: '$6.00' },
  { id: 's4', date: 'Nov 11', location: 'Zone 4610 · College Ave', duration: '20 min', cost: '$1.00' },
];

function formatRemaining(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
}

export default function MeterPayScreen() {
  const [remaining, setRemaining] = useState(STARTING_MINUTES);
  const [used, setUsed] = useState(USED_MINUTES);
  const [selectedId, setSelectedId] = useState<string>('e30');

  const selected = EXTEND_OPTIONS.find((o) => o.id === selectedId) ?? EXTEND_OPTIONS[0];

  const handleExtend = () => {
    if (used + selected.minutes > ZONE.maxMinutes) {
      Alert.alert('Over the limit', `Zone ${ZONE.number} has a 2 hr max. You can add up to ${ZONE.maxMinutes - used} more minutes.`);
      return;
    }
    Alert.alert(
      'Extend parking?',
      `Add ${selected.minutes} min for $${selected.price.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Extend',
          onPress: () => {
            setRemaining((r) => r + selected.minutes);
            setUsed((u) => u + selected.minutes);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.appTitle}>Meter Pay</Text>
      <Text style={styles.subtitle}>Active session</Text>

      <View style={styles.sessionCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={26} color="#e0245e" />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoMain}>Zone {ZONE.number}</Text>
            <Text style={styles.infoSub}>{ZONE.street}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="car-sport" size={18} color="#8e44ad" style={{ marginTop: 6 }} />
          <Text style={[styles.infoMain, { marginLeft: 14 }]}>Plate {PLATE}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="clock-outline" size={30} color="#27ae60" />
          <Text style={styles.infoMain}>Time remaining {formatRemaining(remaining)}</Text>
        </View>
        <View style={[styles.infoRow, { paddingLeft: 4 }]}>
          <Ionicons name="cash-outline" size={20} color="#f39c12" />
          <Text style={styles.infoMain}>${ZONE.rate.toFixed(2)}/hr · 2 hr max</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Extend time</Text>
      <View style={styles.optionRow}>
        {EXTEND_OPTIONS.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <Pressable
              key={option.id}
              onPress={() => setSelectedId(option.id)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text style={styles.optionMinutes}>+{option.minutes} min</Text>
              <Text style={styles.optionPrice}>${option.price.toFixed(2)}</Text>
            </Pressable>
          );
        })}
      </View>

      <TouchableOpacity style={styles.extendButton} onPress={handleExtend}>
        <Text style={styles.extendButtonText}>
          Extend {selected.minutes} min · ${selected.price.toFixed(2)}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent sessions</Text>
      {RECENT_SESSIONS.map((s) => (
        <View key={s.id} style={styles.sessionRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sessionLocation}>{s.location}</Text>
            <Text style={styles.sessionMeta}>
              {s.date} · {s.duration}
            </Text>
          </View>
          <Text style={styles.sessionCost}>{s.cost}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#ff5722',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: '#b5b5b5',
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#f2f7ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoTextWrap: {
    marginLeft: 8,
    flex: 1,
  },
  infoMain: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222222',
    marginLeft: 8,
  },
  infoSub: {
    fontSize: 13,
    color: '#aaaaaa',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#16a085',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dddddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  optionSelected: {
    borderColor: '#c9c9c9',
  },
  optionMinutes: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e44ad',
  },
  optionPrice: {
    fontSize: 11,
    color: '#aaaaaa',
  },
  extendButton: {
    backgroundColor: '#007AFF',
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  extendButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  sessionLocation: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  sessionMeta: {
    fontSize: 12,
    color: '#b5b5b5',
    marginTop: 2,
  },
  sessionCost: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e0245e',
  },
});
