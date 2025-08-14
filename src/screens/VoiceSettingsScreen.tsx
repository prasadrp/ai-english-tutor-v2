import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VoiceSettingsScreen() {
  const [voice, setVoice] = React.useState('male');

  useEffect(() => {
    AsyncStorage.setItem('selectedVoice', voice);
  }, [voice]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Voice</Text>
      <View style={styles.card}>
        <RadioButton.Group onValueChange={setVoice} value={voice}>
          <RadioButton.Item
            label="Male Voice"
            value="male"
            style={styles.radioItem}
            labelStyle={styles.radioLabel}
            color="#1976D2"
            uncheckedColor="#E0E3E7"
          />
          <RadioButton.Item
            label="Female Voice"
            value="female"
            style={styles.radioItem}
            labelStyle={styles.radioLabel}
            color="#1976D2"
            uncheckedColor="#E0E3E7"
          />
        </RadioButton.Group>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  radioItem: {
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F7F9FB',
  },
  radioLabel: {
    fontSize: 16,
    color: '#222',
  },
});
