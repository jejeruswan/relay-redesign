import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Library = {
  id: string;
  name: string;
  short: string;
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
  { id: 'moffitt', name: 'Moffitt', short: 'Moffitt', hours: 'Open 8:00 AM – 2:00 AM' },
  { id: 'doe', name: 'Doe', short: 'Doe', hours: 'Open 9:00 AM – 10:00 PM' },
  { id: 'stacks', name: 'Main Stacks', short: 'Main Stacks', hours: 'Open 9:00 AM – 10:00 PM' },
  { id: 'eastasian', name: 'East Asian Library', short: 'East Asian', hours: 'Open 10:00 AM – 6:00 PM' },
  { id: 'kresge', name: 'Kresge Engineering', short: 'Kresge', hours: 'Open 9:00 AM – 9:00 PM' },
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

// One accent color; everything else is neutral.
const ACCENT = '#3B4FD8';
const ACCENT_SOFT = '#EDEFFC';
const INK = '#14161A';
const MUTED = '#6B7079';
const FAINT = '#A3A8B0';
const LINE = '#E3E5E9';
const SURFACE = '#FFFFFF';
const BG = '#F5F6F8';

function formatHour(hour: number) {
  const suffix = hour >= 12 ? 'pm' : 'am';
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}${suffix}`;
}

export default function LibraryRoomsScreen() {
  const insets = useSafeAreaInsets();
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
  const openCount = (r: Room) => HOURS.filter((h) => !isTaken(r, h)).length;

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

  const ready = !!room && hour !== null;
  const bookLabel = ready
    ? `Book ${room.name} · ${formatHour(hour)}–${formatHour(hour + 1)}`
    : room
      ? 'Pick a time'
      : 'Pick a room';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.date}>Today · Monday, Nov 23</Text>
        <Text style={styles.title}>Library Rooms</Text>

        <View style={styles.chipWrap}>
          {LIBRARIES.map((l) => {
            const active = l.id === libraryId;
            const count = ROOMS.filter((r) => r.libraryId === l.id).length;
            const empty = count === 0;
            return (
              <TouchableOpacity
                key={l.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => selectLibrary(l.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    empty && styles.chipTextEmpty,
                    active && styles.chipTextActive,
                  ]}
                >
                  {l.short}
                </Text>
                <Text
                  style={[
                    styles.chipCount,
                    empty && styles.chipTextEmpty,
                    active && styles.chipCountActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.hoursRow}>
          <Ionicons name="time-outline" size={14} color={MUTED} />
          <Text style={styles.hours}>{library?.hours}</Text>
        </View>

        <Text style={styles.sectionLabel}>
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
        </Text>

        {rooms.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No bookable rooms at {library?.name}.</Text>
          </View>
        )}

        {rooms.map((r) => {
          const active = r.id === roomId;
          const open = openCount(r);
          return (
            <View key={r.id} style={[styles.card, active && styles.cardActive]}>
              <TouchableOpacity activeOpacity={0.6} onPress={() => selectRoom(r.id)}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roomName}>{r.name}</Text>
                    <Text style={styles.roomMeta}>
                      {r.floor} · Up to {r.capacity} people
                    </Text>
                  </View>
                  <View style={[styles.openPill, open === 0 && styles.openPillFull]}>
                    <Text style={[styles.openPillText, open === 0 && styles.openPillTextFull]}>
                      {open === 0 ? 'Full' : `${open} open`}
                    </Text>
                  </View>
                </View>

                {(r.whiteboard || r.screen) && (
                  <View style={styles.amenities}>
                    {r.whiteboard && (
                      <View style={styles.amenity}>
                        <Ionicons name="easel-outline" size={14} color={MUTED} />
                        <Text style={styles.amenityText}>Whiteboard</Text>
                      </View>
                    )}
                    {r.screen && (
                      <View style={styles.amenity}>
                        <Ionicons name="tv-outline" size={14} color={MUTED} />
                        <Text style={styles.amenityText}>Screen</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>

              {active && (
                <View style={styles.slotSection}>
                  <View style={styles.divider} />
                  <Text style={styles.slotHeading}>Choose a time</Text>
                  <View style={styles.slotGrid}>
                    {HOURS.map((h) => {
                      const taken = isTaken(r, h);
                      const selected = h === hour;
                      return (
                        <TouchableOpacity
                          key={h}
                          disabled={taken}
                          onPress={() => setHour(h)}
                          style={[
                            styles.slot,
                            taken && styles.slotTaken,
                            selected && styles.slotSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              taken && styles.slotTextTaken,
                              selected && styles.slotTextSelected,
                            ]}
                          >
                            {formatHour(h)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <Text style={styles.note}>Bookings are 1 hour. Max 2 hours per day.</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.bookButton, !ready && styles.bookButtonIdle]}
          onPress={bookRoom}
        >
          <Text style={[styles.bookText, !ready && styles.bookTextIdle]}>{bookLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: INK,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  chipActive: {
    backgroundColor: INK,
    borderColor: INK,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
    color: INK,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextEmpty: {
    color: FAINT,
  },
  chipCount: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  chipCountActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  hours: {
    fontSize: 13,
    color: MUTED,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 28,
    marginBottom: 10,
  },
  empty: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: MUTED,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: ACCENT,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: INK,
  },
  roomMeta: {
    fontSize: 14,
    color: MUTED,
    marginTop: 3,
  },
  openPill: {
    backgroundColor: ACCENT_SOFT,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  openPillFull: {
    backgroundColor: BG,
  },
  openPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: ACCENT,
  },
  openPillTextFull: {
    color: FAINT,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: BG,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  amenityText: {
    fontSize: 13,
    color: MUTED,
  },
  slotSection: {
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
    marginVertical: 14,
  },
  slotHeading: {
    fontSize: 15,
    fontWeight: '600',
    color: INK,
    marginBottom: 10,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  slot: {
    width: '23%',
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  slotTaken: {
    backgroundColor: BG,
    borderColor: BG,
  },
  slotSelected: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  slotText: {
    fontSize: 15,
    fontWeight: '500',
    color: INK,
  },
  slotTextTaken: {
    color: FAINT,
    textDecorationLine: 'line-through',
  },
  slotTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: MUTED,
    marginTop: 12,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: SURFACE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LINE,
  },
  bookButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bookButtonIdle: {
    backgroundColor: '#E8EAEE',
  },
  bookText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  bookTextIdle: {
    color: MUTED,
  },
});
