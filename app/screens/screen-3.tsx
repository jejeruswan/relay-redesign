import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Status = 'submitted' | 'missing' | 'notyet';
type Kind = 'homework' | 'lab' | 'project' | 'essay' | 'quiz';
type Filter = 'All' | 'Missing' | 'Submitted' | 'Quizzes';

type Assignment = {
  id: string;
  title: string;
  course: string;
  kind: Kind;
  due: string;
  points: number;
  status: Status;
};

const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Homework 12: Linear Transformations', course: 'EECS 16A', kind: 'homework', due: 'Sun Nov 22, 11:59 PM', points: 30, status: 'missing' },
  { id: 'a2', title: 'Essay 3 Draft: Close Reading', course: 'ENGLISH R1A', kind: 'essay', due: 'Mon Nov 23, 9:00 AM', points: 50, status: 'missing' },
  { id: 'a3', title: 'Lab: Touch 3B', course: 'EECS 16A', kind: 'lab', due: 'Mon Nov 23, 9:00 AM', points: 10, status: 'submitted' },
  { id: 'a4', title: 'Lab 10: Regression Inference', course: 'Data 8', kind: 'lab', due: 'Mon Nov 23, 5:00 PM', points: 4, status: 'submitted' },
  { id: 'a5', title: 'HW 09: Scheme', course: 'CS 61A', kind: 'homework', due: 'Tue Nov 24, 11:59 PM', points: 2, status: 'notyet' },
  { id: 'a6', title: 'Problem Set 13: Power Series', course: 'MATH 1B', kind: 'homework', due: 'Tue Nov 24, 11:59 PM', points: 20, status: 'submitted' },
  { id: 'a7', title: 'Homework 9: Confidence Intervals', course: 'Data 8', kind: 'homework', due: 'Wed Nov 25, 11:59 PM', points: 6, status: 'notyet' },
  { id: 'a8', title: 'Reading Response 11', course: 'ENGLISH R1A', kind: 'essay', due: 'Wed Nov 25, 11:59 PM', points: 10, status: 'notyet' },
  { id: 'a9', title: 'Project 4: Scheme Interpreter (Phase 1)', course: 'CS 61A', kind: 'project', due: 'Fri Nov 27, 11:59 PM', points: 25, status: 'notyet' },
];

const FILTERS: Filter[] = ['All', 'Missing', 'Submitted', 'Quizzes'];

const STATUS_LABEL: Record<Status, string> = {
  submitted: 'Submitted',
  missing: 'Missing',
  notyet: 'Not yet submitted',
};

const STATUS_ICON: Record<Status, keyof typeof Ionicons.glyphMap> = {
  submitted: 'checkmark-circle-outline',
  missing: 'alert-circle-outline',
  notyet: 'ellipse-outline',
};

export default function CourseSiteScreen() {
  const [filter, setFilter] = useState<Filter>('All');

  const visible = ASSIGNMENTS.filter((a) => {
    if (filter === 'Missing') return a.status === 'missing';
    if (filter === 'Submitted') return a.status === 'submitted';
    if (filter === 'Quizzes') return a.kind === 'quiz';
    return true;
  });

  const totalPoints = ASSIGNMENTS.reduce((sum, a) => sum + a.points, 0);
  const doneCount = ASSIGNMENTS.filter((a) => a.status === 'submitted').length;

  const openAssignment = (a: Assignment) => {
    Alert.alert(
      a.title,
      `${a.course}\nDue ${a.due}\n${a.points} points\nStatus: ${STATUS_LABEL[a.status]}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appName}>Course Site</Text>
      <Text style={styles.week}>Due this week · Nov 22 – Nov 28</Text>
      <Text style={styles.summary}>
        {doneCount} of {ASSIGNMENTS.length} submitted · {totalPoints} pts total
      </Text>

      <View style={styles.tabs}>
        {FILTERS.map((f) => (
          <TouchableWithoutFeedback key={f} onPress={() => setFilter(f)}>
            <View style={[styles.tab, filter === f && styles.tabActive]}>
              <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>

      {visible.map((a) => (
        <TouchableWithoutFeedback key={a.id} onPress={() => openAssignment(a)}>
          <View style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.course}>{a.course}</Text>
              <Text style={styles.points}>{a.points} pts</Text>
            </View>
            <Text style={styles.title}>{a.title}</Text>
            <Text style={styles.due}>Due {a.due}</Text>
            <View style={styles.statusRow}>
              <Ionicons name={STATUS_ICON[a.status]} size={20} color="#7a7a7a" style={{ marginTop: -5 }} />
              <Text style={styles.statusText}>{STATUS_LABEL[a.status]}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ))}

      <Text style={styles.footer}>Showing assignments from 5 courses</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfaf7',
    paddingHorizontal: 6,
  },
  appName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#8e24aa',
    marginTop: 7,
  },
  week: {
    fontSize: 15,
    fontWeight: '500',
    color: '#16a085',
  },
  summary: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b5b92',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  row: {
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e4de',
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  course: {
    fontSize: 17,
    fontWeight: '700',
    color: '#d35400',
  },
  points: {
    fontSize: 11,
    color: '#c4c4c4',
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    marginTop: 2,
  },
  due: {
    fontSize: 13,
    color: '#bdbdbd',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 3,
  },
  statusText: {
    fontSize: 12,
    color: '#7a7a7a',
    marginLeft: 5,
  },
  footer: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
});
