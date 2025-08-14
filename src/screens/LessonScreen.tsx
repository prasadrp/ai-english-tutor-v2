import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Card, ActivityIndicator } from 'react-native-paper';
import * as Speech from 'expo-speech';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GeminiService, ConversationContext } from '../services/GeminiService';

import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

const LessonScreen = ({ route, navigation }: Props): JSX.Element => {
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);

  useEffect(() => {
    const context: ConversationContext = {
      userLevel: 'intermediate', // This could come from user settings
      focusArea: route.params.lessonType,
      previousExchanges: [],
    };
    setGeminiService(new GeminiService(context));
  }, [route.params.lessonType]);

  const startListening = useCallback(() => {
    setIsListening(true);
    // Here you would implement speech recognition
    // Using a service like Azure Speech Services or similar
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    // Stop speech recognition and process the input
  }, []);

  const speakResponse = useCallback((text: string) => {
    Speech.speak(text, {
      language: 'en',
      pitch: 1,
      rate: 0.9,
    });
  }, []);

  const handleAIResponse = useCallback(async (input: string) => {
    if (!geminiService) return;
    
    setIsLoading(true);
    try {
      let response: string;
      
      switch (route.params.lessonType) {
        case 'pronunciation':
          response = await geminiService.getPronunciationFeedback(input);
          break;
        case 'grammar':
          response = await geminiService.getGrammarFeedback(input);
          break;
        default:
          response = await geminiService.sendMessage(input);
      }
      
      setAiResponse(response);
      speakResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, route.params.lessonType, speakResponse]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.lessonType}>
              {route.params.lessonType.charAt(0).toUpperCase() + route.params.lessonType.slice(1)} Practice
            </Text>
            
            {userInput && (
              <View style={styles.messageContainer}>
                <Text style={styles.userMessage}>You: {userInput}</Text>
              </View>
            )}
            
            {aiResponse && (
              <View style={styles.messageContainer}>
                <Text style={styles.aiMessage}>Tutor: {aiResponse}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.controls}>
        {isLoading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : (
          <Button
            mode="contained"
            onPress={isListening ? stopListening : startListening}
            style={styles.button}
          >
            {isListening ? 'Stop Speaking' : 'Start Speaking'}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  lessonType: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 8,
  },
  userMessage: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginLeft: 40,
  },
  aiMessage: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 40,
  },
  controls: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    marginVertical: 8,
  },
});

export default LessonScreen;
