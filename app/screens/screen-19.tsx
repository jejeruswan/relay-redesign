import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Charge = {
  id: string;
  label: string;
  amount: number;
  note?: string;
  hasInfo?: boolean;
};

type AidItem = {
  id: string;
  name: string;
  amount: number;
};

const TERM = 'Spring 2027';
const DUE_DATE = 'Dec 15, 2026';

const CHARGES: Charge[] = [
  { id: 'c1', label: 'Tuition', amount: 7224.0, hasInfo: true },
  { id: 'c2', label: 'Campus Fees', amount: 1068.5, hasInfo: true },
  { id: 'c3', label: 'Student Health Insurance', amount: 1615.0, hasInfo: true },
  { id: 'c4', label: 'Class Pass', amount: 91.0 },
  { id: 'c5', label: 'Document Fee', amount: 20.0, note: 'one-time' },
];

const AID: AidItem[] = [
  { id: 'a1', name: 'Cal Grant', amount: 2900.0 },
  { id: 'a2', name: 'Pell Grant', amount: 2100.0 },
  { id: 'a3', name: 'Berkeley Undergraduate Scholarship', amount: 1200.0 },
];

const PAYMENTS_RECEIVED = 406.0;

function money(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function StudentBillingScreen() {
  const [showAid, setShowAid] = useState(false);
  const [paid, setPaid] = useState(false);

  const totalCharges = CHARGES.reduce((sum, c) => sum + c.amount, 0);
  const totalAid = AID.reduce((sum, a) => sum + a.amount, 0);
  const amountDue = paid ? 0 : totalCharges - totalAid - PAYMENTS_RECEIVED;

  const handlePay = () => {
    Alert.alert('Make a payment', `Pay ${money(amountDue)} from your checking account ending in 0427?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay',
        onPress: () => {
          setPaid(true);
          Alert.alert('Payment submitted', 'It may take 1–2 business days to post.');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.portal}>Student Portal · Billing</Text>
      <Text style={styles.term}>{TERM}</Text>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Amount due</Text>
          <Text style={[styles.summaryValue, { color: '#d32f2f' }]}>{money(amountDue)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Aid disbursed</Text>
          <Text style={[styles.summaryValue, { color: '#2e7d32' }]}>{money(totalAid)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total charges</Text>
          <Text style={[styles.summaryValue, { color: '#1565c0' }]}>{money(totalCharges)}</Text>
        </View>
      </View>

      <View style={styles.dueRow}>
        <Text style={styles.dueText}>{paid ? 'Paid. Thank you!' : `Due ${DUE_DATE}`}</Text>
        {!paid && (
          <TouchableOpacity onPress={handlePay} style={styles.payLink}>
            <Text style={styles.payLinkText}>Pay now</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Itemized charges</Text>
      <View style={styles.list}>
        {CHARGES.map((c) => (
          <View key={c.id} style={styles.chargeRow}>
            {c.hasInfo ? (
              <View style={styles.infoIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={c.id === 'c2' ? 14 : 19}
                  color="#ff9800"
                  style={c.id === 'c3' ? { marginTop: 6 } : undefined}
                />
              </View>
            ) : null}
            <Text style={styles.chargeLabel}>
              {c.label}
              {c.note ? <Text style={styles.chargeNote}> ({c.note})</Text> : null}
            </Text>
            <Text style={styles.chargeAmount}>{money(c.amount)}</Text>
          </View>
        ))}
        {AID.map((a) => (
          <View key={a.id} style={styles.chargeRow}>
            <Text style={[styles.chargeLabel, { color: '#2e7d32' }]}>{a.name}</Text>
            <Text style={[styles.chargeAmount, { color: '#2e7d32', marginLeft: 22 }]}>-{money(a.amount)}</Text>
          </View>
        ))}
        <View style={styles.chargeRow}>
          <Text style={styles.chargeLabel}>Payment received</Text>
          <Text style={[styles.chargeAmount, { color: '#7b1fa2', marginLeft: 5 }]}>-{money(PAYMENTS_RECEIVED)}</Text>
        </View>
        <View style={[styles.chargeRow, { borderBottomWidth: 0, marginTop: 4 }]}>
          <Text style={styles.totalLabel}>Balance</Text>
          <Text style={styles.totalAmount}>{money(amountDue)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.aidLink} onPress={() => setShowAid((v) => !v)}>
        <Text style={styles.aidLinkText}>{showAid ? 'Hide aid details' : 'View aid details'}</Text>
      </TouchableOpacity>

      {showAid && (
        <View style={styles.aidBox}>
          {AID.map((a) => (
            <Text key={a.id} style={styles.aidText}>
              {a.name}: {money(a.amount)} disbursed Nov 2
            </Text>
          ))}
          <Text style={styles.aidFoot}>Questions? Contact the Financial Aid office in Sproul Hall.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fafaf7',
  },
  content: {
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 20,
  },
  portal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0d47a1',
  },
  term: {
    fontSize: 13,
    fontWeight: '300',
    color: '#ef6c00',
    marginBottom: 7,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#555555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 4,
  },
  dueText: {
    fontSize: 14,
    color: '#c62828',
  },
  payLink: {
    height: 20,
    justifyContent: 'center',
  },
  payLinkText: {
    fontSize: 13,
    color: '#1e88e5',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ad1457',
    marginTop: 13,
    marginBottom: 3,
  },
  list: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  chargeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  infoIcon: {
    marginRight: 4,
  },
  chargeLabel: {
    fontSize: 14,
    color: '#333333',
  },
  chargeNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#999999',
  },
  chargeAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
    marginLeft: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#d32f2f',
    marginLeft: 17,
  },
  aidLink: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  aidLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00897b',
  },
  aidBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    padding: 5,
  },
  aidText: {
    fontSize: 13,
    color: '#1b5e20',
    marginBottom: 3,
  },
  aidFoot: {
    fontSize: 12,
    color: '#558b2f',
    marginTop: 5,
  },
});
