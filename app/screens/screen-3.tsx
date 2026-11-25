import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Status = 'submitted' | 'missing' | 'notyet';
type Kind = 'homework' | 'lab' | 'project' | 'essay' | 'quiz';
type Course = 'EECS 16A' | 'ENGLISH R1A' | 'Data 8' | 'CS 61A' | 'MATH 1B';
type Filter = 'All' | 'Missing' | 'Submitted' | 'Quizzes';

type Assignment = {
  id: string;
  title: string;
  course: Course;
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

// Spacing scale: use only these values for margins, padding and gaps.
const SPACE = { xs: 4, sm: 8, md: 16, lg: 24 } as const;

const FILTERS: Filter[] = ['All', 'Missing', 'Submitted', 'Quizzes'];

const COURSE_COLORS: Record<Course, string> = {
  'EECS 16A': '#215a9a',
  'ENGLISH R1A': '#834081',
  'Data 8': '#12696a',
  'CS 61A': '#934016',
  'MATH 1B': '#5144a7',
};

const FILTER_COLORS: Record<Filter, string> = {
  All: '#424d71',
  Missing: '#a22639',
  Submitted: '#226640',
  Quizzes: '#795604',
};

const STATUS_COLORS: Record<Status, string> = {
  missing: FILTER_COLORS.Missing,
  submitted: FILTER_COLORS.Submitted,
  notyet: FILTER_COLORS.All,
};

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

const MINUTE = 60_000;

function dueTime({ due }: Assignment) {
  const match = /Nov (\d+), (\d+):(\d+) (AM|PM)/.exec(due);
  if (!match) return Infinity;
  const [, day, hour, minute, period] = match;
  return new Date(2026, 10, Number(day), Number(hour) % 12 + (period === 'PM' ? 12 : 0), Number(minute)).getTime();
}

function urgency(assignment: Assignment, now: number) {
  if (assignment.status === 'submitted') return 2;
  if (assignment.status === 'missing' || dueTime(assignment) <= now) return 0;
  return 1;
}

function countdown(deadline: number, now: number) {
  if (deadline === Infinity) return 'Deadline unavailable';
  if (deadline <= now) return 'Past due';
  const minutes = Math.ceil((deadline - now) / MINUTE);
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d ${Math.floor(minutes % 1440 / 60)}h left`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m left`;
  return `${minutes}m left`;
}

export default function CourseSiteScreen() {
  const backdrop = useRef<ComponentRef<typeof View>>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);

  const visible = ASSIGNMENTS.filter((a) => {
    if (filter === 'Missing') return a.status === 'missing';
    if (filter === 'Submitted') return a.status === 'submitted';
    if (filter === 'Quizzes') return a.kind === 'quiz';
    return true;
  }).sort((a, b) => urgency(a, now) - urgency(b, now) || dueTime(a) - dueTime(b));

  const totalPoints = ASSIGNMENTS.reduce((sum, a) => sum + a.points, 0);
  const doneCount = ASSIGNMENTS.filter((a) => a.status === 'submitted').length;

  const openAssignment = (a: Assignment) => {
    Alert.alert(
      a.title,
      `${a.course}\nDue ${a.due}\n${a.points} points\nStatus: ${STATUS_LABEL[a.status]}`
    );
  };

  const glassBlur = (
    <BlurView
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      blurTarget={backdrop}
      blurMethod="dimezisBlurViewSdk31Plus"
      tint="systemUltraThinMaterialLight"
      intensity={28}
    />
  );

  return (
    <View style={styles.container}>
      <BlurTargetView ref={backdrop} pointerEvents="none" style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#fff', '#f8faff', '#fff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurTargetView>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.glass, styles.overview]}>
          {glassBlur}
          <Text style={styles.appName}>Course Site</Text>
          <Text style={styles.week}>Due this week · Nov 22 – Nov 28</Text>
          <Text style={styles.summary}>
            {doneCount} of {ASSIGNMENTS.length} submitted · {totalPoints} pts total
          </Text>
        </View>

        <View style={[styles.glass, styles.tabs]}>
          {glassBlur}
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === f }}
              onPress={() => setFilter(f)}
              style={({ pressed }) => [
                styles.tab,
                {
                  backgroundColor: f === 'Quizzes'
                    ? (filter === f ? '#e9b91465' : '#e9b91432')
                    : FILTER_COLORS[f] + (filter === f ? '30' : '12'),
                  borderColor: FILTER_COLORS[f] + (filter === f ? '80' : '26'),
                },
                filter === f && styles.tabActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tabText, filter === f && styles.tabTextActive, { color: FILTER_COLORS[f] }]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {visible.length === 0 && (
          <View style={[styles.glass, styles.row]}>
            {glassBlur}
            <Text style={styles.title}>No quizzes due this week</Text>
          </View>
        )}

        {visible.map((a) => (
          <Pressable
            key={a.id}
            accessibilityRole="button"
            onPress={() => openAssignment(a)}
            style={({ pressed }) => [styles.glass, styles.row, styles.cardShadow, pressed && styles.pressed]}
          >
            {glassBlur}
            <View style={styles.rowTop}>
              <View style={styles.course}>
                <Text style={[
                  styles.pill,
                  styles.courseLabel,
                  {
                    color: COURSE_COLORS[a.course],
                    backgroundColor: COURSE_COLORS[a.course] + '15',
                    borderColor: COURSE_COLORS[a.course] + '38',
                  },
                ]}>{a.course}</Text>
              </View>
              <Text style={[styles.pill, styles.points]}>{a.points} pts</Text>
            </View>
            <Text style={styles.title}>{a.title}</Text>
            <Text style={styles.due}>Due {a.due}</Text>
            <View style={[
              styles.pill,
              styles.statusRow,
              {
                backgroundColor: STATUS_COLORS[a.status] + '15',
                borderColor: STATUS_COLORS[a.status] + '38',
              },
            ]}>
              <Ionicons
                name={STATUS_ICON[a.status]}
                size={16}
                color={STATUS_COLORS[a.status]}
              />
              <Text style={[styles.statusText, { color: STATUS_COLORS[a.status] }]}>{STATUS_LABEL[a.status]}</Text>
            </View>
            {a.status !== 'submitted' && (
              <Text style={[styles.statusText, urgency(a, now) === 0 && styles.urgent]}>
                {countdown(dueTime(a), now)}
              </Text>
            )}
          </Pressable>
        ))}

        <Text style={styles.footer}>Showing assignments from 5 courses</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: SPACE.md, paddingBottom: SPACE.lg, gap: SPACE.sm },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(77, 91, 140, 0.24)',
    borderTopColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  overview: { padding: SPACE.lg, gap: SPACE.xs },
  appName: { fontSize: 26, fontWeight: '800', color: '#232748' },
  cardShadow: { boxShadow: '0px 3px 9px rgba(35, 39, 72, 0.17)' },
  urgent: { color: FILTER_COLORS.Missing },
  week: { fontSize: 15, fontWeight: '600', color: '#374466' },
  summary: { fontSize: 13, color: '#465475' },
  tabs: { flexDirection: 'row', padding: SPACE.xs, gap: SPACE.xs },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 16,
  },
  tabActive: {
    borderTopColor: 'rgba(255, 255, 255, 0.92)',
  },
  tabText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  tabTextActive: { fontWeight: '800' },
  pressed: { opacity: 0.78 },
  row: { padding: SPACE.md, gap: SPACE.xs, borderRadius: 20 },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACE.sm },
  course: { flex: 1, alignItems: 'flex-start' },
  courseLabel: { fontSize: 12, fontWeight: '700' },
  pill: {
    backgroundColor: 'rgba(126, 143, 196, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(87, 105, 163, 0.22)',
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs,
    borderRadius: 16,
  },
  points: { fontSize: 12, fontWeight: '600', color: '#374466' },
  title: { fontSize: 17, fontWeight: '700', color: '#232748' },
  due: { fontSize: 13, color: '#465475' },
  statusRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: SPACE.xs, marginTop: SPACE.xs },
  statusText: { fontSize: 12, fontWeight: '600' },
  footer: { fontSize: 12, color: '#465475', textAlign: 'center', marginTop: SPACE.sm },
});
