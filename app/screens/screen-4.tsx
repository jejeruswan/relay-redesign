import { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const HALLS: Hall[] = [
  {
    id: 'crossroads',
    name: 'Crossroads',
    hours: '7:00 AM – 9:00 PM',
    open: true,
    menu: {
      Breakfast: [
        { name: 'Hot Breakfast', items: [{ name: 'Buttermilk Pancakes', tags: ['V'] }, { name: 'Turkey Sausage', tags: ['GF'] }, { name: 'Scrambled Eggs', tags: ['V', 'GF'] }] },
        { name: 'Plant-Based', items: [{ name: 'Tofu Scramble', tags: ['VG', 'GF'] }, { name: 'Breakfast Potatoes', tags: ['VG', 'GF'] }] },
      ],
      Lunch: [
        { name: 'Burgers', items: [{ name: 'Cheeseburger', tags: ['Halal'] }, { name: 'Beyond Burger', tags: ['VG'] }, { name: 'Seasoned Fries', tags: ['VG', 'GF'] }] },
        { name: 'International', items: [{ name: 'Chicken Tikka Masala', tags: ['Halal', 'GF'] }, { name: 'Chana Masala', tags: ['VG', 'GF'] }, { name: 'Basmati Rice', tags: ['VG', 'GF'] }] },
        { name: 'Salads', items: [{ name: 'Kale Caesar', tags: ['V'] }, { name: 'Thai Peanut Noodle Salad', tags: ['VG', 'Contains Nuts'] }] },
      ],
      Dinner: [
        { name: 'International', items: [{ name: 'Beef Bulgogi', tags: ['GF'] }, { name: 'Vegetable Japchae', tags: ['VG'] }] },
        { name: 'Entrées', items: [{ name: 'Herb Roasted Chicken', tags: ['GF', 'Halal'] }, { name: 'Steamed Broccoli', tags: ['VG', 'GF'] }] },
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
        { name: 'Hot Breakfast', items: [{ name: 'French Toast', tags: ['V'] }, { name: 'Hash Browns', tags: ['VG', 'GF'] }] },
      ],
      Lunch: [
        { name: 'International', items: [{ name: 'Pad See Ew', tags: ['V'] }, { name: 'Satay Chicken', tags: ['Halal', 'Contains Nuts'] }] },
        { name: 'Salads', items: [{ name: 'Greek Salad', tags: ['V', 'GF'] }, { name: 'Quinoa Bowl', tags: ['VG', 'GF'] }] },
      ],
      Dinner: [
        { name: 'Entrées', items: [{ name: 'BBQ Pulled Pork', tags: ['GF'] }, { name: 'Mac and Cheese', tags: ['V'] }] },
        { name: 'International', items: [{ name: 'Falafel Plate', tags: ['VG', 'Halal'] }, { name: 'Baklava', tags: ['V', 'Contains Nuts'] }] },
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
        { name: 'Hot Breakfast', items: [{ name: 'Belgian Waffles', tags: ['V'] }, { name: 'Bacon', tags: ['GF'] }] },
      ],
      Lunch: [
        { name: 'Entrées', items: [{ name: 'Carnitas Tacos', tags: ['GF'] }, { name: 'Black Bean Tacos', tags: ['VG', 'GF'] }] },
      ],
      Dinner: [
        { name: 'Entrées', items: [{ name: 'Salmon Fillet', tags: ['GF'] }, { name: 'Wild Rice Pilaf', tags: ['VG', 'GF'] }] },
        { name: 'Salads', items: [{ name: 'Spinach & Walnut Salad', tags: ['V', 'GF', 'Contains Nuts'] }] },
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
        { name: 'Hot Breakfast', items: [{ name: 'Breakfast Burrito', tags: ['Halal'] }, { name: 'Oatmeal Bar', tags: ['VG', 'Contains Nuts'] }] },
      ],
      Lunch: [
        { name: 'Entrées', items: [{ name: 'Lemon Herb Chicken', tags: ['GF', 'Halal'] }, { name: 'Roasted Vegetables', tags: ['VG', 'GF'] }] },
        { name: 'Soups', items: [{ name: 'Vegetable Pho', tags: ['VG'] }] },
      ],
      Dinner: [],
    },
  },
];

// One accent (burnt orange) for selection and warnings; everything else neutral.
// Green is kept only as the "open now" signal.
const ACCENT = '#C2410C';
const ACCENT_SOFT = '#FDEEE6';
const OPEN = '#2F7D4F';
const INK = '#1C1917';
const BODY = '#44403C';
const MUTED = '#78716C';
const LINE = '#ECE8E3';
const TRACK = '#EEEAE5';
const SURFACE = '#FFFFFF';
const BG = '#F7F5F2';

function DietIcon({ tag }: { tag: 'VG' | 'GF' }) {
  return tag === 'VG' ? (
    <Ionicons name="leaf" size={14} color={BODY} />
  ) : (
    <MaterialCommunityIcons name="barley-off" size={15} color={BODY} />
  );
}

export default function CampusDiningScreen() {
  const [hallId, setHallId] = useState<string>('crossroads');
  const [meal, setMeal] = useState<Meal>('Lunch');
  const [mealMenuOpen, setMealMenuOpen] = useState(false);

  const hall = HALLS.find((h) => h.id === hallId) ?? HALLS[0];
  const stations = hall.menu[meal];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        onScrollBeginDrag={() => setMealMenuOpen(false)}
      >
        {mealMenuOpen && (
          <Pressable style={styles.backdrop} onPress={() => setMealMenuOpen(false)} accessibilityLabel="Close menu" />
        )}
        <Text style={styles.appName}>Campus Dining</Text>
        <Text style={styles.subtitle}>Today's menu</Text>

        <View style={styles.selector}>
          {HALLS.map((h) => {
            const active = h.id === hallId;
            return (
              <TouchableOpacity
                key={h.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.option, active && styles.selected]}
                onPress={() => {
                  setHallId(h.id);
                  setMealMenuOpen(false);
                }}
              >
                <Text
                  style={[styles.hallLabel, active && styles.hallLabelActive]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {h.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dropdownRow}>
          <View style={styles.dropdownCol}>
            <Text style={styles.dropdownLabel}>Meal</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ expanded: mealMenuOpen }}
              style={[styles.dropdownButton, mealMenuOpen && styles.dropdownButtonOpen]}
              onPress={() => setMealMenuOpen(!mealMenuOpen)}
            >
              <Text style={styles.dropdownValue} numberOfLines={1}>{meal}</Text>
              <Ionicons name={mealMenuOpen ? 'chevron-up' : 'chevron-down'} size={18} color={MUTED} />
            </TouchableOpacity>
            {mealMenuOpen && (
              <View style={styles.dropdownList}>
                {MEALS.map((m, i) => (
                  <TouchableOpacity
                    key={m}
                    accessibilityRole="button"
                    accessibilityState={{ selected: m === meal }}
                    style={[styles.dropdownOption, i > 0 && styles.itemDivider]}
                    onPress={() => {
                      setMeal(m);
                      setMealMenuOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownOptionText, m === meal && styles.dropdownOptionTextActive]}>{m}</Text>
                    {m === meal && <Ionicons name="checkmark" size={18} color={ACCENT} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.hallCard}>
          <View style={styles.hallHeader}>
            <Text style={styles.hallName}>{hall.name}</Text>
            <View style={styles.status}>
              <View style={[styles.statusDot, { backgroundColor: hall.open ? OPEN : MUTED }]} />
              <Text style={[styles.statusText, { color: hall.open ? OPEN : MUTED }]}>
                {hall.open ? 'Open now' : 'Closed'}
              </Text>
            </View>
          </View>
          <View style={styles.hoursRow}>
            <Ionicons name="time-outline" size={14} color={MUTED} />
            <Text style={styles.hours}>{hall.hours}</Text>
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
                    {item.tags.map((t) => {
                      if (t === 'VG' || t === 'GF') {
                        return (
                          <View
                            key={t}
                            style={[styles.tag, styles.tagIcon]}
                            accessible
                            accessibilityLabel={t === 'VG' ? 'Vegan' : 'Gluten-free'}
                          >
                            <DietIcon tag={t} />
                          </View>
                        );
                      }
                      const warn = t === 'Contains Nuts';
                      return (
                        <View key={t} style={[styles.tag, warn && styles.tagWarn]}>
                          {warn && <Ionicons name="alert-circle" size={12} color={ACCENT} />}
                          <Text style={[styles.tagText, warn && styles.tagTextWarn]}>{t}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          ))}

          {stations.length > 0 && (
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <DietIcon tag="VG" />
                <Text style={styles.legendText}>Vegan</Text>
              </View>
              <View style={styles.legendItem}>
                <DietIcon tag="GF" />
                <Text style={styles.legendText}>Gluten-free</Text>
              </View>
              <View style={styles.legendItem}>
                <Text style={styles.legendKey}>V</Text>
                <Text style={styles.legendText}>Vegetarian</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: INK,
  },
  subtitle: {
    fontSize: 16,
    color: MUTED,
    marginTop: 4,
    marginBottom: 20,
  },
  selector: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: TRACK,
  },
  option: {
    flexGrow: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: SURFACE,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  hallLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
    textAlign: 'center',
  },
  hallLabelActive: {
    fontWeight: '600',
    color: INK,
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
    marginBottom: 16,
  },
  dropdownCol: {
    minWidth: 160,
    position: 'relative',
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  dropdownButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LINE,
    backgroundColor: SURFACE,
  },
  dropdownButtonOpen: {
    borderColor: ACCENT,
  },
  dropdownValue: {
    fontSize: 16,
    fontWeight: '500',
    color: INK,
  },
  dropdownList: {
    backgroundColor: SURFACE,
    marginTop: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  dropdownOption: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: BODY,
  },
  dropdownOptionTextActive: {
    fontWeight: '600',
    color: ACCENT,
  },
  hallCard: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  hallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  hallName: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: INK,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LINE,
  },
  hours: {
    fontSize: 14,
    color: MUTED,
  },
  emptyText: {
    fontSize: 15,
    color: MUTED,
    textAlign: 'center',
    paddingVertical: 24,
  },
  section: {
    marginTop: 20,
    marginBottom: 4,
  },
  stationName: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: 8,
  },
  itemDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LINE,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: INK,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: BG,
  },
  tagWarn: {
    backgroundColor: ACCENT_SOFT,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: BODY,
  },
  tagTextWarn: {
    fontWeight: '600',
    color: ACCENT,
  },
  tagIcon: {
    minWidth: 28,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LINE,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendKey: {
    fontSize: 12,
    fontWeight: '600',
    color: BODY,
  },
  legendText: {
    fontSize: 12,
    color: MUTED,
  },
});
