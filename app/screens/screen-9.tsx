import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Platform = 1 | 2;

type Departure = {
  id: string;
  destination: string;
  minutes: number;
  cars: number;
  platform: Platform;
  delay: number;
};

type PlatformFilter = 'all' | Platform;

const STATION = 'Downtown Berkeley';

const DESTINATION_COLORS: Record<string, string> = {
  Richmond: '#FF1744',
  Millbrae: '#00C853',
  'Berryessa/North San José': '#FF9100',
  SFO: '#D500F9',
};

const INITIAL_DEPARTURES: Departure[] = [
  { id: 'd1', destination: 'Richmond', minutes: 3, cars: 6, platform: 2, delay: 0 },
  { id: 'd2', destination: 'Berryessa/North San José', minutes: 8, cars: 10, platform: 1, delay: 0 },
  { id: 'd3', destination: 'Millbrae', minutes: 12, cars: 8, platform: 1, delay: 4 },
  { id: 'd4', destination: 'SFO', minutes: 15, cars: 9, platform: 1, delay: 0 },
  { id: 'd5', destination: 'Richmond', minutes: 22, cars: 8, platform: 2, delay: 0 },
  { id: 'd6', destination: 'Berryessa/North San José', minutes: 26, cars: 10, platform: 1, delay: 2 },
  { id: 'd7', destination: 'Millbrae', minutes: 31, cars: 6, platform: 1, delay: 0 },
  { id: 'd8', destination: 'Richmond', minutes: 37, cars: 9, platform: 2, delay: 0 },
];

const FILTERS: { id: PlatformFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 1, label: 'Platform 1' },
  { id: 2, label: 'Platform 2' },
];

function formatTime(totalMinutes: number) {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${suffix}`;
}

export default function TransitTimesScreen() {
  const [departures, setDepartures] = useState<Departure[]>(INITIAL_DEPARTURES);
  const [updatedAt, setUpdatedAt] = useState(21 * 60 + 41);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');

  const refresh = () => {
    setTimeout(() => {
      setDepartures((current) =>
        current.map((d) => ({ ...d, minutes: d.minutes - 1 })).filter((d) => d.minutes >= 0),
      );
      setUpdatedAt((current) => current + 1);
    }, 1700);
  };

  const visible = departures.filter((d) => platformFilter === 'all' || d.platform === platformFilter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>Transit Times</Text>
      <Text style={styles.station}>{STATION}</Text>

      <View style={styles.updateRow}>
        <Text style={styles.updatedText}>Updated {formatTime(updatedAt)}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = platformFilter === f.id;
          return (
            <TouchableOpacity
              key={String(f.id)}
              style={[styles.filterButton, active && styles.filterButtonActive]}
              onPress={() => setPlatformFilter(f.id)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {visible.map((d) => (
        <View key={d.id} style={styles.row}>
          <Text style={[styles.destination, { color: DESTINATION_COLORS[d.destination] }]}>{d.destination}</Text>
          <Text style={styles.minutes}>{d.minutes === 0 ? 'Leaving now' : `${d.minutes} min`}</Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="train" size={22} color="#555" />
            <Text style={styles.carsText}>{d.cars} cars</Text>
            <Ionicons name="location-outline" size={13} color="#999" style={{ marginLeft: 13, marginTop: 5 }} />
            <Text style={styles.platformText}>Platform {d.platform}</Text>
          </View>
          {d.delay > 0 && <Text style={styles.delay}>Delayed {d.delay} min</Text>}
        </View>
      ))}

      <Text style={{ fontSize: 10, color: '#888', marginTop: 17, marginHorizontal: 3 }}>
        Times are estimates and may change. Car counts are shown when available.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 30,
  },
  appName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00B8D4',
    textTransform: 'uppercase',
  },
  station: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  updatedText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  refreshText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 2,
    gap: 4,
  },
  filterButton: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FFEA00',
    borderColor: '#FFD600',
  },
  filterText: {
    fontSize: 13,
    color: '#444',
  },
  filterTextActive: {
    fontWeight: '700',
    color: '#111',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 9,
    paddingHorizontal: 2,
  },
  destination: {
    fontSize: 24,
    fontWeight: '800',
  },
  minutes: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0040FF',
    marginTop: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  carsText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  platformText: {
    fontSize: 12,
    color: '#b5b5b5',
    marginLeft: 3,
  },
  delay: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF0000',
    marginTop: 3,
  },
});
