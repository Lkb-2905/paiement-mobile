import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { TicketsProvider } from './src/context/TicketsContext';

enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TicketsProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </TicketsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
