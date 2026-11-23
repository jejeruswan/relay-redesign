import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Trip = {
  id: string;
  mode: 'bus' | 'train';
  title: string;
  detail: string;
  time: string;
  fare: number;
};

type Reload = {
  id: string;
  date: string;
  amount: number;
};

type TabKey = 'trips' | 'reloads';

const CARD = {
  last4: '3391',
  startingBalance: 12.75,
  autoload: false,
};

const AMOUNTS: number[] = [10, 20, 40];

const TRIPS: Trip[] = [
  { id: 't1', mode: 'bus', title: 'Bus 51B', detail: 'Telegraph & Bancroft', time: 'Today, 8:42 AM', fare: 2.5 },
  { id: 't2', mode: 'train', title: 'Train · Downtown Berkeley → Embarcadero', detail: 'Exit 9:31 AM', time: 'Nov 22, 9:04 AM', fare: 4.4 },
  { id: 't3', mode: 'bus', title: 'Bus 79', detail: 'College & Durant', time: 'Nov 21, 5:17 PM', fare: 2.5 },
  { id: 't4', mode: 'bus', title: 'Bus F Transbay', detail: 'University & Shattuck', time: 'Nov 19, 7:55 PM', fare: 6.0 },
];

const RELOADS: Reload[] = [];

export default function TransitCardScreen() {
  const [balance, setBalance] = useState(CARD.startingBalance);
  const [amount, setAmount] = useState(20);
  const [tab, setTab] = useState<TabKey>('trips');

  const handleReload = () => {
    const value = amount;
    setTimeout(() => {
      setBalance((b) => b + value);
    }, 1700);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.outerCard}>
        <Text style={styles.cardLabel}>Transit Card •••• {CARD.last4}</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>${balance.toFixed(2)}</Text>
          <View style={styles.autoloadPill}>
            <Text style={styles.autoloadText}>Autoload {CARD.autoload ? 'on' : 'off'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.outerCard}>
        <Text style={styles.sectionTitle}>Reload card</Text>
        <View style={styles.chipRow}>
          {AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.chip, amount === a && styles.chipActive]}
              onPress={() => setAmount(a)}
            >
              <Text style={[styles.chipText, amount === a && styles.chipTextActive]}>${a}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Text style={styles.reloadButtonText}>Reload ${amount}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'trips' && styles.tabActive]}
          onPress={() => setTab('trips')}
        >
          <Text style={[styles.tabText, tab === 'trips' && { color: '#ffffff' }]}>Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'reloads' && styles.tabActive]}
          onPress={() => setTab('reloads')}
        >
          <Text style={[styles.tabText, tab === 'reloads' && { color: '#ffffff' }]}>Reloads</Text>
        </TouchableOpacity>
      </View>

      {tab === 'trips' && (
        <View style={styles.outerCard}>
          {TRIPS.map((trip) => (
            <View key={trip.id} style={styles.tripRow}>
              <View style={[styles.modeBadge, { backgroundColor: trip.mode === 'bus' ? '#2ecc71' : '#9b59b6' }]}>
                <Ionicons name={trip.mode === 'bus' ? 'bus' : 'train'} size={18} color="#ffffff" />
              </View>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDetail}>{trip.detail}</Text>
              <Text style={styles.tripDetail}>{trip.time}</Text>
              <Text style={styles.tripFare}>-${trip.fare.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
      {tab === 'reloads' &&
        RELOADS.map((r) => (
          <View key={r.id} style={styles.tripRow}>
            <Text style={styles.tripTitle}>{r.date}</Text>
            <Text style={styles.tripFare}>+${r.amount.toFixed(2)}</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eef3f1',
  },
  content: {
    paddingHorizontal: 5,
    paddingTop: 7,
    paddingBottom: 20,
  },
  outerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d6dedb',
    padding: 8,
    marginBottom: 5,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: '#b5b5b5',
    textAlign: 'center',
    marginBottom: 7,
  },
  balanceCard: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#fff8e6',
    borderWidth: 1,
    borderColor: '#f5c542',
    borderRadius: 10,
    padding: 13,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#e67e22',
    textAlign: 'center',
  },
  balance: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1b3a34',
    textAlign: 'center',
    marginVertical: 4,
  },
  autoloadPill: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  autoloadText: {
    fontSize: 12,
    color: '#e74c3c',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b3a34',
    textAlign: 'center',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 13,
  },
  chip: {
    minWidth: 72,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#c3cfcb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#1abc9c',
    borderColor: '#1abc9c',
  },
  chipText: {
    fontSize: 16,
    color: '#1b3a34',
  },
  chipTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  reloadButton: {
    alignSelf: 'stretch',
    backgroundColor: '#007AFF',
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reloadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 17,
    marginBottom: 8,
    gap: 5,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3cfcb',
    backgroundColor: '#ffffff',
  },
  tabActive: {
    backgroundColor: '#1b3a34',
    borderColor: '#1b3a34',
  },
  tabText: {
    fontSize: 15,
    color: '#1b3a34',
    fontWeight: '500',
  },
  tripRow: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8e6',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 4,
    marginBottom: 6,
    backgroundColor: '#fbfdfc',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  modeBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  tripTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b3a34',
    textAlign: 'center',
  },
  tripDetail: {
    fontSize: 13,
    color: '#b5b5b5',
    textAlign: 'center',
    marginTop: 2,
  },
  tripFare: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 4,
  },
});
