import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../contexts/UserContext';

const settings = [
  { section: 'Account', items: [
    { icon: 'account', label: 'Profile' },
    { icon: 'lock', label: 'Password' },
  ]},
  { section: 'Preferences', items: [
    { icon: 'bell', label: 'Notifications' },
    { icon: 'translate', label: 'Language' },
  ]},
  { section: 'Support', items: [
    { icon: 'help-circle', label: 'Help / FAQ' },
    { icon: 'email', label: 'Contact Support' },
  ]},
];

const languages = [
  { label: 'English', value: 'en-US' },
  { label: 'Spanish', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user, setUser } = useUser();
  const [editName, setEditName] = React.useState(user?.name || '');
  const [editEmail, setEditEmail] = React.useState(user?.email || '');
  const lessonsCompleted = user?.lessonsCompleted ?? 0;
  const [selectedLanguage, setSelectedLanguage] = React.useState('en-US');

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedLanguage');
      if (saved) setSelectedLanguage(saved);
    })();
  }, []);

  const handleItemPress = (label: string) => {
    if (label === 'Profile') {
      // Navigate to profile details (to be implemented)
      alert('Profile details screen coming soon!');
    } else if (label === 'Password') {
      alert('Change password screen coming soon!');
    } else if (label === 'Notifications') {
      alert('Notification settings coming soon!');
    } else if (label === 'Language') {
      alert('Language selection coming soon!');
    } else if (label === 'Help / FAQ') {
      alert('Help/FAQ coming soon!');
    } else if (label === 'Contact Support') {
      alert('Contact support coming soon!');
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    await AsyncStorage.setItem('selectedLanguage', lang);
  };

  const handleProfileSave = () => {
    if (!editName || !editEmail) return;
    setUser({
      name: editName,
      email: editEmail,
      language: user?.language || 'en-US',
      progress: user?.progress || 0,
      lessonsCompleted: user?.lessonsCompleted || 0,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Profile</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Your name"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="Your email"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Lessons Completed</Text>
          <Text style={styles.progress}>{lessonsCompleted}</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleProfileSave}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
        {settings.map(section => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.section}</Text>
            {section.items.map(item => (
              <View key={item.label} style={styles.itemRow}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color="#1976D2" style={styles.icon} />
                <Text style={styles.itemLabel} onPress={() => handleItemPress(item.label)}>{item.label}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Language</Text>
          {languages.map(lang => (
            <Text
              key={lang.value}
              style={{
                ...styles.itemLabel,
                color: selectedLanguage === lang.value ? '#1976D2' : '#222',
                fontWeight: selectedLanguage === lang.value ? 'bold' : 'normal',
                marginBottom: 8,
              }}
              onPress={() => handleLanguageChange(lang.value)}
            >
              {lang.label}
            </Text>
          ))}
        </View>
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
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 8,
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F7F9FB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E3E7',
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  icon: {
    marginRight: 16,
  },
  itemLabel: {
    fontSize: 16,
    color: '#222',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  progress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
});
