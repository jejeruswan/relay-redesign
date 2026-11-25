import { type ComponentRef, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

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
  V: '#276039',
  VG: '#215972',
  GF: '#785006',
  Halal: '#723c83',
  'Contains Nuts': '#8a3549',
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
  const backdrop = useRef<ComponentRef<typeof View>>(null);
  const [hallId, setHallId] = useState<string>('crossroads');
  const [meal, setMeal] = useState<Meal>('Lunch');
  const [mealMenuOpen, setMealMenuOpen] = useState(false);

  const hall = HALLS.find((h) => h.id === hallId) ?? HALLS[0];
  const stations = hall.menu[meal];

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
          colors={['#fffdf0', '#fff4ce', '#fff9e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </BlurTargetView>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 14, paddingBottom: 40 }}
        onScrollBeginDrag={() => setMealMenuOpen(false)}
      >
        {mealMenuOpen && (
          <Pressable style={styles.backdrop} onPress={() => setMealMenuOpen(false)} accessibilityLabel="Close menu" />
        )}
        <Text style={[styles.titleTypeface, styles.appName]}>Campus Dining</Text>
        <Text style={[styles.titleTypeface, styles.subtitle]}>Today's Menu</Text>

        <View style={[styles.glass, styles.selector]}>
          {glassBlur}
          {HALLS.map((h) => (
            <TouchableOpacity
              key={h.id}
              accessibilityRole="button"
              accessibilityState={{ selected: h.id === hallId }}
              style={[styles.option, h.id === hallId && styles.selected]}
              onPress={() => {
                setHallId(h.id);
                setMealMenuOpen(false);
              }}
            >
              <Text style={[styles.titleTypeface, styles.hallLabel]}>{h.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dropdownRow}>
          <View style={styles.dropdownCol}>
            <Text style={[styles.titleTypeface, styles.dropdownLabel]}>Meal</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded: mealMenuOpen }}
              style={[styles.glass, styles.dropdownButton, mealMenuOpen && styles.dropdownButtonOpen]}
              onPress={() => setMealMenuOpen(!mealMenuOpen)}
            >
              {glassBlur}
              <Text style={[styles.titleTypeface, styles.dropdownValue]} numberOfLines={1}>{meal}</Text>
              <Ionicons name={mealMenuOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#675242" />
            </TouchableOpacity>
            {mealMenuOpen && (
              <View style={[styles.glass, styles.dropdownList]}>
                {glassBlur}
                {MEALS.map((m) => (
                  <TouchableOpacity
                    key={m}
                    accessibilityRole="button"
                    accessibilityState={{ selected: m === meal }}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setMeal(m);
                      setMealMenuOpen(false);
                    }}
                  >
                    <Text style={[styles.titleTypeface, styles.dropdownOptionText, m === meal && styles.dropdownOptionTextActive]}>{m}</Text>
                    {m === meal && <Ionicons name="checkmark" size={18} color="#c0392b" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.hallCard}>
          <Text style={[styles.titleTypeface, styles.hallName]}>{hall.name}</Text>
          <View style={styles.hoursRow}>
            <Text style={[styles.titleTypeface, styles.hours]}>{hall.hours}</Text>
            <View style={[styles.statusPill, { backgroundColor: hall.open ? '#27603922' : '#8a354922' }]}>
              <Text style={[styles.titleTypeface, styles.statusText, { color: hall.open ? '#276039' : '#8a3549' }]}>{hall.open ? 'OPEN NOW' : 'CLOSED'}</Text>
            </View>
          </View>

          {stations.length === 0 && (
            <Text style={[styles.titleTypeface, styles.emptyText]}>No {meal.toLowerCase()} served at {hall.name} today.</Text>
          )}

          {stations.map((s) => (
            <View key={s.name} style={styles.section}>
              <Text style={[styles.titleTypeface, styles.stationName]}>{s.name}</Text>
              {s.items.map((item, i) => (
                <View key={item.name} style={[styles.itemRow, i > 0 && styles.itemDivider]}>
                  <Text style={[styles.titleTypeface, styles.itemName]}>{item.name}</Text>
                  <View style={styles.tagRow}>
                    {item.tags.map((t) => (
                      <View key={t} style={[styles.tag, { backgroundColor: TAG_COLORS[t] + '1F' }]}>
                        <Text style={[styles.titleTypeface, styles.tagText, { color: TAG_COLORS[t] }]}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleTypeface: { fontWeight: '800' },
  container: {
    flex: 1,
    backgroundColor: '#fff8ec',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderColor: 'rgba(151, 106, 45, 0.23)',
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  selector: { flexDirection: 'row', alignItems: 'stretch', gap: 2, padding: 4, marginBottom: 12 },
  option: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: 'rgba(255, 199, 84, 0.34)',
    borderColor: 'rgba(151, 95, 26, 0.30)',
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
  },
  hallLabel: { fontSize: 12, color: '#492d23', textAlign: 'center' },
  appName: {
    fontSize: 36,
    letterSpacing: -0.5,
    color: '#c0392b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#675242',
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
    gap: 8,
    marginBottom: 12,
  },
  dropdownCol: {
    flex: 1,
    maxWidth: 240,
    position: 'relative',
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#675242',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    marginLeft: 2,
  },
  dropdownButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dropdownButtonOpen: {
    borderColor: '#c0392b',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    marginRight: 6,
  },
  dropdownList: {
    backgroundColor: 'rgba(255, 249, 225, 0.85)',
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderRadius: 10,
    borderWidth: 1,
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
  },
  hallName: {
    fontSize: 20,
    color: '#333',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0d6c4',
  },
  hours: {
    fontSize: 12,
    color: '#675242',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#675242',
    textAlign: 'center',
    paddingVertical: 24,
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  stationName: {
    fontSize: 13,
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
  },
});
