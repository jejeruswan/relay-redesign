import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Parcel = {
  id: string;
  carrier: string;
  received: string;
  location: string;
  building: string;
  locker: number;
  code: string;
  expires: string;
};

type TabKey = 'waiting' | 'picked';

const WAITING: Parcel[] = [
  {
    id: 'p1',
    carrier: 'Ground Shipping',
    received: 'Nov 21, 3:12 PM',
    location: 'Unit 2 Package Room',
    building: 'Channing/Ellsworth',
    locker: 14,
    code: '482 913',
    expires: '2 days 4 hrs',
  },
];

const PICKED_UP: Parcel[] = [];

export default function ParcelPickupScreen() {
  const [tab, setTab] = useState<TabKey>('waiting');
  const [openCount, setOpenCount] = useState(0);

  const parcels = tab === 'waiting' ? WAITING : PICKED_UP;

  const openLocker = (parcel: Parcel) => {
    setTimeout(() => {
      setOpenCount((c) => c + 1);
      Alert.alert(`Locker ${parcel.locker} is open`, 'Close the door when you are done.');
    }, 1800);
  };

  const copyCode = (parcel: Parcel) => {
    Alert.alert('Code copied', `Pickup code ${parcel.code} copied to clipboard.`);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>Parcel Pickup</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'waiting' && styles.tabActive]}
          onPress={() => setTab('waiting')}
        >
          <Text style={[styles.tabText, tab === 'waiting' && styles.tabTextActive]}>
            Waiting ({WAITING.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'picked' && styles.tabActive]}
          onPress={() => setTab('picked')}
        >
          <Text style={[styles.tabText, tab === 'picked' && styles.tabTextActive]}>
            Picked up ({PICKED_UP.length})
          </Text>
        </TouchableOpacity>
      </View>

      {parcels.map((parcel) => (
        <View key={parcel.id} style={styles.card}>
          <Ionicons name="cube-outline" size={36} color="#7a5c3e" style={{ marginBottom: 5 }} />
          <Text style={styles.heading}>You have a package</Text>
          <Text style={styles.carrier}>{parcel.carrier}</Text>

          <View style={styles.detailBlock}>
            <Text style={styles.label}>Received</Text>
            <Text style={styles.value}>{parcel.received}</Text>
          </View>
          <View style={[styles.detailBlock, { marginTop: 13 }]}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{parcel.location}</Text>
            <Text style={styles.value}>{parcel.building}</Text>
          </View>
          <View style={{ marginTop: 5, alignItems: 'center' }}>
            <Text style={styles.label}>Locker</Text>
            <Text style={styles.value}>#{parcel.locker}</Text>
          </View>
          <View style={[styles.detailBlock, { marginTop: 17 }]}>
            <Text style={styles.label}>Pickup code</Text>
            <Text style={styles.value}>{parcel.code}</Text>
          </View>
          <View style={{ marginTop: 9, alignItems: 'center' }}>
            <Text style={styles.expires}>Expires in {parcel.expires}</Text>
          </View>

          <TouchableOpacity style={styles.openButton} onPress={() => openLocker(parcel)}>
            <Text style={styles.openButtonText}>Open Locker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.copyButton} onPress={() => copyCode(parcel)}>
            <Text style={styles.copyButtonText}>Copy Code</Text>
          </TouchableOpacity>

          {openCount > 0 && (
            <Text style={styles.note}>Locker opened {openCount} time{openCount === 1 ? '' : 's'}</Text>
          )}
        </View>
      ))}

      <View style={styles.helpBox}>
        <Text style={styles.helpTitle}>Need help?</Text>
        <Text style={styles.helpText}>
          Packages not picked up before they expire are returned to the front desk. Bring your
          student ID to collect them during desk hours.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f6f1ea',
  },
  content: {
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 22,
    alignItems: 'center',
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16a085',
    textAlign: 'center',
    marginBottom: 7,
  },
  tabs: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: '#ebe2d6',
    borderRadius: 10,
    padding: 3,
    marginBottom: 5,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 15,
    color: '#7a6a58',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#8e44ad',
    fontWeight: '600',
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: '#3d2c1b',
    textAlign: 'center',
  },
  carrier: {
    fontSize: 15,
    color: '#c9bba9',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
  detailBlock: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#cdbfae',
    textAlign: 'center',
  },
  value: {
    fontSize: 15,
    color: '#3d2c1b',
    textAlign: 'center',
  },
  expires: {
    fontSize: 13,
    color: '#ff2d55',
    textAlign: 'center',
  },
  openButton: {
    alignSelf: 'stretch',
    marginTop: 20,
    marginHorizontal: 7,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyButton: {
    marginTop: 8,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7a5c3e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: '#7a5c3e',
    fontSize: 13,
  },
  note: {
    fontSize: 13,
    color: '#8c7b68',
    marginTop: 13,
    textAlign: 'center',
  },
  helpBox: {
    alignSelf: 'stretch',
    marginTop: 7,
    padding: 13,
    backgroundColor: '#efe6da',
    borderRadius: 10,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e67e22',
    textAlign: 'center',
    marginBottom: 4,
  },
  helpText: {
    fontSize: 13,
    color: '#5f4f3e',
    textAlign: 'center',
    lineHeight: 19,
  },
});
