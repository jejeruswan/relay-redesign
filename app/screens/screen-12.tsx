import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type VehicleKind = 'scooter' | 'bike';

type Vehicle = {
  id: string;
  kind: VehicleKind;
  battery: number;
  distance: string;
  location: string;
  range: string;
};

const UNLOCK_FEE = 1;
const PER_MINUTE = 0.39;

const VEHICLES: Vehicle[] = [
  { id: 'SC-4821', kind: 'scooter', battery: 82, distance: '120 ft', location: 'Bancroft & Telegraph', range: '14 mi' },
  { id: 'SC-3307', kind: 'scooter', battery: 41, distance: '350 ft', location: 'Durant & Bowditch', range: '6 mi' },
  { id: 'EB-1192', kind: 'bike', battery: 95, distance: '0.1 mi', location: 'Sather Gate', range: '38 mi' },
  { id: 'SC-5560', kind: 'scooter', battery: 14, distance: '0.2 mi', location: 'Channing & College', range: '2 mi' },
  { id: 'EB-2048', kind: 'bike', battery: 63, distance: '0.3 mi', location: 'Shattuck & Center', range: '24 mi' },
];

function batteryColor(level: number) {
  if (level >= 60) return '#2ECC40';
  if (level >= 30) return '#FFC107';
  return '#FF3B30';
}

export default function RideShareScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRide, setActiveRide] = useState<string | null>(null);

  const scooters = VEHICLES.filter((v) => v.kind === 'scooter');
  const bikes = VEHICLES.filter((v) => v.kind === 'bike');

  const unlock = () => {
    if (!selectedId) {
      Alert.alert('Pick a vehicle', 'Select a scooter or bike from the list first.');
      return;
    }
    setTimeout(() => {
      setActiveRide(selectedId);
      Alert.alert('Unlocked', `${selectedId} is ready to ride. Your timer has started.`);
    }, 1800);
  };

  const endRide = () => {
    Alert.alert('End ride?', 'Park in a marked zone before ending.', [
      { text: 'Keep riding', style: 'cancel' },
      {
        text: 'End ride',
        onPress: () => {
          setActiveRide(null);
          setSelectedId(null);
        },
      },
    ]);
  };

  const renderVehicle = (v: Vehicle) => {
    const selected = v.id === selectedId;
    return (
      <View key={v.id} style={[styles.vehicleRow, selected && styles.vehicleRowSelected]}>
        <TouchableOpacity onPress={() => setSelectedId(v.id)} style={styles.radioOuter}>
          {selected && <View style={styles.radioInner} />}
        </TouchableOpacity>
        <View style={styles.vehicleInfo}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{v.kind === 'scooter' ? 'E-SCOOTER' : 'E-BIKE'}</Text>
          </View>
          <Text style={styles.vehicleId}>{v.id}</Text>
          <Text style={[styles.battery, { color: batteryColor(v.battery) }]}>{v.battery}% battery</Text>
          <Text style={styles.distance}>
            {v.distance} · {v.location}
          </Text>
          <Text style={styles.range}>Est. range {v.range}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 13, paddingBottom: 40 }}>
      <Text style={styles.appName}>RideShare Go</Text>

      <View style={styles.map}>
        <Ionicons name="location" size={40} color="#888" />
        <Text style={{ color: '#888', marginTop: 6 }}>Map view</Text>
      </View>

      {activeRide && (
        <View style={styles.rideBanner}>
          <Text style={styles.rideText}>Riding {activeRide}</Text>
          <TouchableOpacity onPress={endRide} style={styles.endButton}>
            <Text style={styles.endText}>End ride</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.priceCard}>
        <Text style={styles.priceText}>
          ${UNLOCK_FEE.toFixed(2)} to unlock + ${PER_MINUTE.toFixed(2)}/min
        </Text>
      </View>

      <Text style={styles.heading}>Nearby Scooters</Text>
      {scooters.map(renderVehicle)}

      <Text style={styles.heading}>Nearby E-Bikes</Text>
      {bikes.map(renderVehicle)}

      <View style={styles.unlockRow}>
        <Text style={styles.selectedLabel}>{selectedId ? `Selected: ${selectedId}` : 'No vehicle selected'}</Text>
        <TouchableOpacity onPress={unlock} style={styles.unlockButton}>
          <Text style={styles.unlockText}>Unlock</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF6',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 3,
  },
  map: {
    height: 340,
    backgroundColor: '#D6D6D6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    ...shadow,
  },
  rideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    ...shadow,
  },
  rideText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
  },
  endButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    ...shadow,
  },
  endText: {
    color: '#fff',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginBottom: 22,
    ...shadow,
  },
  priceText: {
    fontSize: 15,
    color: '#00A6A6',
    fontWeight: '600',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF8C00',
    marginTop: 9,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 5,
    marginBottom: 7,
    ...shadow,
  },
  vehicleRowSelected: {
    backgroundColor: '#EEF5FF',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    ...shadow,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  vehicleInfo: {
    flex: 1,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#9B30FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
    ...shadow,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  vehicleId: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  battery: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  distance: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 2,
    textAlign: 'center',
  },
  range: {
    fontSize: 13,
    color: '#b5b5b5',
    textAlign: 'center',
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    ...shadow,
  },
  selectedLabel: {
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
  unlockButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    ...shadow,
  },
  unlockText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
