import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const SCREENS = [
  { title: 'Study Room Booking', subtitle: 'Library rooms and time slots' },
  { title: 'Class Enrollment', subtitle: 'Classes, waitlist, drop and swap' },
  { title: 'Assignments', subtitle: 'Due this week across courses' },
  { title: 'Dining Menu', subtitle: "Today's menu at the dining halls" },
  { title: 'Gym Crowd Meter', subtitle: 'How busy the gym is right now' },
  { title: 'Laundry', subtitle: 'Washers and dryers in your building' },
  { title: 'Grades & GPA', subtitle: 'Semester and cumulative GPA' },
  { title: 'Apartment Search', subtitle: 'Listings near campus' },
  { title: 'Train Departures', subtitle: 'Downtown Berkeley station' },
  { title: 'Health Appointment', subtitle: 'Book a visit at the health center' },
  { title: 'Print Queue', subtitle: 'Release your print jobs' },
  { title: 'Scooter Unlock', subtitle: 'Nearby scooters and e-bikes' },
];

export default function Home() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={SCREENS}
      keyExtractor={(_, i) => String(i + 1)}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>Pick your screen</Text>
          <Text style={styles.hint}>
            Tap the screen number shown in your ./relay banner.
          </Text>
        </View>
      }
      renderItem={({ item, index }) => {
        const n = index + 1;
        return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Screen ${n}, ${item.title}`}
              onPress={() => router.push(`/screens/screen-${n}` as never)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{n}</Text>
              </View>
              <View style={styles.text}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
            </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 48 },
  header: { marginBottom: 20 },
  heading: { fontSize: 28, fontWeight: '600', color: '#1C1C1E', letterSpacing: 0.2 },
  hint: { marginTop: 4, fontSize: 15, color: '#8E8E93' },
  separator: { height: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardPressed: {
    backgroundColor: '#F2F2F7',
    borderColor: '#D1D1D6',
    transform: [{ scale: 0.98 }],
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#1C1C1E', fontSize: 15, fontWeight: '600' },
  text: { flex: 1 },
  title: { fontSize: 17, fontWeight: '500', color: '#1C1C1E' },
  subtitle: { marginTop: 2, fontSize: 14, color: '#8E8E93' },
});
