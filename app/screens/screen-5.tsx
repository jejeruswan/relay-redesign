import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HourBar = { label: string; value: number };

type Area = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
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

const AREAS: Area[] = [
  { id: 'weights', name: 'Weight Room', icon: 'barbell-outline', busy: 78, capacity: 120, hours: '6:00 AM – 11:00 PM' },
  { id: 'cardio', name: 'Cardio Deck', icon: 'bicycle-outline', busy: 55, capacity: 90, hours: '6:00 AM – 11:00 PM' },
  { id: 'pool', name: 'Pool', icon: 'water-outline', busy: 30, capacity: 60, hours: '7:00 AM – 9:00 PM' },
  { id: 'courts', name: 'Courts', icon: 'basketball-outline', busy: 64, capacity: 80, hours: '8:00 AM – 10:30 PM' },
  { id: 'climbing', name: 'Climbing Wall', icon: 'trending-up-outline', busy: 41, capacity: 25, hours: '3:00 PM – 10:00 PM' },
];

function busyLabel(value: number) {
  if (value >= 75) return 'Very busy';
  if (value >= 50) return 'Moderately busy';
  if (value >= 30) return 'A little busy';
  return 'Not busy';
}

// One blue, four shades: the busier it is, the darker the shade. Matches busyLabel's cutoffs.
const TIERS = {
  quiet: { bar: '#c3d3e8', soft: '#e9eff7', deep: '#4a6485' },
  light: { bar: '#97b2d3', soft: '#e0e9f4', deep: '#3d5f8c' },
  moderate: { bar: '#5f86b8', soft: '#d6e2f1', deep: '#2f5384' },
  packed: { bar: '#2c4f80', soft: '#c9d9ed', deep: '#1c3a66' },
} as const;

function tierFor(value: number) {
  if (value >= 75) return TIERS.packed;
  if (value >= 50) return TIERS.moderate;
  if (value >= 30) return TIERS.light;
  return TIERS.quiet;
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Rec Center</Text>
        <Text style={styles.subtitle}>Live crowd meter</Text>

        <View style={styles.nowBox}>
          <Text style={styles.eyebrow}>How busy right now</Text>
          <View style={styles.nowReading}>
            <Text style={styles.nowValue}>{busy}%</Text>
            <Text style={[styles.status, { color: tierFor(busy).deep }]}>{busyLabel(busy)}</Text>
          </View>
          <Text style={styles.hours}>{OPEN_HOURS}</Text>
          <Text style={styles.updated}>Last updated {updated}</Text>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.refreshButton}
            onPress={refresh}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Busy by hour today</Text>
        <View style={styles.chart}>
          {HOURLY.map((bar, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: `${bar.value}%`, backgroundColor: tierFor(bar.value).bar },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{bar.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Areas</Text>
        <View style={styles.areaList}>
          {AREAS.map((area) => (
            <TouchableOpacity
              key={area.id}
              accessibilityRole="button"
              onPress={() => openArea(area)}
              style={styles.areaRow}
            >
              <View style={[styles.areaIcon, { backgroundColor: tierFor(area.busy).soft }]}>
                <Ionicons name={area.icon} size={20} color={tierFor(area.busy).deep} />
              </View>
              <View style={styles.areaText}>
                <Text style={styles.areaName}>{area.name}</Text>
                <Text style={styles.meta}>{busyLabel(area.busy)} · {area.busy}%</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={TERTIARY} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Spacing scale (multiples of 4): 4 · 8 · 12 · 16 · 20 · 24 · 32
// Type scale: display 48 · title 32 · heading 20 · body 16 · meta 15 · caption 13 · micro 11
// Palette: beige page, warm white surfaces, navy ink, denim accent; tan and blue for busyness.
const ACCENT = '#34507a';
const INK = '#1f2a3a';
const SECONDARY = '#4f5a6b';
const TERTIARY = '#677184';
const PAGE = '#f4efe6';
const SURFACE = '#fbf9f5';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', color: INK, letterSpacing: -0.8 },
  subtitle: { fontSize: 16, color: SECONDARY, marginTop: 4 },
  eyebrow: {
    fontSize: 13,
    fontWeight: '600',
    color: TERTIARY,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  meta: { fontSize: 15, color: SECONDARY, fontVariant: ['tabular-nums'] },
  nowBox: { marginTop: 24, padding: 20, backgroundColor: SURFACE, borderRadius: 20 },
  nowReading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 8, marginTop: 4 },
  nowValue: {
    fontSize: 48,
    fontWeight: '700',
    color: INK,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  status: { fontSize: 16, fontWeight: '600', color: INK },
  hours: { marginTop: 12, fontSize: 15, color: SECONDARY },
  updated: { marginTop: 4, fontSize: 13, color: TERTIARY, fontVariant: ['tabular-nums'] },
  refreshButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: ACCENT,
    marginTop: 20,
  },
  refreshText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: INK, letterSpacing: -0.2, marginTop: 32, marginBottom: 12 },
  chart: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: SURFACE,
    borderRadius: 20,
  },
  barColumn: { flex: 1, alignItems: 'center' },
  barTrack: { height: 96, width: '70%', maxWidth: 12, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6, },
  barLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: TERTIARY,
    marginTop: 8,
    minHeight: 16,
    width: 32,
    textAlign: 'center',
  },
  areaList: { gap: 8 },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 16,
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: SURFACE,
  },
  areaIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaText: { flex: 1, gap: 4 },
  areaName: { fontSize: 16, fontWeight: '600', color: INK },
});
