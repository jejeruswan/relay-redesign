import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

type RsvpChoice = 'going' | 'maybe' | 'no';

type EventInfo = {
  title: string;
  club: string;
  date: string;
  time: string;
  location: string;
  description: string[];
  goingCount: number;
  maybeCount: number;
  friends: string[];
};

const EVENT: EventInfo = {
  title: 'Intro to Figma Workshop',
  club: 'Berkeley Design Collective',
  date: 'Thu, Dec 3',
  time: '7:00 – 8:30 PM',
  location: 'Soda Hall 306',
  description: [
    'New to design tools? This hands-on workshop walks you through Figma from a blank file to a clickable prototype. We will cover frames, auto layout, components, and how to share your work for feedback.',
    'No experience needed. Bring a laptop with a free Figma account already set up. If you do not have a laptop, let us know in advance and we will try to pair you with someone.',
    'Snacks will be provided. Stick around afterwards to meet the rest of the club and hear about our spring project teams.',
  ],
  goingCount: 36,
  maybeCount: 12,
  friends: ['Maya', 'Jordan'],
};

const RSVP_OPTIONS: { key: RsvpChoice; label: string }[] = [
  { key: 'going', label: 'Going' },
  { key: 'maybe', label: 'Maybe' },
  { key: 'no', label: "Can't go" },
];

export default function ClubEventScreen() {
  const [rsvp, setRsvp] = useState<RsvpChoice | null>(null);

  const going = EVENT.goingCount + (rsvp === 'going' ? 1 : 0);
  const maybe = EVENT.maybeCount + (rsvp === 'maybe' ? 1 : 0);
  const othersCount = EVENT.goingCount - EVENT.friends.length;
  const whoText =
    rsvp === 'going'
      ? `You, ${EVENT.friends.join(', ')} and ${othersCount} others`
      : `${EVENT.friends.join(', ')} and ${othersCount} others`;

  const chooseRsvp = (choice: RsvpChoice) => {
    setRsvp(choice);
    if (choice === 'going') {
      Alert.alert("You're going!", `See you at ${EVENT.location}.`);
    }
  };

  const addToCalendar = () => {
    Alert.alert('Added to calendar', `${EVENT.title}\n${EVENT.date}, ${EVENT.time}`);
  };

  const shareEvent = () => {
    Alert.alert('Link copied', 'Share it with your friends.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 28 }}>
      <Text style={styles.appName}>Club Hub</Text>
      <View style={styles.banner} />

      <Text style={styles.club}>{EVENT.club}</Text>
      <Text style={styles.title}>{EVENT.title}</Text>

      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={22} color="#4F46E5" />
        <Text style={styles.detailText}>{EVENT.date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Feather name="clock" size={15} color="#4F46E5" style={{ marginTop: 5 }} />
        <Text style={[styles.detailText, { fontSize: 14 }]}>{EVENT.time}</Text>
      </View>
      <View style={styles.detailRow}>
        <MaterialIcons name="location-on" size={27} color="#4F46E5" />
        <Text style={styles.detailText}>{EVENT.location}</Text>
      </View>

      <Text style={styles.sectionTitle}>About this event</Text>
      {EVENT.description.map((para, i) => (
        <Text key={i} style={styles.paragraph}>
          {para}
        </Text>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Who's going</Text>
      <View style={styles.avatarRow}>
        {[0, 1, 2, 3, 4].map((n) => (
          <View key={n} style={[styles.avatar, { marginLeft: n === 0 ? 0 : -8 }]} />
        ))}
      </View>
      <Text style={styles.whoText}>{whoText}</Text>
      <Text style={styles.countText}>
        {going} going · {maybe} maybe
      </Text>

      <Text style={styles.rsvpLabel}>Are you going?</Text>
      <View style={styles.buttonRow}>
        {RSVP_OPTIONS.map((opt) => {
          const selected = rsvp === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => chooseRsvp(opt.key)}
              style={[styles.actionButton, selected && styles.actionButtonSelected]}
            >
              <Text style={[styles.actionText, selected && { color: '#4F46E5' }]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.buttonRow, { marginTop: 5 }]}>
        <TouchableOpacity onPress={addToCalendar} style={styles.actionButton}>
          <Text style={styles.actionText}>Add to calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={shareEvent} style={styles.actionButton}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 6,
  },
  appName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 7,
    letterSpacing: 1,
  },
  banner: {
    height: 150,
    backgroundColor: '#D9D6E3',
    borderRadius: 8,
    marginTop: 8,
  },
  club: {
    fontSize: 25,
    fontWeight: '800',
    color: '#E4572E',
    textAlign: 'center',
    marginTop: 13,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#7B2CBF',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 9,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 15,
    color: '#B4B7C0',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0E9F6E',
    textAlign: 'center',
    marginTop: 17,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 7,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#C7C7CC',
    borderWidth: 2,
    borderColor: '#FAF8FF',
  },
  whoText: {
    fontSize: 13,
    fontWeight: '300',
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
  },
  countText: {
    fontSize: 11,
    color: '#C4C4CC',
    textAlign: 'center',
    marginTop: 2,
  },
  rsvpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    height: 44,
    marginHorizontal: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF0FF',
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
  },
});
