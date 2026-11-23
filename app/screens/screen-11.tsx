import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PrintJob = {
  id: string;
  fileName: string;
  pages: number;
  color: boolean;
  fileType: 'pdf' | 'docx';
  submitted: string;
};

type Printer = {
  id: string;
  name: string;
  detail: string;
};

const BW_RATE = 0.1;
const COLOR_RATE = 0.5;
const STARTING_BALANCE = 3.4;
const STUDENT_NAME = 'Sam Rivera';

const JOBS: PrintJob[] = [
  { id: 'j1', fileName: 'CS61A_lab07.pdf', pages: 4, color: false, fileType: 'pdf', submitted: '10:42 AM' },
  { id: 'j2', fileName: 'Data8_hw10.pdf', pages: 11, color: false, fileType: 'pdf', submitted: '10:47 AM' },
  { id: 'j3', fileName: 'ENGLISH_R1A_essay_draft.docx', pages: 6, color: true, fileType: 'docx', submitted: '11:05 AM' },
  { id: 'j4', fileName: 'resume_final_v3.pdf', pages: 1, color: false, fileType: 'pdf', submitted: '11:12 AM' },
];

const PRINTERS: Printer[] = [
  { id: 'p1', name: 'Moffitt 1st Floor', detail: '3 printers' },
  { id: 'p2', name: 'Doe North Reading Room', detail: '2 printers' },
  { id: 'p3', name: 'Kresge Engineering', detail: '2 printers' },
  { id: 'p4', name: 'MLK Student Union', detail: '1 printer' },
];

function jobCost(job: PrintJob) {
  return job.pages * (job.color ? COLOR_RATE : BW_RATE);
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function PrintCenterScreen() {
  const [jobs, setJobs] = useState<PrintJob[]>(JOBS);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [printerId, setPrinterId] = useState('p1');

  const printer = PRINTERS.find((p) => p.id === printerId) ?? PRINTERS[0];
  const totalCost = jobs.reduce((sum, job) => sum + jobCost(job), 0);

  const releaseJob = (job: PrintJob) => {
    const cost = jobCost(job);
    if (cost > balance + 0.001) {
      Alert.alert('Not enough balance', `${job.fileName} costs ${money(cost)} but you have ${money(balance)}.`);
      return;
    }
    setBalance((b) => b - cost);
    setJobs((list) => list.filter((j) => j.id !== job.id));
    Alert.alert('Released', `${job.fileName} was sent to ${printer.name}.`);
  };

  const releaseAll = () => {
    if (jobs.length === 0) return;
    if (totalCost > balance + 0.001) {
      Alert.alert('Not enough balance', `Releasing everything costs ${money(totalCost)} but you have ${money(balance)}.`);
      return;
    }
    setBalance((b) => b - totalCost);
    setJobs([]);
    Alert.alert('Released', `All jobs were sent to ${printer.name}.`);
  };

  const removeJob = (job: PrintJob) => {
    Alert.alert('Remove job?', job.fileName, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setJobs((list) => list.filter((j) => j.id !== job.id)) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Print Center</Text>
      <Text style={styles.subtitle}>Release your documents at any campus printer</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoLine}>Student: {STUDENT_NAME}</Text>
        <Text style={styles.infoLine}>Print balance: {money(balance)}</Text>
        <Text style={styles.infoLine}>Jobs waiting: {jobs.length}</Text>
        <Text style={styles.infoLine}>B&W {money(BW_RATE)}/page · Color {money(COLOR_RATE)}/page</Text>
      </View>

      <Text style={styles.sectionTitle}>Choose a printer</Text>
      {PRINTERS.map((p) => {
        const selected = p.id === printerId;
        return (
          <TouchableWithoutFeedback key={p.id} onPress={() => setPrinterId(p.id)}>
            <View style={[styles.printerRow, selected && styles.printerRowSelected]}>
              <Text style={[styles.printerName, selected && { color: '#8E24AA' }]}>{p.name}</Text>
              <Text style={styles.printerDetail}>{p.detail}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}

      <Text style={[styles.sectionTitle, { marginTop: 13, color: '#E65100' }]}>Your queue</Text>
      {jobs.map((job) => (
        <View key={job.id} style={styles.jobCard}>
          <View style={styles.jobTop}>
            <MaterialCommunityIcons
              name={job.fileType === 'pdf' ? 'file-pdf-box' : 'file-word-box'}
              size={job.fileType === 'pdf' ? 30 : 20}
              color={job.fileType === 'pdf' ? '#E53935' : '#1E88E5'}
              style={job.fileType === 'pdf' ? { marginTop: 6 } : { marginLeft: 4 }}
            />
            <View style={{ flex: 1, marginLeft: 7 }}>
              <Text style={styles.fileName} numberOfLines={1}>
                {job.fileName}
              </Text>
              <Text style={styles.jobMeta}>
                {job.pages} {job.pages === 1 ? 'page' : 'pages'} · {job.color ? 'Color' : 'B&W'} · {money(jobCost(job))}
              </Text>
              <Text style={styles.submitted}>Submitted {job.submitted}</Text>
            </View>
          </View>
          <View style={styles.jobActions}>
            <TouchableOpacity onPress={() => removeJob(job)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => releaseJob(job)}>
              <View style={styles.releaseButton}>
                <Text style={styles.releaseText}>Release</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      ))}

      {jobs.length > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total for all jobs</Text>
          <Text style={styles.totalValue}>{money(totalCost)}</Text>
        </View>
      )}

      <TouchableWithoutFeedback onPress={releaseAll}>
        <View style={styles.releaseAllButton}>
          <Text style={styles.releaseAllText}>Release All</Text>
        </View>
      </TouchableWithoutFeedback>

      <Text style={styles.footer}>Jobs are deleted from the queue after 24 hours.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#5E35B1',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#b5b5b5',
    marginBottom: 5,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 7,
    marginBottom: 4,
  },
  infoLine: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#00897B',
    marginTop: 7,
    marginBottom: 5,
  },
  printerRow: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 8,
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  printerRowSelected: {
    backgroundColor: '#F3E5F5',
  },
  printerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  printerDetail: {
    fontSize: 12,
    color: '#b5b5b5',
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 6,
  },
  jobTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  fileName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  jobMeta: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 3,
  },
  submitted: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 1,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  removeButton: {
    height: 44,
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginRight: 6,
  },
  removeText: {
    fontSize: 14,
    color: '#D81B60',
  },
  releaseButton: {
    height: 44,
    paddingHorizontal: 22,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    justifyContent: 'center',
  },
  releaseText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#b5b5b5',
  },
  totalValue: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '500',
  },
  releaseAllButton: {
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
    marginHorizontal: 3,
  },
  releaseAllText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    fontSize: 10,
    color: '#b5b5b5',
    textAlign: 'center',
    marginTop: 20,
  },
});
