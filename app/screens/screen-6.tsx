import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MachineKind = 'washer' | 'dryer';

type Machine = {
  id: string;
  kind: MachineKind;
  status: 'free' | 'in_use';
  minutesLeft: number;
};

type Filter = 'all' | 'free';

const BUILDING = {
  address: '2510 Channing Way',
  room: 'Basement Laundry',
};

const STARTING_BALANCE = 8.5;

const PRICES: Record<MachineKind, number> = { washer: 2.75, dryer: 2.0 };

const CYCLE_MINUTES: Record<MachineKind, number> = { washer: 34, dryer: 60 };

const INITIAL_MACHINES: Machine[] = [
  { id: 'W1', kind: 'washer', status: 'free', minutesLeft: 0 },
  { id: 'W2', kind: 'washer', status: 'in_use', minutesLeft: 23 },
  { id: 'W3', kind: 'washer', status: 'free', minutesLeft: 0 },
  { id: 'W4', kind: 'washer', status: 'in_use', minutesLeft: 41 },
  { id: 'W5', kind: 'washer', status: 'in_use', minutesLeft: 7 },
  { id: 'W6', kind: 'washer', status: 'free', minutesLeft: 0 },
  { id: 'D1', kind: 'dryer', status: 'in_use', minutesLeft: 52 },
  { id: 'D2', kind: 'dryer', status: 'in_use', minutesLeft: 18 },
  { id: 'D3', kind: 'dryer', status: 'in_use', minutesLeft: 35 },
  { id: 'D4', kind: 'dryer', status: 'in_use', minutesLeft: 4 },
  { id: 'D5', kind: 'dryer', status: 'in_use', minutesLeft: 60 },
  { id: 'D6', kind: 'dryer', status: 'in_use', minutesLeft: 27 },
];

export default function LaundryRoomScreen() {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [filter, setFilter] = useState<Filter>('all');

  const startMachine = (machine: Machine) => {
    const price = PRICES[machine.kind];
    if (balance < price) {
      Alert.alert('Not enough balance', `You need $${price.toFixed(2)} to start ${machine.id}.`);
      return;
    }
    setTimeout(() => {
      setBalance((current) => current - price);
      setMachines((current) =>
        current.map((m) =>
          m.id === machine.id ? { ...m, status: 'in_use', minutesLeft: CYCLE_MINUTES[m.kind] } : m,
        ),
      );
      Alert.alert('Started', `${machine.id} is running. $${price.toFixed(2)} was charged to your card.`);
    }, 1800);
  };

  const remindMe = (machine: Machine) => {
    Alert.alert('Reminder set', `We'll let you know when ${machine.id} is done.`);
  };

  const addFunds = () => {
    Alert.alert('Add funds', 'Add $10.00 to your laundry card?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: () => setBalance((current) => current + 10) },
    ]);
  };

  const renderSection = (title: string, kind: MachineKind, titleColor: string) => {
    const list = machines.filter(
      (m) => m.kind === kind && (filter === 'all' || m.status === 'free'),
    );
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
          <Text style={[styles.sectionPrice, { color: kind === 'washer' ? '#2E9E3F' : '#D6336C' }]}>
            ${PRICES[kind].toFixed(2)} / cycle
          </Text>
        </View>
        <View style={styles.grid}>
          {list.map((machine) => {
            const isFree = machine.status === 'free';
            return (
              <View key={machine.id} style={styles.machineCard}>
                <MaterialCommunityIcons
                  name={kind === 'washer' ? 'washing-machine' : 'tumble-dryer'}
                  size={26}
                  color="#555"
                />
                <Text style={styles.machineId}>{machine.id}</Text>
                <View style={styles.statusBox}>
                  <Text style={styles.statusText}>{isFree ? 'Free' : 'In use'}</Text>
                  <Text style={styles.minutesText}>
                    {isFree ? 'Ready' : `${machine.minutesLeft} min left`}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.machineButton}
                  onPress={() => (isFree ? startMachine(machine) : remindMe(machine))}
                >
                  <Text style={styles.machineButtonText}>{isFree ? 'Start' : 'Remind'}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>Laundry Room</Text>
      <Text style={styles.address}>{BUILDING.address}</Text>
      <Text style={styles.room}>{BUILDING.room}</Text>

      <View style={styles.balanceCard}>
        <View style={styles.balanceInner}>
          <Text style={styles.balanceLabel}>Card balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addFunds}>
          <Text style={styles.addButtonText}>Add funds</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'free'] as Filter[]).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.filterButton, filter === option && styles.filterButtonActive]}
            onPress={() => setFilter(option)}
          >
            <Text style={[styles.filterText, filter === option && { color: '#fff' }]}>
              {option === 'all' ? 'All' : 'Free only'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderSection('Washers', 'washer', '#F57C00')}
      {renderSection('Dryers', 'dryer', '#00897B')}

      <Text style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 12 }}>
        Machines are cleaned every Tuesday morning.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F1EC',
  },
  content: {
    padding: 6,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E91E63',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  address: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222',
    marginTop: 4,
  },
  room: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    marginBottom: 5,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  balanceInner: {
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    padding: 10,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#777',
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#7B1FA2',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 18,
    height: 44,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 9,
    marginBottom: 6,
    backgroundColor: '#E4E1DA',
    borderRadius: 10,
    padding: 3,
  },
  filterButton: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#00ACC1',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    marginTop: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  machineCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  machineId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 7,
  },
  statusBox: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginTop: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#777',
  },
  minutesText: {
    fontSize: 11,
    color: '#b5b5b5',
    marginTop: 1,
  },
  machineButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    height: 26,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginTop: 13,
  },
  machineButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
