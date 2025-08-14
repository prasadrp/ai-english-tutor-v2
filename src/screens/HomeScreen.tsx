import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

// Define tab param list
export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Voice: undefined;
  Settings: undefined;
};

const HomeScreen = (): JSX.Element => {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const userName = 'User'; // Replace with real user data

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {userName}!</Text>
      <Text style={styles.headline}>Speak English with Confidence</Text>
      <Text style={styles.subtitle}>
        Practice speaking English with our AI tutor. Get personalized feedback and improve your fluency.
      </Text>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => navigation.navigate('Chat')}
      >
        Start Learning
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    padding: 24,
  },
  greeting: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: 320,
  },
  button: {
    width: 220,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#1976D2',
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default HomeScreen;