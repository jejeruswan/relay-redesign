import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [openMenu, setOpenMenu] = useState<'hall' | 'meal' | null>(null);

  const hall = HALLS.find((h) => h.id === hallId) ?? HALLS[0];
  const stations = hall.menu[meal];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, padding: 14, paddingBottom: 40 }}
      onScrollBeginDrag={() => setOpenMenu(null)}
    >
      {openMenu !== null && (
        <Pressable style={styles.backdrop} onPress={() => setOpenMenu(null)} accessibilityLabel="Close menu" />
      )}
      <Text style={styles.appName}>Campus Dining</Text>
      <Text style={styles.subtitle}>Today's Menu</Text>

      <View style={styles.dropdownRow}>
        <View style={styles.dropdownCol}>
          <Text style={styles.dropdownLabel}>Dining hall</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, openMenu === 'hall' && styles.dropdownButtonOpen]}
            onPress={() => setOpenMenu(openMenu === 'hall' ? null : 'hall')}
          >
            <Text style={styles.dropdownValue} numberOfLines={1}>{hall.name}</Text>
            <Ionicons name={openMenu === 'hall' ? 'chevron-up' : 'chevron-down'} size={18} color="#8a7f70" />
          </TouchableOpacity>
          {openMenu === 'hall' && (
            <View style={styles.dropdownList}>
              {HALLS.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setHallId(h.id);
                    setOpenMenu(null);
                  }}
                >
                  <Text style={[styles.dropdownOptionText, h.id === hallId && styles.dropdownOptionTextActive]}>
                    {h.name}
                  </Text>
                  {h.id === hallId && <Ionicons name="checkmark" size={18} color="#c0392b" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.dropdownCol}>
          <Text style={styles.dropdownLabel}>Meal</Text>
          <TouchableOpacity
            style={[styles.dropdownButton, openMenu === 'meal' && styles.dropdownButtonOpen]}
            onPress={() => setOpenMenu(openMenu === 'meal' ? null : 'meal')}
          >
            <Text style={styles.dropdownValue} numberOfLines={1}>{meal}</Text>
            <Ionicons name={openMenu === 'meal' ? 'chevron-up' : 'chevron-down'} size={18} color="#8a7f70" />
          </TouchableOpacity>
          {openMenu === 'meal' && (
            <View style={styles.dropdownList}>
              {MEALS.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setMeal(m);
                    setOpenMenu(null);
                  }}
                >
                  <Text style={[styles.dropdownOptionText, m === meal && styles.dropdownOptionTextActive]}>{m}</Text>
                  {m === meal && <Ionicons name="checkmark" size={18} color="#c0392b" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.hallCard}>
        <Text style={styles.hallName}>{hall.name}</Text>
        <View style={styles.hoursRow}>
          <Text style={styles.hours}>{hall.hours}</Text>
          <View style={[styles.statusPill, { backgroundColor: hall.open ? '#00e600' : '#ff1a1a' }]}>
            <Text style={styles.statusText}>{hall.open ? 'OPEN NOW' : 'CLOSED'}</Text>
          </View>
        </View>

        {stations.length === 0 && (
          <Text style={styles.emptyText}>No {meal.toLowerCase()} served at {hall.name} today.</Text>
        )}

        {stations.map((s) => (
          <View key={s.name} style={styles.section}>
            <Text style={styles.stationName}>{s.name}</Text>
            {s.items.map((item, i) => (
              <View key={item.name} style={[styles.itemRow, i > 0 && styles.itemDivider]}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.tagRow}>
                  {item.tags.map((t) => (
                    <View key={t} style={[styles.tag, { backgroundColor: TAG_COLORS[t] + '1F' }]}>
                      <Text style={[styles.tagText, { color: TAG_COLORS[t] }]}>{t}</Text>
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
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#c0392b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8a7f70',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    elevation: 5,
  },
  dropdownRow: {
    zIndex: 10,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
  },
  dropdownCol: {
    flex: 1,
    position: 'relative',
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8a7f70',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 2,
  },
  dropdownButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d6c4',
  },
  dropdownButtonOpen: {
    borderColor: '#c0392b',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginRight: 6,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0d6c4',
    overflow: 'hidden',
  },
  dropdownOption: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#444',
  },
  dropdownOptionTextActive: {
    fontWeight: '700',
    color: '#c0392b',
  },
  hallCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0d6c4',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  hallName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0d6c4',
  },
  hours: {
    fontSize: 12,
    color: '#888',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#8a7f70',
    textAlign: 'center',
    paddingVertical: 24,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  stationName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#d35400',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: 8,
  },
  itemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee5d6',
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginRight: 8,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 4,
    maxWidth: '50%',
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
