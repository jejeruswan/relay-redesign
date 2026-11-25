import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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

const MAX_HOURS_PER_DAY = 2;

const HOURS: number[] = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// One accent color; everything else is neutral.
// Neutrals are tinted slightly toward the accent's blue so everything feels related.
const ACCENT = '#3B4FD8';
const ACCENT_SOFT = '#E9ECFC';
const INK = '#161A33';
const MUTED = '#636A85';
const FAINT = '#7C839C'; // disabled text, still readable on white and BG
const LINE = '#E1E4F0';
const SURFACE = '#FFFFFF';
const BG = '#F4F5FB';
const IDLE = '#E4E7F4';

// Spacing scale: 4 / 8 / 16 / 24 / 32 / 48. Every margin, padding and gap uses these.
const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

// Corner radius scale.
const RADIUS = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

// Text styles: five roles used everywhere.
const TYPE = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.6 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 20, fontWeight: '500' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
} as const;

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
  const [booking, setBooking] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const library = LIBRARIES.find((l) => l.id === libraryId);
  const rooms = ROOMS.filter((r) => r.libraryId === libraryId);
  const room = rooms.find((r) => r.id === roomId);

  const hoursUsed = Object.values(booked).reduce((n, list) => n + list.length, 0);
  const limitReached = hoursUsed >= MAX_HOURS_PER_DAY;

  const selectLibrary = (id: string) => {
    if (booking) return;
    Haptics.selectionAsync();
    setLibraryId(id);
    setRoomId(null);
    setHour(null);
  };

  const selectRoom = (id: string) => {
    if (booking) return;
    Haptics.selectionAsync();
    setRoomId((prev) => (prev === id ? null : id));
    setHour(null);
  };

  const selectHour = (h: number) => {
    if (booking) return;
    Haptics.selectionAsync();
    setConfirmation(null);
    setHour((prev) => (prev === h ? null : h));
  };

  const isTaken = (r: Room, h: number) => r.taken.includes(h) || (booked[r.id] ?? []).includes(h);
  const openCount = (r: Room) => HOURS.filter((h) => !isTaken(r, h)).length;

  const bookRoom = () => {
    if (!room || hour === null || booking) return;
    const bookedRoom = room;
    const bookedHour = hour;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBooking(true);
    timer.current = setTimeout(() => {
      setBooked((prev) => ({
        ...prev,
        [bookedRoom.id]: [...(prev[bookedRoom.id] ?? []), bookedHour],
      }));
      setHour(null);
      setBooking(false);
      setConfirmation(
        `${bookedRoom.name}, ${library?.name} · Today ${formatHour(bookedHour)}–${formatHour(bookedHour + 1)}`
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1800);
  };

  const ready = !!room && hour !== null;
  const bookLabel = booking
    ? 'Booking…'
    : ready
      ? `Book ${room.name} · ${formatHour(hour)}–${formatHour(hour + 1)}`
      : room
        ? 'Pick a time'
        : 'Pick a room';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>Today · Monday, Nov 23</Text>
        <Text style={styles.title}>Library Rooms</Text>

        <View style={styles.chipWrap}>
          {LIBRARIES.map((l) => {
            const active = l.id === libraryId;
            const count = ROOMS.filter((r) => r.libraryId === l.id).length;
            const empty = count === 0;
            return (
              <Pressable
                key={l.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${l.name}, ${count} ${count === 1 ? 'room' : 'rooms'}`}
                style={({ pressed }) => [
                  styles.chip,
                  active && styles.chipActive,
                  pressed && styles.pressed,
                ]}
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
              </Pressable>
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
            <Ionicons name="book-outline" size={32} color={FAINT} />
            <Text style={styles.emptyTitle}>No bookable rooms</Text>
            <Text style={styles.emptyText}>
              {library?.name} has no study rooms you can reserve. Try another library.
            </Text>
          </View>
        )}

        {rooms.map((r) => {
          const active = r.id === roomId;
          const open = openCount(r);
          const full = open === 0;
          return (
            <View key={r.id} style={[styles.card, active && styles.cardActive]}>
              <Pressable
                disabled={full}
                accessibilityRole="button"
                accessibilityState={{ expanded: active, disabled: full }}
                accessibilityLabel={`${r.name}, ${full ? 'full' : `${open} times open`}`}
                style={({ pressed }) => pressed && styles.pressed}
                onPress={() => selectRoom(r.id)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.roomName, full && styles.roomNameFull]}>{r.name}</Text>
                    <Text style={styles.roomMeta}>
                      {r.floor} · Up to {r.capacity} people
                    </Text>
                  </View>
                  <View style={[styles.openPill, full && styles.openPillFull]}>
                    <Text style={[styles.openPillText, full && styles.openPillTextFull]}>
                      {full ? 'Full' : `${open} open`}
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
              </Pressable>

              {active && (
                <View style={styles.slotSection}>
                  <View style={styles.divider} />
                  <Text style={styles.slotHeading}>Choose a time</Text>
                  <View style={styles.slotGrid}>
                    {HOURS.map((h) => {
                      const taken = isTaken(r, h);
                      const blocked = taken || limitReached;
                      const selected = h === hour;
                      return (
                        <Pressable
                          key={h}
                          disabled={blocked}
                          accessibilityRole="button"
                          accessibilityState={{ selected, disabled: blocked }}
                          accessibilityLabel={`${formatHour(h)}, ${taken ? 'taken' : limitReached ? 'daily limit reached' : 'available'}`}
                          onPress={() => selectHour(h)}
                          style={({ pressed }) => [
                            styles.slot,
                            blocked && styles.slotTaken,
                            selected && styles.slotSelected,
                            pressed && !blocked && styles.pressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              blocked && styles.slotTextTaken,
                              taken && styles.slotTextStruck,
                              selected && styles.slotTextSelected,
                            ]}
                          >
                            {formatHour(h)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={[styles.note, limitReached && styles.noteLimit]}>
                    {limitReached
                      ? `Daily limit reached: ${hoursUsed} of ${MAX_HOURS_PER_DAY} hours booked.`
                      : `Bookings are 1 hour. ${hoursUsed} of ${MAX_HOURS_PER_DAY} hours used today.`}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {confirmation && (
        <View style={styles.banner} accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={24} color={ACCENT} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Room booked</Text>
            <Text style={styles.bannerBody}>{confirmation}</Text>
          </View>
          <Pressable
            onPress={() => setConfirmation(null)}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
            hitSlop={8}
            style={({ pressed }) => [styles.bannerClose, pressed && styles.pressed]}
          >
            <Ionicons name="close" size={20} color={MUTED} />
          </Pressable>
        </View>
      )}

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, SPACE.md) }]}>
        <Pressable
          disabled={!ready || booking}
          accessibilityRole="button"
          accessibilityState={{ disabled: !ready || booking, busy: booking }}
          style={({ pressed }) => [
            styles.bookButton,
            !ready && styles.bookButtonIdle,
            pressed && ready && !booking && styles.bookPressed,
          ]}
          onPress={bookRoom}
        >
          {booking && <ActivityIndicator color="#fff" />}
          <Text style={[styles.bookText, !ready && styles.bookTextIdle]}>{bookLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  content: {
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.xl,
    paddingBottom: SPACE.xl,
  },

  // Header
  date: {
    ...TYPE.caption,
    fontWeight: '500',
    color: MUTED,
  },
  title: {
    ...TYPE.display,
    color: INK,
    marginTop: SPACE.sm,
  },

  // Library chips
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.sm,
    marginTop: SPACE.xl,
  },
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACE.sm,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: LINE,
  },
  chipActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  chipText: {
    ...TYPE.body,
    color: INK,
  },
  chipTextActive: {
    color: '#fff',
  },
  chipTextEmpty: {
    color: FAINT,
  },
  chipCount: {
    ...TYPE.caption,
    fontWeight: '500',
    color: MUTED,
  },
  chipCountActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.sm,
    marginTop: SPACE.lg,
  },
  hours: {
    ...TYPE.caption,
    color: MUTED,
  },

  // Room list
  sectionLabel: {
    ...TYPE.label,
    color: MUTED,
    marginTop: SPACE.xxl,
    marginBottom: SPACE.md,
  },
  empty: {
    backgroundColor: SURFACE,
    borderRadius: RADIUS.lg,
    padding: SPACE.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    ...TYPE.heading,
    color: INK,
    marginTop: SPACE.md,
  },
  emptyText: {
    ...TYPE.caption,
    color: MUTED,
    textAlign: 'center',
    marginTop: SPACE.xs,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: RADIUS.lg,
    padding: SPACE.lg,
    marginBottom: SPACE.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: ACCENT,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACE.md,
  },
  cardInfo: {
    flex: 1,
  },
  roomName: {
    ...TYPE.heading,
    color: INK,
  },
  roomNameFull: {
    color: FAINT,
  },
  roomMeta: {
    ...TYPE.caption,
    color: MUTED,
    marginTop: SPACE.sm,
  },
  openPill: {
    backgroundColor: ACCENT_SOFT,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.sm + SPACE.xs,
    paddingVertical: SPACE.xs,
  },
  openPillFull: {
    backgroundColor: BG,
  },
  openPillText: {
    ...TYPE.caption,
    fontWeight: '600',
    color: ACCENT,
  },
  openPillTextFull: {
    color: FAINT,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACE.sm,
    marginTop: SPACE.md,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.xs,
    backgroundColor: BG,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs,
  },
  amenityText: {
    ...TYPE.caption,
    color: MUTED,
  },

  // Time slots
  slotSection: {
    marginTop: SPACE.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: LINE,
    marginVertical: SPACE.lg,
  },
  slotHeading: {
    ...TYPE.body,
    fontWeight: '600',
    color: INK,
    marginBottom: SPACE.md,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: SPACE.md,
  },
  slot: {
    width: '23%',
    minHeight: 44,
    borderRadius: RADIUS.md,
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
    ...TYPE.body,
    color: INK,
  },
  slotTextTaken: {
    color: FAINT,
  },
  slotTextStruck: {
    textDecorationLine: 'line-through',
  },
  slotTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  note: {
    ...TYPE.caption,
    color: MUTED,
    marginTop: SPACE.lg,
  },
  noteLimit: {
    color: INK,
    fontWeight: '600',
  },

  // Confirmation banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    marginHorizontal: SPACE.lg,
    marginBottom: SPACE.md,
    padding: SPACE.md,
    borderRadius: RADIUS.lg,
    backgroundColor: ACCENT_SOFT,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...TYPE.body,
    fontWeight: '600',
    color: INK,
  },
  bannerBody: {
    ...TYPE.caption,
    color: MUTED,
    marginTop: SPACE.xs,
  },
  bannerClose: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom bar
  bottomBar: {
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.md,
    backgroundColor: SURFACE,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LINE,
  },
  bookButton: {
    flexDirection: 'row',
    gap: SPACE.sm,
    minHeight: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.md,
  },
  bookPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  bookButtonIdle: {
    backgroundColor: IDLE,
  },
  bookText: {
    ...TYPE.heading,
    color: '#fff',
  },
  bookTextIdle: {
    color: MUTED,
  },
});
