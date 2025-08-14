import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './HomeScreen';

export default function LoginScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    // Simulate login success
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome back</Title>
      <TextInput style={styles.input} placeholder="Email or username" placeholderTextColor="#A0A0A0" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A0A0A0" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.rowBtns}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Continue with email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E3E7',
  },
  loginBtn: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rowBtns: {
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E0E3E7',
    marginHorizontal: 2,
  },
  secondaryText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
