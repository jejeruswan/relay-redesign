import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Meal = 'Breakfast' | 'Lunch' | 'Dinner';
type Tag = 'V' | 'VG' | 'GF' | 'Halal' | 'Contains Nuts';

type MenuItem = { name: string; tags: Tag[] };
type Station = { name: string; items: MenuItem[] };

type Hall = {
  id: string;
  name: string;
  hours: string;
  open: boolean;
  menu: Record<Meal, Station[]>;
};

const MEALS: Meal[] = ['Breakfast', 'Lunch', 'Dinner'];

const TAG_COLORS: Record<Tag, string> = {
  V: '#00b84d',
  VG: '#00a3cc',
  GF: '#ff9500',
  Halal: '#8e24aa',
  'Contains Nuts': '#e6007e',
};

const HALLS: Hall[] = [
  {
    id: 'crossroads',
    name: 'Crossroads',
    hours: '7:00 AM – 9:00 PM',
    open: true,
    menu: {
      Breakfast: [
        { name: 'Grill', items: [{ name: 'Buttermilk Pancakes', tags: ['V'] }, { name: 'Turkey Sausage', tags: ['GF'] }, { name: 'Scrambled Eggs', tags: ['V', 'GF'] }] },
        { name: 'Bear Necessities', items: [{ name: 'Tofu Scramble', tags: ['VG', 'GF'] }, { name: 'Breakfast Potatoes', tags: ['VG', 'GF'] }] },
      ],
      Lunch: [
        { name: 'Grill', items: [{ name: 'Cheeseburger', tags: ['Halal'] }, { name: 'Beyond Burger', tags: ['VG'] }, { name: 'Seasoned Fries', tags: ['VG', 'GF'] }] },
        { name: 'Global', items: [{ name: 'Chicken Tikka Masala', tags: ['Halal', 'GF'] }, { name: 'Chana Masala', tags: ['VG', 'GF'] }, { name: 'Basmati Rice', tags: ['VG', 'GF'] }] },
        { name: 'Salad Bar', items: [{ name: 'Kale Caesar', tags: ['V'] }, { name: 'Thai Peanut Noodle Salad', tags: ['VG', 'Contains Nuts'] }] },
      ],
      Dinner: [
        { name: 'Global', items: [{ name: 'Beef Bulgogi', tags: ['GF'] }, { name: 'Vegetable Japchae', tags: ['VG'] }] },
        { name: 'Bear Necessities', items: [{ name: 'Herb Roasted Chicken', tags: ['GF', 'Halal'] }, { name: 'Steamed Broccoli', tags: ['VG', 'GF'] }] },
      ],
    },
  },
  {
    id: 'cafe3',
    name: 'Cafe 3',
    hours: '7:30 AM – 8:00 PM',
    open: true,
    menu: {
      Breakfast: [
        { name: 'Grill', items: [{ name: 'French Toast', tags: ['V'] }, { name: 'Hash Browns', tags: ['VG', 'GF'] }] },
      ],
      Lunch: [
        { name: 'Global', items: [{ name: 'Pad See Ew', tags: ['V'] }, { name: 'Satay Chicken', tags: ['Halal', 'Contains Nuts'] }] },
        { name: 'Salad Bar', items: [{ name: 'Greek Salad', tags: ['V', 'GF'] }, { name: 'Quinoa Bowl', tags: ['VG', 'GF'] }] },
      ],
      Dinner: [
        { name: 'Grill', items: [{ name: 'BBQ Pulled Pork', tags: ['GF'] }, { name: 'Mac and Cheese', tags: ['V'] }] },
        { name: 'Global', items: [{ name: 'Falafel Plate', tags: ['VG', 'Halal'] }, { name: 'Baklava', tags: ['V', 'Contains Nuts'] }] },
      ],
    },
  },
  {
    id: 'clarkkerr',
    name: 'Clark Kerr',
    hours: '8:00 AM – 7:30 PM',
    open: false,
    menu: {
      Breakfast: [
        { name: 'Grill', items: [{ name: 'Belgian Waffles', tags: ['V'] }, { name: 'Bacon', tags: ['GF'] }] },
      ],
      Lunch: [
        { name: 'Global', items: [{ name: 'Carnitas Tacos', tags: ['GF'] }, { name: 'Black Bean Tacos', tags: ['VG', 'GF'] }] },
      ],
      Dinner: [
        { name: 'Grill', items: [{ name: 'Salmon Fillet', tags: ['GF'] }, { name: 'Wild Rice Pilaf', tags: ['VG', 'GF'] }] },
        { name: 'Salad Bar', items: [{ name: 'Spinach & Walnut Salad', tags: ['V', 'GF', 'Contains Nuts'] }] },
      ],
    },
  },
  {
    id: 'foothill',
    name: 'Foothill',
    hours: '7:00 AM – 2:00 PM',
    open: true,
    menu: {
      Breakfast: [
        { name: 'Grill', items: [{ name: 'Breakfast Burrito', tags: ['Halal'] }, { name: 'Oatmeal Bar', tags: ['VG', 'Contains Nuts'] }] },
      ],
      Lunch: [
        { name: 'Bear Necessities', items: [{ name: 'Lemon Herb Chicken', tags: ['GF', 'Halal'] }, { name: 'Roasted Vegetables', tags: ['VG', 'GF'] }] },
        { name: 'Global', items: [{ name: 'Vegetable Pho', tags: ['VG'] }] },
      ],
      Dinner: [],
    },
  },
];

export default function CampusDiningScreen() {
  const [hallId, setHallId] = useState<string>('crossroads');
  const [meal, setMeal] = useState<Meal>('Lunch');

  const hall = HALLS.find((h) => h.id === hallId) ?? HALLS[0];
  const stations = hall.menu[meal];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 14, paddingBottom: 40 }}>
      <Text style={styles.appName}>Campus Dining</Text>
      <Text style={styles.subtitle}>Today's Menu</Text>

      <View style={styles.hallList}>
        {HALLS.map((h) => (
          <TouchableOpacity
            key={h.id}
            style={[styles.hallChip, h.id === hallId && styles.hallChipActive]}
            onPress={() => setHallId(h.id)}
          >
            <Text style={[styles.hallChipText, h.id === hallId && { color: '#fff' }]}>{h.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.mealTabs}>
        {MEALS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.mealTab, m === meal && styles.mealTabActive]}
            onPress={() => setMeal(m)}
          >
            <Text style={[styles.mealTabText, m === meal && { color: '#fff' }]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.hallCard}>
        <Text style={styles.hallName}>{hall.name}</Text>
        <Text style={styles.hours}>{hall.hours}</Text>
        <View style={[styles.statusPill, { backgroundColor: hall.open ? '#00e600' : '#ff1a1a' }]}>
          <Text style={styles.statusText}>{hall.open ? 'OPEN NOW' : 'CLOSED'}</Text>
        </View>

        {stations.map((s) => (
          <View key={s.name} style={styles.stationCard}>
            <Text style={styles.stationName}>{s.name}</Text>
            {s.items.map((item) => (
              <View key={item.name} style={styles.itemBox}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.tagRow}>
                  {item.tags.map((t) => (
                    <View key={t} style={[styles.tag, { backgroundColor: TAG_COLORS[t] }]}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8ec',
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#c0392b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '300',
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  hallList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  hallChip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0a500',
    margin: 4,
  },
  hallChipActive: {
    backgroundColor: '#f0a500',
  },
  hallChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b37700',
  },
  mealTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  mealTab: {
    height: 28,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginHorizontal: 3,
    borderRadius: 4,
  },
  mealTabActive: {
    backgroundColor: '#007AFF',
  },
  mealTabText: {
    fontSize: 13,
    color: '#007AFF',
  },
  hallCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e0d6c4',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  hallName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  hours: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  stationCard: {
    width: '100%',
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d35400',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#222',
    textAlign: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    margin: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
