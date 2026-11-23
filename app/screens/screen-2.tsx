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
      <Text style={[styles.classCode, { color: item.color }]}>{item.code}</Text>
      <Text style={styles.classTitle}>{item.title}</Text>
      <View style={styles.sectionBox}>
        <Text style={styles.sectionText}>
          {item.section.label} · {item.section.days} {item.section.time}
        </Text>
        <Text style={styles.roomText}>{item.section.room}</Text>
      </View>
      <Text style={styles.unitsText}>{item.units} units</Text>
      {waitlisted && 'position' in item && (
        <Text style={styles.waitText}>
          Waitlist position: {(item as WaitlistItem).position} of {(item as WaitlistItem).size}
        </Text>
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => dropClass(item, waitlisted)}>
          <Text style={styles.actionLink}>Drop</Text>
        </TouchableOpacity>
        <Text style={{ color: '#ccc', marginHorizontal: 10 }}>|</Text>
        <TouchableOpacity onPress={() => swapClass(item, waitlisted)}>
          <Text style={styles.actionLink}>Swap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>Student Portal</Text>
      <Text style={styles.term}>{TERM}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enrollment Appointment</Text>
        <View style={styles.innerCard}>
          <Text style={styles.appointment}>{APPOINTMENT}</Text>
        </View>
        <View style={styles.innerCard}>
          <Text style={styles.unitsLabel}>Units</Text>
          <Text style={styles.unitsValue}>
            {units} / {MAX_UNITS} max
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enrolled</Text>
        {enrolled.map((c) => renderClass(c, false))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Waitlisted</Text>
        {waitlist.map((c) => renderClass(c, true))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f6',
  },
  content: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2a44',
    textAlign: 'center',
  },
  term: {
    fontSize: 15,
    fontWeight: '300',
    color: '#2d6cdf',
    textAlign: 'center',
    marginBottom: 14,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d6dbe4',
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2a44',
    textAlign: 'center',
    marginBottom: 10,
  },
  innerCard: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  appointment: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  unitsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  unitsValue: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6c3fc9',
    textAlign: 'center',
  },
  classCard: {
    width: '100%',
    backgroundColor: '#fafbfd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dde2ea',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  classCode: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  classTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  roomText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  unitsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#27ae60',
    textAlign: 'center',
  },
  waitText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  actionLink: {
    fontSize: 13,
    color: '#007AFF',
    paddingVertical: 3,
  },
});
