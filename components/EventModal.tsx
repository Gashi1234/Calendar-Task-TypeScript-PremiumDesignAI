import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { format } from 'date-fns';

// Define colors to match your vibrant design
const colors = {
  yellow: '#ffd500',
  red: '#d71a28',
  orange: '#f36c21',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f8fafc',
  darkGray: '#374151',
};

type EventDraft = {
  title: string;
  description?: string;
  date: string; // 'yyyy-MM-dd'
};

type EditingEvent = {
  title: string;
  description?: string;
  date?: string;
};

type EventModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (event: EventDraft) => void;
  editingEvent?: EditingEvent | null;
};

export default function EventModal({
  visible,
  onClose,
  selectedDate,
  onSave,
  editingEvent,
}: EventModalProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingEvent, visible]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title,
        description,
        date: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContent}>
            {/* Beautiful Header with Gradient Background */}
            <LinearGradient
              colors={[colors.orange, colors.red]}
              style={styles.headerContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.headerContent}>
                <FontAwesome5
                  name="calendar-plus"
                  size={20}
                  color={colors.white}
                  style={styles.headerIcon}
                />
                <Text style={styles.headerTitle}>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.formContainer}>
              {/* Date Display */}
              <View style={styles.dateContainer}>
                <FontAwesome5
                  name="calendar-day"
                  size={16}
                  color={colors.orange}
                  style={styles.dateIcon}
                />
                <Text style={styles.dateText}>
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Text>
              </View>

              {/* Title Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <FontAwesome5
                    name="edit"
                    size={16}
                    color={colors.orange}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Event Title"
                    placeholderTextColor={colors.gray}
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                  <FontAwesome5
                    name="align-left"
                    size={16}
                    color={colors.orange}
                    style={[styles.inputIcon, styles.textAreaIcon]}
                  />
                  <TextInput
                    placeholder="Description (optional)"
                    placeholderTextColor={colors.gray}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton} activeOpacity={0.8}>
                  <LinearGradient colors={[colors.gray, '#4b5563']} style={styles.buttonGradient}>
                    <FontAwesome5
                      name="times"
                      size={16}
                      color={colors.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
                  <LinearGradient colors={[colors.orange, colors.red]} style={styles.buttonGradient}>
                    <FontAwesome5
                      name="check"
                      size={16}
                      color={colors.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>
                      {editingEvent ? 'Update' : 'Save'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    padding: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 108, 33, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 108, 33, 0.2)',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkGray,
    letterSpacing: 0.3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(243, 108, 33, 0.3)',
    borderRadius: 12,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 12,
    width: 20,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.darkGray,
    paddingVertical: 12,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
