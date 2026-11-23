import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HourBar = { label: string; value: number };

type Area = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconSize: number;
  busy: number;
  capacity: number;
  hours: string;
};

const OPEN_HOURS = 'Open today 6:00 AM – 11:00 PM';

const HOURLY: HourBar[] = [
  { label: '6a', value: 22 },
  { label: '', value: 35 },
  { label: '', value: 48 },
  { label: '9a', value: 41 },
  { label: '', value: 37 },
  { label: '', value: 44 },
  { label: '12p', value: 63 },
  { label: '', value: 58 },
  { label: '', value: 50 },
  { label: '3p', value: 62 },
  { label: '', value: 74 },
  { label: '', value: 88 },
  { label: '6p', value: 92 },
  { label: '', value: 81 },
  { label: '', value: 66 },
  { label: '9p', value: 45 },
  { label: '', value: 28 },
  { label: '', value: 12 },
];

const BAR_COLORS = [
  '#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22',
  '#2ecc71', '#fd79a8', '#0984e3', '#d35400', '#6c5ce7', '#00b894',
  '#e84393', '#fdcb6e', '#74b9ff', '#a29bfe', '#ff7675', '#55efc4',
];

const AREAS: Area[] = [
  { id: 'weights', name: 'Weight Room', icon: 'barbell', iconSize: 28, busy: 78, capacity: 120, hours: '6:00 AM – 11:00 PM' },
  { id: 'cardio', name: 'Cardio Deck', icon: 'bicycle', iconSize: 16, busy: 55, capacity: 90, hours: '6:00 AM – 11:00 PM' },
  { id: 'pool', name: 'Pool', icon: 'water', iconSize: 22, busy: 30, capacity: 60, hours: '7:00 AM – 9:00 PM' },
  { id: 'courts', name: 'Courts', icon: 'basketball', iconSize: 19, busy: 64, capacity: 80, hours: '8:00 AM – 10:30 PM' },
  { id: 'climbing', name: 'Climbing Wall', icon: 'trending-up', iconSize: 32, busy: 41, capacity: 25, hours: '3:00 PM – 10:00 PM' },
];

function busyLabel(value: number) {
  if (value >= 75) return 'Very busy';
  if (value >= 50) return 'Moderately busy';
  if (value >= 30) return 'A little busy';
  return 'Not busy';
}

function timeNow() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function RecCenterScreen() {
  const [busy, setBusy] = useState<number>(62);
  const [updated, setUpdated] = useState<string>('5:42 PM');

  const refresh = () => {
    setTimeout(() => {
      const change = Math.round(Math.random() * 8) - 4;
      setBusy((prev) => Math.min(100, Math.max(0, prev + change)));
      setUpdated(timeNow());
    }, 1800);
  };

  const openArea = (area: Area) => {
    const people = Math.round((area.busy / 100) * area.capacity);
    Alert.alert(
      area.name,
      `${busyLabel(area.busy)} (${area.busy}%)\nAbout ${people} of ${area.capacity} people\nHours today: ${area.hours}`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 26 }}>
      <Text style={styles.title}>Rec Center</Text>
      <Text style={styles.subtitle}>Live crowd meter</Text>

      <View style={styles.nowBox}>
        <Text style={styles.nowLabel}>How busy right now</Text>
        <Text style={styles.nowValue}>
          {busy}% · {busyLabel(busy)}
        </Text>
        <Text style={styles.nowValue}>{OPEN_HOURS}</Text>
        <Text style={styles.updated}>Last updated {updated}</Text>
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Busy by hour (today)</Text>
      <View style={styles.chart}>
        {HOURLY.map((bar, i) => (
          <View key={i} style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[styles.bar, { height: `${bar.value}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }]}
              />
            </View>
            <Text style={styles.barLabel}>{bar.label}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 9 }]}>Areas</Text>
      {AREAS.map((area) => (
        <TouchableWithoutFeedback key={area.id} onPress={() => openArea(area)}>
          <View style={styles.areaRow}>
            <Ionicons
              name={area.icon}
              size={area.iconSize}
              color="#2d3436"
              style={{ marginTop: area.id === 'pool' ? 6 : 0 }}
            />
            <View style={styles.areaText}>
              <Text style={styles.areaName}>{area.name}</Text>
              <Text style={styles.areaBusy}>
                {busyLabel(area.busy)} · {area.busy}%
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#999" />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f4f2',
    paddingHorizontal: 7,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1e272e',
    marginTop: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 3,
  },
  nowBox: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },
  nowLabel: {
    fontSize: 13,
    color: '#636e72',
  },
  nowValue: {
    fontSize: 15,
    color: '#2d3436',
    marginTop: 2,
  },
  updated: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 8,
    marginTop: 13,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e272e',
    marginTop: 20,
    marginBottom: 4,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 4,
    borderRadius: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    height: 120,
    width: 10,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabel: {
    fontSize: 9,
    color: '#bbb',
    marginTop: 3,
    height: 12,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 11,
    marginBottom: 2,
    borderRadius: 6,
  },
  areaText: {
    flex: 1,
    marginLeft: 8,
  },
  areaName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
  },
  areaBusy: {
    fontSize: 13,
    color: '#636e72',
  },
});
