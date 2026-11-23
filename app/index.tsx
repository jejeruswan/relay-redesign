import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREENS = [
  'Study Room Booking',
  'Class Enrollment',
  'Assignments',
  'Dining Menu',
  'Gym Crowd Meter',
  'Laundry',
  'Grades & GPA',
  'Apartment Search',
  'Train Departures',
  'Health Appointment',
  'Print Queue',
  'Scooter Unlock',
  'Club Event RSVP',
  'Night Safety Walk',
  'Rent Payment',
  'Package Locker',
  'Parking Meter',
  'Transit Card',
  'Billing & Aid',
  'Boarding Pass',
];

export default function Home() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={SCREENS}
      keyExtractor={(_, i) => String(i + 1)}
      ListHeaderComponent={
        <Text style={styles.hint}>Tap the screen number you were given.</Text>
      }
      renderItem={({ item, index }) => {
        const n = index + 1;
        return (
          <Link href={`/screens/screen-${n}` as never} asChild>
            <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{n}</Text>
              </View>
              <Text style={styles.name}>{item}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 40 },
  hint: { paddingHorizontal: 16, paddingVertical: 12, color: '#666', fontSize: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  rowPressed: { backgroundColor: '#f2f2f2' },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  name: { flex: 1, fontSize: 17, color: '#111' },
  chevron: { fontSize: 24, color: '#bbb' },
});
