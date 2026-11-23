import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ClassGrade = {
  code: string;
  title: string;
  units: number;
  grade: string | null;
};

type TermSummary = {
  semesterGpa: number;
  cumulativeGpa: number;
  unitsPassed: number;
};

type Term = {
  id: string;
  label: string;
  summary: TermSummary | null;
  classes: ClassGrade[];
};

const STUDENT = {
  name: 'Jordan Lee',
  sid: '3039 481 226',
  major: 'Data Science, Intended',
};

const TERMS: Term[] = [
  {
    id: 'fa26',
    label: 'Fall 2026',
    summary: { semesterGpa: 3.41, cumulativeGpa: 3.52, unitsPassed: 16 },
    classes: [
      { code: 'CS 61A', title: 'Structure and Interpretation of Computer Programs', units: 4, grade: 'A-' },
      { code: 'DATA 8', title: 'Foundations of Data Science', units: 4, grade: 'B+' },
      { code: 'MATH 1A', title: 'Calculus', units: 4, grade: 'B' },
      { code: 'ENGLISH R1A', title: 'Reading and Composition', units: 4, grade: 'A' },
      { code: 'EECS 16A', title: 'Designing Information Devices and Systems I', units: 4, grade: null },
    ],
  },
  {
    id: 'sp26',
    label: 'Spring 2026',
    summary: { semesterGpa: 3.58, cumulativeGpa: 3.59, unitsPassed: 14 },
    classes: [
      { code: 'ECON 1', title: 'Introduction to Economics', units: 4, grade: 'A-' },
      { code: 'STAT 20', title: 'Introduction to Probability and Statistics', units: 4, grade: 'B+' },
      { code: 'HISTORY 7B', title: 'The United States from Civil War to Present', units: 4, grade: 'A' },
      { code: 'ART 8', title: 'Introduction to Visual Thinking', units: 2, grade: 'P' },
    ],
  },
  {
    id: 'fa25',
    label: 'Fall 2025',
    summary: { semesterGpa: 3.6, cumulativeGpa: 3.6, unitsPassed: 13 },
    classes: [
      { code: 'PSYCH 1', title: 'General Psychology', units: 3, grade: 'B+' },
      { code: 'MATH 32', title: 'Precalculus', units: 4, grade: 'C+' },
      { code: 'ASTRON C10', title: 'Introductory General Astronomy', units: 4, grade: 'A' },
      { code: 'L&S 1', title: 'Exploring the Liberal Arts', units: 2, grade: 'P' },
    ],
  },
  {
    id: 'su26',
    label: 'Summer 2026',
    summary: null,
    classes: [],
  },
];

function gradeColor(grade: string | null) {
  if (!grade) return '#E91E63';
  if (grade.startsWith('A')) return '#1DB954';
  if (grade.startsWith('B')) return '#2962FF';
  if (grade.startsWith('C')) return '#FF8F00';
  if (grade === 'P') return '#AA00FF';
  return '#D50000';
}

export default function GradesScreen() {
  const [selectedId, setSelectedId] = useState(TERMS[0].id);
  const term = TERMS.find((t) => t.id === selectedId) ?? TERMS[0];

  const requestTranscript = () => {
    Alert.alert('Unofficial transcript', 'Your unofficial transcript will be emailed to you within a few minutes.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.portalName}>Student Portal</Text>
        <Text style={styles.pageTitle}>Grades & GPA</Text>
        <Text style={styles.studentName}>{STUDENT.name}</Text>
        <Text style={styles.studentMeta}>SID {STUDENT.sid} · {STUDENT.major}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {TERMS.map((t) => {
          const active = t.id === selectedId;
          return (
            <Pressable
              key={t.id}
              onPress={() => setSelectedId(t.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {term.summary && (
        <View>
          <View style={styles.gpaRow}>
            <View style={styles.gpaBox}>
              <Text style={styles.gpaLabel}>Semester GPA</Text>
              <Text style={styles.gpaValue}>{term.summary.semesterGpa.toFixed(2)}</Text>
            </View>
            <View style={styles.gpaBox}>
              <Text style={styles.gpaLabel}>Cumulative GPA</Text>
              <Text style={styles.gpaValue}>{term.summary.cumulativeGpa.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={styles.unitsPassed}>Units passed this term: {term.summary.unitsPassed}</Text>

          <Text style={styles.sectionTitle}>Class Grades</Text>
          {term.classes.map((c) => (
            <View key={c.code} style={styles.classRow}>
              <Text style={styles.classCode}>{c.code}</Text>
              <Text style={styles.classTitle}>{c.title}</Text>
              {c.grade ? (
                <Text style={[styles.grade, { color: gradeColor(c.grade) }]}>{c.grade}</Text>
              ) : (
                <Text style={[styles.pending, { color: gradeColor(null) }]}>Grade not yet posted</Text>
              )}
              <Text style={styles.units}>{c.units} units</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.transcriptButton} onPress={requestTranscript}>
        <Ionicons name="document-text-outline" size={18} color="#fff" />
        <Text style={styles.transcriptText}>Request unofficial transcript</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 14 }}>
        Grades are posted by instructors and may take up to 10 days after finals.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  portalName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#00A3A3',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#1A237E',
    marginTop: 4,
    textAlign: 'center',
  },
  studentName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  studentMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
  chipRow: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: '#ECECF2',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#FFC400',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  chipTextActive: {
    color: '#222',
    fontWeight: '700',
  },
  gpaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  gpaBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gpaLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  gpaValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
  unitsPassed: {
    fontSize: 15,
    color: '#b5b5b5',
    textAlign: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6200EA',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  classRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  classCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  classTitle: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginTop: 2,
  },
  grade: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  pending: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 6,
  },
  units: {
    fontSize: 11,
    color: '#b0b0b0',
    marginTop: 4,
  },
  transcriptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3D00',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  transcriptText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
