import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={({ route }) => {
          const match = route.name.match(/^screens\/screen-(\d+)$/);
          return {
            title: match ? `Screen ${match[1]}` : 'Relay Redesign',
            headerBackTitle: 'All screens',
            headerTransparent: false,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerShadowVisible: true,
          };
        }}
      />
    </>
  );
}
