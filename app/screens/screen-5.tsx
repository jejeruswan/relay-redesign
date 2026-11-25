import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

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
const FIRST_HOUR = 6; // chart starts at 6 AM
const NOW_INDEX = 11; // 5 PM bar

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
  { id: 'weights', name: 'Weight Room', icon: 'barbell', busy: 78, capacity: 120, hours: '6:00 AM – 11:00 PM' },
  { id: 'cardio', name: 'Cardio Deck', icon: 'bicycle', busy: 55, capacity: 90, hours: '6:00 AM – 11:00 PM' },
  { id: 'pool', name: 'Pool', icon: 'water', busy: 30, capacity: 60, hours: '7:00 AM – 9:00 PM' },
  { id: 'courts', name: 'Courts', icon: 'basketball', busy: 64, capacity: 80, hours: '8:00 AM – 10:30 PM' },
  { id: 'climbing', name: 'Climbing Wall', icon: 'trending-up', busy: 41, capacity: 25, hours: '3:00 PM – 10:00 PM' },
];

const COLORS = {
  bg: '#f4f6f5',
  card: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  track: '#e5e7eb',
  primary: '#0b6e4f',
  low: '#16a34a',
  mid: '#d97706',
  high: '#dc2626',
};

function busyLabel(value: number) {
  if (value >= 75) return 'Very busy';
  if (value >= 50) return 'Moderately busy';
  if (value >= 30) return 'A little busy';
  return 'Not busy';
}

// One color scale used everywhere: green = quiet, amber = moderate, red = packed.
function busyColor(value: number) {
  if (value >= 75) return COLORS.high;
  if (value >= 50) return COLORS.mid;
  return COLORS.low;
}

function hourLabel(index: number) {
  const h = FIRST_HOUR + index;
  return `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}`;
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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(NOW_INDEX);
  const [openId, setOpenId] = useState<string | null>(null);

  const refresh = () => {
    if (refreshing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    setTimeout(() => {
      const change = Math.round(Math.random() * 8) - 4;
      setBusy((prev) => Math.min(100, Math.max(0, prev + change)));
      setUpdated(timeNow());
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1800);
  };

  const toggleArea = (id: string) => {
    Haptics.selectionAsync();
    setOpenId((prev) => (prev === id ? null : id));
  };

  const pickHour = (i: number) => {
    Haptics.selectionAsync();
    setSelectedHour(i);
  };

  const quietest = [...AREAS].sort((a, b) => a.busy - b.busy)[0];
  const nowColor = busyColor(busy);
  const picked = HOURLY[selectedHour];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Rec Center</Text>

      {/* Hero: the one number people come here for */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>RIGHT NOW</Text>
        <View style={styles.heroRow}>
          <Text style={[styles.heroValue, { color: nowColor }]}>{busy}%</Text>
          <View style={[styles.pill, { backgroundColor: nowColor + '1f' }]}>
            <View style={[styles.pillDot, { backgroundColor: nowColor }]} />
            <Text style={[styles.pillText, { color: nowColor }]}>{busyLabel(busy)}</Text>
          </View>
        </View>
        <View style={styles.meter}>
          <View style={[styles.meterFill, { width: `${busy}%`, backgroundColor: nowColor }]} />
        </View>
        <Text style={styles.heroMeta}>{OPEN_HOURS}</Text>

        <View style={styles.heroFooter}>
          <Text style={styles.updated}>Updated {updated}</Text>
          <Pressable
            onPress={refresh}
            disabled={refreshing}
            accessibilityRole="button"
            accessibilityLabel="Refresh crowd level"
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.pressed,
              refreshing && styles.refreshing,
            ]}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="refresh" size={18} color="#fff" />
            )}
            <Text style={styles.refreshText}>{refreshing ? 'Updating' : 'Refresh'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Chart: tap a bar to read it */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Busy by hour</Text>
        <Text style={styles.sectionHint}>Tap a bar</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.chartReadout}>
          <Text style={styles.readoutTime}>
            {hourLabel(selectedHour)}
            {selectedHour === NOW_INDEX ? ' · now' : ''}
          </Text>
          <Text style={[styles.readoutValue, { color: busyColor(picked.value) }]}>
            {picked.value}% · {busyLabel(picked.value)}
          </Text>
        </View>
        <View style={styles.chart}>
          {HOURLY.map((bar, i) => {
            const selected = i === selectedHour;
            return (
              <Pressable
                key={i}
                onPress={() => pickHour(i)}
                accessibilityRole="button"
                accessibilityLabel={`${hourLabel(i)}, ${bar.value} percent busy`}
                style={styles.barColumn}
              >
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${bar.value}%`,
                        backgroundColor: busyColor(bar.value),
                        opacity: selected ? 1 : 0.35,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, selected && styles.barLabelActive]}>{bar.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Areas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Areas</Text>
        <Text style={styles.sectionHint}>Quietest: {quietest.name}</Text>
      </View>
      <View style={styles.areaList}>
        {AREAS.map((area) => {
          const open = openId === area.id;
          const color = busyColor(area.busy);
          const people = Math.round((area.busy / 100) * area.capacity);
          return (
            <Pressable
              key={area.id}
              onPress={() => toggleArea(area.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              style={({ pressed }) => [styles.areaCard, pressed && styles.pressed]}
            >
              <View style={styles.areaRow}>
                <View style={styles.areaIcon}>
                  <Ionicons name={area.icon} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.areaText}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={[styles.areaBusy, { color }]}>
                    {busyLabel(area.busy)} · {area.busy}%
                  </Text>
                </View>
                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.muted}
                />
              </View>
              <View style={styles.areaMeter}>
                <View style={[styles.meterFill, { width: `${area.busy}%`, backgroundColor: color }]} />
              </View>
              {open && (
                <View style={styles.areaDetail}>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={16} color={COLORS.muted} />
                    <Text style={styles.detailText}>
                      About {people} of {area.capacity} people
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={COLORS.muted} />
                    <Text style={styles.detailText}>Hours today: {area.hours}</Text>
                  </View>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  hero: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.muted,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  heroValue: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    minHeight: 32,
    borderRadius: 16,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  meter: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.track,
    overflow: 'hidden',
    marginTop: 8,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  heroMeta: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 12,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  updated: {
    fontSize: 12,
    color: COLORS.muted,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    minWidth: 120,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
  },
  refreshing: {
    opacity: 0.8,
  },
  refreshText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.muted,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  chartReadout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  readoutTime: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  readoutValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    minHeight: 44,
  },
  barTrack: {
    height: 120,
    width: 10,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
    height: 14,
  },
  barLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },

  areaList: {
    gap: 8,
  },
  areaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  areaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaText: {
    flex: 1,
    marginLeft: 12,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  areaBusy: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  areaMeter: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.track,
    overflow: 'hidden',
    marginTop: 12,
  },
  areaDetail: {
    marginTop: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.muted,
  },
});
