import { Alert, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Detail = {
  label: string;
  value: string;
};

const AIRLINE = 'Skyway Air';

const PASS = {
  passenger: 'Jordan Lee',
  flight: 'SW 1184',
  fromCode: 'SFO',
  fromCity: 'San Francisco',
  toCode: 'LAX',
  toCity: 'Los Angeles',
  date: 'Wed, Dec 16',
  departs: '6:45 PM',
  boarding: '6:05 PM',
  gate: 'B12',
  terminal: '2',
  seat: '23C',
  group: '4',
  zone: '3',
  confirmation: 'K7QX2P',
};

const KEY_DETAILS: Detail[] = [
  { label: 'Gate', value: PASS.gate },
  { label: 'Seat', value: PASS.seat },
  { label: 'Boarding', value: PASS.boarding },
];

const MORE_DETAILS: Detail[] = [
  { label: 'Terminal', value: PASS.terminal },
  { label: 'Group', value: PASS.group },
  { label: 'Zone', value: PASS.zone },
  { label: 'Departs', value: PASS.departs },
];

const QR_SIZE = 9;
const QR_CELLS: boolean[] = Array.from({ length: QR_SIZE * QR_SIZE }, (_, i) => {
  const r = Math.floor(i / QR_SIZE);
  const c = i % QR_SIZE;
  return (r * 7 + c * 3 + r * c) % 5 < 2 || (r < 2 && c < 2) || (r < 2 && c > 6) || (r > 6 && c < 2);
});

export default function BoardingPassScreen() {
  const addToWallet = () => {
    Alert.alert('Added to Wallet', `Boarding pass for ${PASS.flight} was added to your wallet.`);
  };

  const showStatus = () => {
    Alert.alert(`${PASS.flight} is on time`, `Departs ${PASS.departs} from gate ${PASS.gate}, Terminal ${PASS.terminal}.`);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.passCard}>
        <View style={styles.airlineRow}>
          <Ionicons name="airplane" size={18} color="#ff6f00" />
          <Text style={styles.airline}>{AIRLINE}</Text>
        </View>
        <Text style={styles.passTitle}>BOARDING PASS</Text>
        <Text style={styles.flight}>{PASS.flight}</Text>
        <Text style={styles.date}>{PASS.date}</Text>

        <View style={styles.routeCard}>
          <View style={styles.cityBlock}>
            <Text style={styles.code}>{PASS.fromCode}</Text>
            <Text style={styles.city}>{PASS.fromCity}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#8e24aa" style={{ marginHorizontal: 7 }} />
          <View style={styles.cityBlock}>
            <Text style={styles.code}>{PASS.toCode}</Text>
            <Text style={styles.city}>{PASS.toCity}</Text>
          </View>
        </View>

        <View style={styles.passengerCard}>
          <Text style={styles.label}>Passenger</Text>
          <Text style={styles.value}>{PASS.passenger}</Text>
          <Text style={[styles.label, { marginTop: 5 }]}>Confirmation</Text>
          <Text style={styles.value}>{PASS.confirmation}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            {KEY_DETAILS.map((d) => (
              <View key={d.label} style={styles.detailBox}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.value}>{d.value}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.detailRow, { marginTop: 8 }]}>
            {MORE_DETAILS.map((d) => (
              <View key={d.label} style={styles.detailBox}>
                <Text style={styles.label}>{d.label}</Text>
                <Text style={styles.value}>{d.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.qrCard}>
          <View style={styles.qr}>
            {QR_CELLS.map((on, i) => (
              <View key={i} style={[styles.qrCell, on && styles.qrCellOn]} />
            ))}
          </View>
          <Text style={styles.qrHint}>Scan at the gate</Text>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={addToWallet}>
        <View style={styles.walletButton}>
          <Ionicons name="wallet-outline" size={18} color="#ffffff" />
          <Text style={styles.walletText}>Add to Wallet</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={showStatus}>
        <View style={styles.statusButton}>
          <Text style={styles.statusText}>Flight status</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 4,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#eaf0f7',
  },
  content: {
    paddingHorizontal: 6,
    paddingTop: 13,
    paddingBottom: 22,
    alignItems: 'center',
  },
  passCard: {
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d0dae6',
    paddingVertical: 17,
    paddingHorizontal: 5,
    alignItems: 'center',
    ...shadow,
  },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  airline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ff6f00',
  },
  passTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#c2185b',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 8,
  },
  flight: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1a237e',
    textAlign: 'center',
  },
  date: {
    fontSize: 15,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 7,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1bee7',
    backgroundColor: '#faf5fc',
    ...shadow,
  },
  cityBlock: {
    flex: 1,
    alignItems: 'center',
  },
  code: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00897b',
    textAlign: 'center',
  },
  city: {
    fontSize: 13,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  passengerCard: {
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 5,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
    ...shadow,
  },
  detailsCard: {
    alignSelf: 'stretch',
    marginTop: 20,
    padding: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe082',
    backgroundColor: '#fffdf3',
    ...shadow,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 5,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: '#ffffff',
    ...shadow,
  },
  label: {
    fontSize: 14,
    color: '#b5b5b5',
    textAlign: 'center',
  },
  value: {
    fontSize: 14,
    color: '#a8a8a8',
    textAlign: 'center',
  },
  qrCard: {
    alignItems: 'center',
    marginTop: 13,
    padding: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    backgroundColor: '#ffffff',
    ...shadow,
  },
  qr: {
    width: 180,
    height: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#e0e0e0',
  },
  qrCell: {
    width: 20,
    height: 20,
  },
  qrCellOn: {
    backgroundColor: '#757575',
  },
  qrHint: {
    fontSize: 13,
    color: '#b0b0b0',
    marginTop: 8,
    textAlign: 'center',
  },
  walletButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    ...shadow,
  },
  walletText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#43a047',
    backgroundColor: '#f1f8e9',
    ...shadow,
  },
  statusText: {
    color: '#43a047',
    fontSize: 16,
    fontWeight: '600',
  },
});
