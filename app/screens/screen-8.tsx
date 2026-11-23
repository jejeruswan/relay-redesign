import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Listing = {
  id: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  distance: number;
};

type FilterId = 'under1200' | 'under2000' | 'oneBed' | 'twoBeds' | 'studio';

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'under1200', label: 'Under $1,200' },
  { id: 'under2000', label: 'Under $2,000' },
  { id: 'oneBed', label: '1+ bed' },
  { id: 'twoBeds', label: '2+ beds' },
  { id: 'studio', label: 'Studio' },
];

const LISTINGS: Listing[] = [
  { id: 'l1', address: '2400 Durant Ave #304', neighborhood: 'Southside', price: 1850, beds: 1, baths: 1, distance: 0.3 },
  { id: 'l2', address: '2615 Hearst Ave #2', neighborhood: 'Northside', price: 1495, beds: 0, baths: 1, distance: 0.4 },
  { id: 'l3', address: '2918 College Ave', neighborhood: 'Elmwood', price: 3200, beds: 2, baths: 1, distance: 1.2 },
  { id: 'l4', address: '1820 Euclid Ave #5', neighborhood: 'Northside', price: 3650, beds: 2, baths: 2, distance: 0.5 },
  { id: 'l5', address: '2516 Regent St #11', neighborhood: 'Southside', price: 1395, beds: 0, baths: 1, distance: 0.6 },
  { id: 'l6', address: '2700 Channing Way', neighborhood: 'Southside', price: 4350, beds: 3, baths: 2, distance: 0.5 },
  { id: 'l7', address: '1940 Berkeley Way #208', neighborhood: 'Downtown', price: 2150, beds: 1, baths: 1, distance: 0.7 },
  { id: 'l8', address: '2985 Russell St', neighborhood: 'Elmwood', price: 1950, beds: 1, baths: 1, distance: 1.4 },
];

function matchesFilter(listing: Listing, filter: FilterId | null) {
  switch (filter) {
    case 'under1200':
      return listing.price < 1200;
    case 'under2000':
      return listing.price < 2000;
    case 'oneBed':
      return listing.beds >= 1;
    case 'twoBeds':
      return listing.beds >= 2;
    case 'studio':
      return listing.beds === 0;
    default:
      return true;
  }
}

export default function HousingFinderScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterId | null>(null);
  const [saved, setSaved] = useState<string[]>(['l4']);

  const results = LISTINGS.filter((listing) => {
    const text = `${listing.address} ${listing.neighborhood}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && matchesFilter(listing, activeFilter);
  });

  const toggleSaved = (id: string) => {
    setSaved((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));
  };

  const openListing = (listing: Listing) => {
    Alert.alert(listing.address, `$${listing.price.toLocaleString()}/mo · ${listing.neighborhood}\nContact the landlord to schedule a tour?`, [
      { text: 'Not now', style: 'cancel' },
      { text: 'Request tour', onPress: () => Alert.alert('Request sent', 'The landlord will reach out by email.') },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.appName}>Housing Finder</Text>
      <Text style={styles.heading}>Apartments near campus</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 2 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search address or neighborhood"
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {FILTERS.map((f) => {
          const active = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveFilter(active ? null : f.id)}
            >
              <Text style={[styles.chipText, active && { color: '#fff' }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {results.map((listing) => {
        const isSaved = saved.includes(listing.id);
        return (
          <TouchableOpacity key={listing.id} style={styles.card} onPress={() => openListing(listing)} activeOpacity={0.8}>
            <View style={styles.photo} />
            <View style={styles.infoBox}>
              <View style={styles.titleRow}>
                <Text style={styles.address}>{listing.address}</Text>
                <TouchableOpacity onPress={() => toggleSaved(listing.id)}>
                  <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={18} color={isSaved ? '#E0245E' : '#777'} />
                </TouchableOpacity>
              </View>
              <Text style={styles.neighborhood}>{listing.neighborhood}</Text>
              <Text style={styles.price}>${listing.price.toLocaleString()}/mo</Text>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="bed-outline" size={20} color="#5B6B7A" />
                <Text style={styles.metaText}>
                  {listing.beds === 0 ? 'Studio' : `${listing.beds} bd`} · {listing.baths} ba
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="walk-outline" size={15} color="#5B6B7A" style={{ marginTop: 4 }} />
                <Text style={[styles.metaText, { marginLeft: 8 }]}>{listing.distance} mi to Sather Gate</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F6',
  },
  content: {
    paddingHorizontal: 5,
    paddingTop: 13,
    paddingBottom: 30,
  },
  appName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E8E7E',
    marginLeft: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E2B2A',
    marginTop: 2,
    marginLeft: 6,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9dedd',
    paddingHorizontal: 10,
    height: 44,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  chipRow: {
    paddingVertical: 5,
    marginTop: 7,
    gap: 6,
  },
  chip: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cfd6d4',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#3E8E7E',
    borderColor: '#3E8E7E',
  },
  chipText: {
    fontSize: 12,
    color: '#3B4A48',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dde3e1',
    marginTop: 8,
    marginBottom: 5,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  photo: {
    height: 150,
    borderRadius: 8,
    backgroundColor: '#C9CFCD',
  },
  infoBox: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#e3e8e6',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FBFCFC',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  address: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1E2B2A',
    marginRight: 8,
  },
  neighborhood: {
    fontSize: 14,
    color: '#56625F',
    marginTop: 3,
  },
  price: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 5,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#4A5654',
    marginLeft: 5,
  },
});
