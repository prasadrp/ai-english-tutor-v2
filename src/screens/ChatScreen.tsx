import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { GeminiService, ConversationContext } from '../services/GeminiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
import { useUser } from '../contexts/UserContext';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi there! How can I help you today?' },
    { from: 'user', text: 'I’d like to practice my English speaking skills.' },
    { from: 'ai', text: 'Great! Let’s start with a simple conversation. What else do you like to do?' },
  ]);
  const [input, setInput] = useState('');
  const [geminiService] = useState(() => {
    const context: ConversationContext = {
      userLevel: 'intermediate',
      focusArea: 'conversation',
      previousExchanges: [],
    };
    return new GeminiService(context);
  });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [language, setLanguage] = useState('en-US');
  const { user, setUser } = useUser();

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('chatHistory');
      if (saved) setMessages(JSON.parse(saved));
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('selectedLanguage');
      if (saved) setLanguage(saved);
    })();
  }, []);

  React.useEffect(() => {
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value.length > 0) {
        setInput(event.value[0]);
        sendMessage(event.value[0]); // Auto-send recognized text
      }
      setIsListening(false);
    };
    Voice.onSpeechError = (e) => {
      setIsListening(false);
      setSpeechError('Speech recognition failed. Please try again.');
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const sendMessage = async (msg?: string) => {
    const messageToSend = msg ?? input;
    if (!messageToSend.trim()) return;
    setMessages([...messages, { from: 'user', text: messageToSend }]);
    setInput('');
    setLoading(true);
    setSpeechError(null);
    // Increment lessonsCompleted
    if (user) {
      setUser({
        ...user,
        lessonsCompleted: (user.lessonsCompleted || 0) + 1,
      });
    }
    try {
      const aiResponse = await geminiService.sendMessage(messageToSend);
      setMessages(msgs => [...msgs, { from: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { from: 'ai', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      await Voice.start(language);
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingVertical: 24 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={msg.from === 'ai' ? styles.aiBubble : styles.userBubble}>
            <Text style={msg.from === 'ai' ? styles.aiText : styles.userText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.micBtn} onPress={startListening} disabled={isListening}>
          <Text style={styles.micIcon}>{isListening ? '🎤...' : '🎤'}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Type a message" placeholderTextColor="#A0A0A0" value={input} onChangeText={setInput} editable={!loading && !isListening} />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size={20} />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
      {speechError && (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 8 }}>{speechError}</Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    maxWidth: '80%',
  },
  aiText: {
    color: '#222',
    fontSize: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userText: {
    color: '#1976D2',
    fontSize: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E0E3E7',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E3E7',
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  micBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 22,
    color: '#1976D2',
  },
});
