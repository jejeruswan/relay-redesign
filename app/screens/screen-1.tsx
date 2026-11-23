import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Library = {
  id: string;
  name: string;
  hours: string;
};

type Room = {
  id: string;
  libraryId: string;
  name: string;
  floor: string;
  capacity: number;
  whiteboard: boolean;
  screen: boolean;
  taken: number[];
};

const LIBRARIES: Library[] = [
  { id: 'moffitt', name: 'Moffitt', hours: 'Open 8:00 AM – 2:00 AM' },
  { id: 'doe', name: 'Doe', hours: 'Open 9:00 AM – 10:00 PM' },
  { id: 'stacks', name: 'Main Stacks', hours: 'Open 9:00 AM – 10:00 PM' },
  { id: 'eastasian', name: 'East Asian Library', hours: 'Open 10:00 AM – 6:00 PM' },
  { id: 'kresge', name: 'Kresge Engineering', hours: 'Open 9:00 AM – 9:00 PM' },
];

const ROOMS: Room[] = [
  { id: 'm1', libraryId: 'moffitt', name: 'Room 405', floor: '4th floor', capacity: 6, whiteboard: true, screen: true, taken: [9, 10, 11, 12, 13, 14, 16, 17, 19, 20] },
  { id: 'm2', libraryId: 'moffitt', name: 'Room 410', floor: '4th floor', capacity: 4, whiteboard: true, screen: false, taken: [9, 10, 12, 13, 14, 15, 16, 17, 18] },
  { id: 'm3', libraryId: 'moffitt', name: 'Room 512', floor: '5th floor', capacity: 8, whiteboard: true, screen: true, taken: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: 'd1', libraryId: 'doe', name: 'Group Study 180', floor: '1st floor', capacity: 6, whiteboard: false, screen: true, taken: [9, 11, 12, 13, 14, 15, 17, 18, 19] },
  { id: 'd2', libraryId: 'doe', name: 'Group Study 182', floor: '1st floor', capacity: 4, whiteboard: true, screen: false, taken: [10, 11, 12, 13, 15, 16, 17, 18, 20] },
  { id: 's1', libraryId: 'stacks', name: 'Carrel Room B2', floor: 'Level B', capacity: 2, whiteboard: false, screen: false, taken: [9, 10, 11, 13, 14, 15, 16, 17, 18, 19] },
  { id: 's2', libraryId: 'stacks', name: 'Seminar Room C1', floor: 'Level C', capacity: 10, whiteboard: true, screen: true, taken: [9, 10, 11, 12, 14, 15, 16, 18, 19, 20] },
  { id: 'k1', libraryId: 'kresge', name: 'Room 110A', floor: '1st floor', capacity: 5, whiteboard: true, screen: true, taken: [9, 10, 11, 12, 13, 15, 16, 17, 20] },
  { id: 'k2', libraryId: 'kresge', name: 'Room 110B', floor: '1st floor', capacity: 5, whiteboard: true, screen: false, taken: [10, 11, 12, 13, 14, 16, 17, 18, 19] },
  { id: 'k3', libraryId: 'kresge', name: 'Room 212', floor: '2nd floor', capacity: 8, whiteboard: true, screen: true, taken: [9, 11, 12, 13, 14, 15, 17, 18, 19, 20] },
];

const HOURS: number[] = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}${suffix}`;
}

export default function LibraryRoomsScreen() {
  const [libraryId, setLibraryId] = useState<string>('moffitt');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [booked, setBooked] = useState<Record<string, number[]>>({});

  const library = LIBRARIES.find((l) => l.id === libraryId);
  const rooms = ROOMS.filter((r) => r.libraryId === libraryId);
  const room = rooms.find((r) => r.id === roomId);

  const selectLibrary = (id: string) => {
    setLibraryId(id);
    setRoomId(null);
    setHour(null);
  };

  const selectRoom = (id: string) => {
    setRoomId(id);
    setHour(null);
  };

  const isTaken = (r: Room, h: number) => r.taken.includes(h) || (booked[r.id] ?? []).includes(h);

  const bookRoom = () => {
    if (!room || hour === null) {
      Alert.alert('Select a room and time', 'Choose a room and an open time slot first.');
      return;
    }
    const bookedRoom = room;
    const bookedHour = hour;
    setTimeout(() => {
      setBooked((prev) => ({
        ...prev,
        [bookedRoom.id]: [...(prev[bookedRoom.id] ?? []), bookedHour],
      }));
      setHour(null);
      Alert.alert(
        'Room booked',
        `${bookedRoom.name}, ${library?.name}\nToday ${formatHour(bookedHour)} – ${formatHour(bookedHour + 1)}`
      );
    }, 1800);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.appName}>Library Rooms</Text>
      <Text style={styles.date}>Today, Monday Nov 23</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {LIBRARIES.map((l) => (
          <TouchableOpacity
            key={l.id}
            style={[styles.chip, l.id === libraryId && styles.chipActive]}
            onPress={() => selectLibrary(l.id)}
          >
            <Text style={[styles.chipText, l.id === libraryId && { color: '#fff' }]}>{l.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.hours}>{library?.hours}</Text>

      <Text style={styles.heading}>Rooms</Text>
      {rooms.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={[styles.roomRow, r.id === roomId && styles.roomRowActive]}
          onPress={() => selectRoom(r.id)}
        >
          <Text style={styles.roomName}>{r.name}</Text>
          <Text style={styles.roomMeta}>{r.floor}</Text>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color="#555" style={{ marginTop: 6 }} />
            <Text style={styles.roomMeta}> {r.capacity} people</Text>
            {r.whiteboard && (
              <View style={styles.amenity}>
                <Ionicons name="easel-outline" size={14} color="#0aa5a5" />
                <Text style={styles.amenityText}>Whiteboard</Text>
              </View>
            )}
            {r.screen && (
              <View style={styles.amenity}>
                <Ionicons name="tv-outline" size={14} color="#0aa5a5" />
                <Text style={styles.amenityText}>Screen</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}

      {room && (
        <View style={styles.slotSection}>
          <Text style={styles.heading}>Times for {room.name}</Text>
          <View style={styles.legend}>
            <View style={[styles.dot, { backgroundColor: '#2ecc40' }]} />
            <Text style={styles.legendText}>Available</Text>
            <View style={[styles.dot, { backgroundColor: '#ff3b30' }]} />
            <Text style={styles.legendText}>Taken</Text>
            <View style={[styles.dot, { backgroundColor: '#007AFF' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.slotGrid}>
            {HOURS.map((h) => {
              const taken = isTaken(room, h);
              const selected = h === hour;
              return (
                <TouchableOpacity
                  key={h}
                  disabled={taken}
                  onPress={() => setHour(h)}
                  style={[
                    styles.slot,
                    taken ? styles.slotTaken : styles.slotOpen,
                    selected && styles.slotSelected,
                  ]}
                >
                  <Text style={styles.slotText}>{formatHour(h)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.legendText}>Bookings are 1 hour. Max 2 hours per day.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.bookButton} onPress={bookRoom}>
        <Text style={styles.bookText}>Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f0',
    paddingHorizontal: 5,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 13,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chipRow: {
    marginTop: 8,
    flexGrow: 0,
  },
  chip: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8e44ad',
    marginRight: 7,
  },
  chipActive: {
    backgroundColor: '#8e44ad',
  },
  chipText: {
    fontSize: 14,
    color: '#8e44ad',
  },
  hours: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f57c00',
    marginTop: 8,
    marginBottom: 5,
  },
  roomRow: {
    backgroundColor: '#fff',
    padding: 7,
    marginBottom: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  roomRowActive: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  roomName: {
    fontSize: 14,
    color: '#333',
  },
  roomMeta: {
    fontSize: 14,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 3,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 13,
  },
  amenityText: {
    fontSize: 14,
    color: '#0aa5a5',
    marginLeft: 3,
  },
  slotSection: {
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginLeft: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#b5b5b5',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  slot: {
    width: 80,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 7,
  },
  slotOpen: {
    backgroundColor: '#2ecc40',
  },
  slotTaken: {
    backgroundColor: '#ff3b30',
  },
  slotSelected: {
    backgroundColor: '#007AFF',
  },
  slotText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    alignSelf: 'flex-end',
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  bookText: {
    fontSize: 13,
    color: '#888',
  },
});
