import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import VoiceSettingsScreen from './src/screens/VoiceSettingsScreen';
import SettingsScreen from './src/screens/SettingsScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Chat') {
                iconName = 'chat';
              } else if (route.name === 'Voice') {
                iconName = 'microphone';
              } else if (route.name === 'Settings') {
                iconName = 'cog';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
          <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
          <Tab.Screen name="Voice" component={VoiceSettingsScreen} options={{ title: 'Voice Settings' }} />
          <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
