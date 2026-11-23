import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

type ChargeLine = {
  label: string;
  amount: number;
};

type PaymentMethod = {
  id: string;
  kind: 'card' | 'bank';
  label: string;
};

type HistoryEntry = {
  id: string;
  month: string;
  paidOn: string;
  amount: number;
};

const PROPERTY = {
  address: '2600 Hearst Ave',
  unit: 'Apt 4C',
  dueDate: 'Dec 1, 2026',
};

const CHARGES: ChargeLine[] = [
  { label: 'Rent', amount: 1750 },
  { label: 'Utilities', amount: 62.5 },
  { label: 'Trash', amount: 12.5 },
  { label: 'Renters insurance', amount: 20 },
];

const METHODS: PaymentMethod[] = [
  { id: 'visa', kind: 'card', label: 'Credit card •••• 4242' },
  { id: 'bank', kind: 'bank', label: 'Checking •••• 9031' },
];

const HISTORY: HistoryEntry[] = [
  { id: 'h-nov', month: 'November 2026', paidOn: 'Oct 29, 2026', amount: 1845 },
  { id: 'h-oct', month: 'October 2026', paidOn: 'Sep 30, 2026', amount: 1838.2 },
  { id: 'h-sep', month: 'September 2026', paidOn: 'Aug 28, 2026', amount: 1851.75 },
  { id: 'h-aug', month: 'August 2026', paidOn: 'Jul 31, 2026', amount: 1842.1 },
];

function formatMoney(value: number) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ResidentPortalScreen() {
  const [methodId, setMethodId] = useState('visa');
  const [amountDue, setAmountDue] = useState(CHARGES.reduce((sum, c) => sum + c.amount, 0));
  const [history, setHistory] = useState<HistoryEntry[]>(HISTORY);

  const method = METHODS.find((m) => m.id === methodId) ?? METHODS[0];

  const pay = () => {
    if (amountDue <= 0) {
      Alert.alert('Nothing due', 'Your balance is already paid.');
      return;
    }
    const total = amountDue;
    setTimeout(() => {
      setAmountDue(0);
      setHistory((list) => [
        { id: `h-dec-${Date.now()}`, month: 'December 2026', paidOn: 'Nov 23, 2026', amount: total },
        ...list,
      ]);
      Alert.alert('Payment sent', `${formatMoney(total)} paid with ${method.label}.`);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 14, paddingBottom: 36 }}>
      <Text style={styles.portalName}>Resident Portal</Text>
      <Text style={styles.address}>{PROPERTY.address}</Text>
      <Text style={styles.unit}>{PROPERTY.unit}</Text>

      <View style={styles.card}>
        <View style={styles.innerCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>DUE IN 8 DAYS</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>Amount due</Text>
            <Text style={styles.lineValue}>{formatMoney(amountDue)}</Text>
          </View>
          <Text style={styles.dueDate}>Due {PROPERTY.dueDate}</Text>
        </View>

        <View style={[styles.innerCard, { marginTop: 10 }]}>
          {CHARGES.map((c) => (
            <View key={c.label} style={styles.lineRow}>
              <Text style={styles.lineLabel}>{c.label}</Text>
              <Text style={styles.lineValue}>{formatMoney(c.amount)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment method</Text>
        {METHODS.map((m) => {
          const selected = m.id === methodId;
          return (
            <TouchableWithoutFeedback key={m.id} onPress={() => setMethodId(m.id)}>
              <View style={[styles.methodRow, selected && styles.methodRowSelected]}>
                {m.kind === 'card' ? (
                  <FontAwesome name="cc-visa" size={22} color="#1A1F71" />
                ) : (
                  <MaterialCommunityIcons name="bank" size={22} color="#444" />
                )}
                <Text style={styles.methodLabel}>{m.label}</Text>
                {m.kind === 'card' && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
                {selected && <MaterialCommunityIcons name="check-circle" size={20} color="#34C759" />}
              </View>
            </TouchableWithoutFeedback>
          );
        })}
        <Text style={styles.autopay}>Autopay is off</Text>
      </View>

      <TouchableWithoutFeedback onPress={pay}>
        <View style={styles.payButton}>
          <Text style={styles.payText}>Pay now</Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontSize: 18 }]}>Payment history</Text>
        {history.map((h) => (
          <View key={h.id} style={styles.historyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyMonth}>{h.month}</Text>
              <Text style={styles.historyDate}>Paid {h.paidOn}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.historyAmount}>{formatMoney(h.amount)}</Text>
              <Text style={styles.paidLabel}>PAID</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4EF',
  },
  portalName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E44AD',
  },
  address: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1C1C1C',
    marginTop: 4,
  },
  unit: {
    fontSize: 20,
    fontWeight: '300',
    color: '#555',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    ...shadow,
  },
  innerCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 8,
    padding: 10,
    ...shadow,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9500',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    marginBottom: 4,
  },
  lineLabel: {
    fontSize: 14,
    color: '#333',
  },
  lineValue: {
    fontSize: 14,
    color: '#333',
  },
  dueDate: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    ...shadow,
  },
  methodRowSelected: {
    borderColor: '#34C759',
  },
  methodLabel: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginLeft: 10,
  },
  defaultBadge: {
    backgroundColor: '#AF52DE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  autopay: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  payButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    ...shadow,
  },
  payText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: '#fff',
    ...shadow,
  },
  historyMonth: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  historyDate: {
    fontSize: 12,
    color: '#aaa',
  },
  historyAmount: {
    fontSize: 15,
    color: '#222',
  },
  paidLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34C759',
  },
});
