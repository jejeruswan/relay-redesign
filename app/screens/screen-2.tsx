import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Section = {
  label: string;
  days: string;
  time: string;
  room: string;
};

type ClassItem = {
  id: string;
  code: string;
  title: string;
  units: number;
  color: string;
  section: Section;
  altSection: Section;
};

type WaitlistItem = ClassItem & {
  position: number;
  size: number;
};

const TERM = 'Spring 2027';
const APPOINTMENT = 'Phase 2 begins Mon Nov 30, 9:00 AM';
const MAX_UNITS = 20.5;

const ENROLLED: ClassItem[] = [
  {
    id: 'cs61b',
    code: 'CS 61B',
    title: 'Data Structures',
    units: 4,
    color: '#e67e22',
    section: { label: 'LEC 001', days: 'MWF', time: '1:00 – 1:59 PM', room: 'Wheeler 150' },
    altSection: { label: 'LEC 002', days: 'MWF', time: '4:00 – 4:59 PM', room: 'Wheeler 150' },
  },
  {
    id: 'math54',
    code: 'MATH 54',
    title: 'Linear Algebra & Differential Equations',
    units: 4,
    color: '#9b59b6',
    section: { label: 'LEC 001', days: 'TuTh', time: '9:30 – 10:59 AM', room: 'Dwinelle 155' },
    altSection: { label: 'LEC 002', days: 'TuTh', time: '12:30 – 1:59 PM', room: 'Dwinelle 155' },
  },
  {
    id: 'data8',
    code: 'DATA 8',
    title: 'Foundations of Data Science',
    units: 4,
    color: '#16a085',
    section: { label: 'LEC 001', days: 'MWF', time: '10:00 – 10:59 AM', room: 'Wheeler 150' },
    altSection: { label: 'LAB 014', days: 'W', time: '2:00 – 3:59 PM', room: 'Dwinelle 155' },
  },
];

const WAITLIST: WaitlistItem[] = [
  {
    id: 'eecs16b',
    code: 'EECS 16B',
    title: 'Designing Information Devices and Systems II',
    units: 4,
    color: '#e84393',
    position: 23,
    size: 41,
    section: { label: 'LEC 001', days: 'TuTh', time: '2:00 – 3:29 PM', room: 'Pimentel 1' },
    altSection: { label: 'LEC 002', days: 'TuTh', time: '5:00 – 6:29 PM', room: 'Pimentel 1' },
  },
];

export default function StudentPortalScreen() {
  const [enrolled, setEnrolled] = useState<ClassItem[]>(ENROLLED);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>(WAITLIST);

  const units = enrolled.reduce((sum, c) => sum + c.units, 0);

  const dropClass = (item: ClassItem, waitlisted: boolean) => {
    Alert.alert(
      `Drop ${item.code}?`,
      waitlisted
        ? 'You will lose your place on the waitlist.'
        : `${item.units} units will be removed from your schedule.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Drop',
          style: 'destructive',
          onPress: () => {
            if (waitlisted) {
              setWaitlist((prev) => prev.filter((c) => c.id !== item.id));
            } else {
              setEnrolled((prev) => prev.filter((c) => c.id !== item.id));
            }
          },
        },
      ]
    );
  };

  const swapClass = (item: ClassItem, waitlisted: boolean) => {
    Alert.alert(
      `Swap ${item.code} section?`,
      `Switch to ${item.altSection.label}, ${item.altSection.days} ${item.altSection.time}, ${item.altSection.room}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Swap',
          onPress: () => {
            const swap = <T extends ClassItem>(c: T): T =>
              c.id === item.id ? { ...c, section: c.altSection, altSection: c.section } : c;
            if (waitlisted) {
              setWaitlist((prev) => prev.map(swap));
            } else {
              setEnrolled((prev) => prev.map(swap));
            }
          },
        },
      ]
    );
  };

  const renderClass = (item: ClassItem, waitlisted: boolean) => (
    <View key={item.id} style={styles.classCard}>
      <View style={[styles.colorBar, { backgroundColor: item.color }]} />
      <View style={styles.classBody}>
        <View style={styles.classHeader}>
          <Text style={styles.classCode}>{item.code}</Text>
          <Text style={styles.unitsText}>{item.units} units</Text>
        </View>
        <Text style={styles.classTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.sectionText}>
          {item.section.days} · {item.section.time}
        </Text>
        <Text style={styles.roomText}>
          {item.section.label} · {item.section.room}
        </Text>
        {waitlisted && 'position' in item && (
          <View style={styles.waitPill}>
            <Text style={styles.waitText}>
              Waitlist: {(item as WaitlistItem).position} of {(item as WaitlistItem).size}
            </Text>
          </View>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => swapClass(item, waitlisted)}
          >
            <Text style={styles.swapText}>Swap section</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropButton}
            onPress={() => dropClass(item, waitlisted)}
          >
            <Text style={styles.dropText}>Drop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.term}>{TERM}</Text>
      <Text style={styles.appName}>Student Portal</Text>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>NEXT UP</Text>
        <Text style={styles.heroTitle}>{APPOINTMENT}</Text>
        <View style={styles.unitsRow}>
          <Text style={styles.heroUnits}>
            {units}
            <Text style={styles.heroUnitsMax}> / {MAX_UNITS} units</Text>
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, (units / MAX_UNITS) * 100)}%` }]} />
        </View>
      </View>

      <Text style={styles.sectionHeader}>Enrolled · {enrolled.length}</Text>
      {enrolled.map((c) => renderClass(c, false))}

      {waitlist.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Waitlisted · {waitlist.length}</Text>
          {waitlist.map((c) => renderClass(c, true))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f8',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  term: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d6cdf',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f2a44',
    marginBottom: 16,
  },
  hero: {
    backgroundColor: '#1f2a44',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#8fb4ff',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  unitsRow: {
    marginTop: 16,
  },
  heroUnits: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  heroUnitsMax: {
    fontSize: 14,
    fontWeight: '500',
    color: '#aab4cc',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3a4666',
    marginTop: 8,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8fb4ff',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7488',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  colorBar: {
    width: 5,
  },
  classBody: {
    flex: 1,
    padding: 14,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  classCode: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2a44',
  },
  unitsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7488',
  },
  classTitle: {
    fontSize: 14,
    color: '#555d70',
    marginTop: 2,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2a44',
  },
  roomText: {
    fontSize: 13,
    color: '#6b7488',
    marginTop: 2,
  },
  waitPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff4e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  waitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b36b00',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  swapButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#eaf1ff',
    justifyContent: 'center',
    marginRight: 10,
  },
  swapText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d6cdf',
  },
  dropButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dropText: {
    fontSize: 14,
    color: '#c0392b',
  },
});
