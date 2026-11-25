import { type ComponentRef, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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

const BAR_COLORS = [
  ['rgba(40, 151, 196, 0.91)', 'rgba(40, 151, 196, 0.24)'],
  ['rgba(15, 142, 123, 0.91)', 'rgba(15, 142, 123, 0.24)'],
  ['rgba(169, 104, 16, 0.91)', 'rgba(169, 104, 16, 0.24)'],
  ['rgba(198, 84, 51, 0.91)', 'rgba(198, 84, 51, 0.24)'],
  ['rgba(128, 75, 196, 0.91)', 'rgba(128, 75, 196, 0.24)'],
] as const;

const AREAS: Area[] = [
  { id: 'weights', name: 'Weight Room', icon: 'barbell', busy: 78, capacity: 120, hours: '6:00 AM – 11:00 PM' },
  { id: 'cardio', name: 'Cardio Deck', icon: 'bicycle', busy: 55, capacity: 90, hours: '6:00 AM – 11:00 PM' },
  { id: 'pool', name: 'Pool', icon: 'water', busy: 30, capacity: 60, hours: '7:00 AM – 9:00 PM' },
  { id: 'courts', name: 'Courts', icon: 'basketball', busy: 64, capacity: 80, hours: '8:00 AM – 10:30 PM' },
  { id: 'climbing', name: 'Climbing Wall', icon: 'trending-up', busy: 41, capacity: 25, hours: '3:00 PM – 10:00 PM' },
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
  const backdrop = useRef<ComponentRef<typeof View>>(null);
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

  const glass = (
    <BlurView
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      blurTarget={backdrop}
      blurMethod="dimezisBlurViewSdk31Plus"
      tint="systemUltraThinMaterialLight"
      intensity={32}
    />
  );

  return (
    <View style={styles.container}>
      <BlurTargetView ref={backdrop} pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.blueGlow} />
        <View style={styles.violetGlow} />
      </BlurTargetView>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Rec Center</Text>
        <Text style={styles.secondary}>Live crowd meter</Text>

        <View style={[styles.glass, styles.nowBox]}>
          {glass}
          <Text style={styles.secondary}>How busy right now</Text>
          <View style={styles.nowReading}>
            <Text style={styles.nowValue}>{busy}%</Text>
            <Text style={styles.status}>{busyLabel(busy)}</Text>
          </View>
          <Text style={styles.hours}>{OPEN_HOURS}</Text>
          <Text style={styles.updated}>Last updated {updated}</Text>

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.refreshButton}
            onPress={refresh}
          >
            <Ionicons name="refresh" size={18} color="#154a70" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Busy by hour today</Text>
        <View style={[styles.glass, styles.chart]}>
          {glass}
          {HOURLY.map((bar, i) => (
            <View key={i} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={BAR_COLORS[Math.min(Math.floor(bar.value / 20), BAR_COLORS.length - 1)]}
                  style={[styles.bar, { height: `${bar.value}%` }]}
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
              style={[styles.glass, styles.areaRow]}
            >
              {glass}
              <View style={styles.areaIcon}>
                <Ionicons name={area.icon} size={22} color="#246286" />
              </View>
              <View style={styles.areaText}>
                <Text style={styles.areaName}>{area.name}</Text>
                <Text style={styles.secondary}>{busyLabel(area.busy)} · {area.busy}%</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#56708a" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  blueGlow: {
    position: 'absolute',
    top: '13%',
    right: -125,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(90, 178, 255, 0.08)',
  },
  violetGlow: {
    position: 'absolute',
    bottom: '-6%',
    left: -160,
    width: 390,
    height: 390,
    borderRadius: 195,
    backgroundColor: 'rgba(148, 110, 255, 0.07)',
  },
  title: { fontSize: 36, fontWeight: '800', color: '#17243b', letterSpacing: -1.2 },
  secondary: { fontSize: 14, color: '#465670' },
  glass: {
    backgroundColor: 'rgba(223, 238, 253, 0.28)',
    borderColor: 'rgba(105, 143, 185, 0.24)',
    borderTopColor: 'rgba(143, 182, 222, 0.40)',
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  nowBox: { marginTop: 20, padding: 20 },
  nowReading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: 8 },
  nowValue: { fontSize: 40, fontWeight: '800', color: '#17243b', letterSpacing: -1.6 },
  status: { fontSize: 16, fontWeight: '700', color: '#244466' },
  hours: { marginTop: 12, fontSize: 14, color: '#263852' },
  updated: { marginTop: 4, fontSize: 12, color: '#53657e' },
  refreshButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74, 151, 201, 0.34)',
    backgroundColor: 'rgba(116, 200, 244, 0.25)',
    marginTop: 18,
  },
  refreshText: { color: '#154a70', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#17243b', marginTop: 24, marginBottom: 10 },
  chart: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  barColumn: { flex: 1, alignItems: 'center' },
  barTrack: { height: 96, width: '70%', maxWidth: 12, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 9, color: '#465670', marginTop: 6, minHeight: 12, width: 24, textAlign: 'center' },
  areaList: { gap: 8 },
  areaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20 },
  areaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(150, 208, 244, 0.23)',
  },
  areaText: { flex: 1, gap: 2 },
  areaName: { fontSize: 16, fontWeight: '700', color: '#17243b' },
});
