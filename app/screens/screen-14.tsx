import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ServiceStatus = {
  estimatedWait: number;
  walkersAvailable: number;
  hours: string;
};

type Assignment = {
  walker: string;
  etaMinutes: number;
};

const SERVICE: ServiceStatus = {
  estimatedWait: 12,
  walkersAvailable: 3,
  hours: '8 PM – 2:30 AM',
};

const DEFAULT_PICKUP = 'Moffitt Library';
const DEFAULT_DESTINATION = 'Unit 3, 2400 Durant Ave';
const ASSIGNED: Assignment = { walker: 'Alex', etaMinutes: 11 };

const SAFETY_NOTE =
  'Night Walk is a peer escort service. Walkers are trained students, not police. If you are in immediate danger, call 911.';

export default function NightWalkScreen() {
  const [pickup, setPickup] = useState(DEFAULT_PICKUP);
  const [destination, setDestination] = useState(DEFAULT_DESTINATION);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const swap = () => {
    setPickup(destination);
    setDestination(pickup);
  };

  const requestWalk = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert('Missing info', 'Enter both a pickup location and a destination.');
      return;
    }
    setTimeout(() => {
      setAssignment(ASSIGNED);
    }, 1800);
  };

  const cancelWalk = () => {
    Alert.alert('Cancel walk?', 'Your walker will be notified.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel walk', style: 'destructive', onPress: () => setAssignment(null) },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 6, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.appName}>Night Walk</Text>
        <Text style={styles.tagline}>Get walked home by a trained student escort</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Estimated wait</Text>
          <Text style={styles.statusValue}>{SERVICE.estimatedWait} min</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Walkers available</Text>
          <Text style={[styles.statusValue, { color: '#A3FF12' }]}>{SERVICE.walkersAvailable}</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Service hours</Text>
          <Text style={[styles.statusValue, { color: '#FF9500' }]}>{SERVICE.hours}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your trip</Text>
        <View style={styles.fieldGroup}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Pickup (current location)</Text>
            <TextInput
              value={pickup}
              onChangeText={setPickup}
              style={styles.input}
              placeholder="Where are you?"
              placeholderTextColor="#555"
            />
          </View>
          <View style={styles.swapRow}>
            <TouchableOpacity onPress={swap} style={styles.swapButton}>
              <MaterialCommunityIcons name="swap-vertical" size={16} color="#00E5FF" />
            </TouchableOpacity>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Destination</Text>
            <TextInput
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
              placeholder="Where are you going?"
              placeholderTextColor="#555"
            />
          </View>
        </View>
      </View>

      {assignment ? (
        <View style={[styles.section, { borderColor: '#A3FF12' }]}>
          <View style={styles.assignedBox}>
            <Text style={styles.assignedText}>
              Walker assigned: {assignment.walker} · arriving in {assignment.etaMinutes} min
            </Text>
            <TouchableOpacity onPress={cancelWalk}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={requestWalk} style={styles.requestButton}>
          <Text style={styles.requestText}>Request walk</Text>
        </TouchableOpacity>
      )}

      <View style={styles.section}>
        <Text style={styles.safetyNote}>{SAFETY_NOTE}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1A33',
  },
  section: {
    borderWidth: 1,
    borderColor: '#BF5AF2',
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF2D95',
  },
  tagline: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBox: {
    borderWidth: 1,
    borderColor: '#2E3F66',
    borderRadius: 4,
    padding: 6,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 13,
    color: '#555',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#00E5FF',
    marginBottom: 4,
  },
  fieldGroup: {
    borderWidth: 1,
    borderColor: '#2E3F66',
    borderRadius: 4,
    padding: 5,
  },
  field: {
    borderWidth: 1,
    borderColor: '#3D5080',
    borderRadius: 4,
    padding: 5,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#FFD60A',
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 15,
  },
  swapRow: {
    alignItems: 'flex-end',
    marginVertical: 3,
  },
  swapButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00E5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignedBox: {
    borderWidth: 1,
    borderColor: '#2E3F66',
    borderRadius: 4,
    padding: 6,
  },
  assignedText: {
    fontSize: 14,
    color: '#E6E6E6',
  },
  cancelText: {
    fontSize: 11,
    color: '#FF2D95',
    marginTop: 4,
  },
  requestButton: {
    height: 44,
    borderWidth: 1,
    borderColor: '#3D5080',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  requestText: {
    fontSize: 13,
    color: '#8899BB',
  },
  safetyNote: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 25,
    color: '#FFD60A',
  },
});
