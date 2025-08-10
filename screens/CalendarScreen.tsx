import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { addMonths, subMonths, format } from 'date-fns';
import { ref, onValue, set, remove } from 'firebase/database';
import type { User } from 'firebase/auth';
import { db, auth } from '../firebase';

import CalendarHeader from '../components/CalendarHeader';
import CalendarView from '../components/CalendarView';
import EventModal from '../components/EventModal';
import EventList from '../components/EventList';
import AddEventButton from '../components/AddEventButton';

const colors = {
  orange: '#f36c21',
  red: '#d71a28',
  yellow: '#ffd500',
  white: '#ffffff',
  lightGray: '#f8fafc',
};

// Shape of an event as stored in Firebase
type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // 'yyyy-MM-dd'
};

// Shape we receive from EventModal before assigning an id
type EventDraft = Omit<Event, 'id'>;

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const user: User | null = auth.currentUser;
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) return;

    const userEventsRef = ref(db, `events/${user.uid}`);
    const unsubscribe = onValue(userEventsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, Event> | null;
      const allEvents = data ? Object.values(data) : [];
      setEvents(allEvents);
    });

    return () => unsubscribe();
  }, [user]);

  const eventsForSelectedDate: Event[] = events.filter((e) => e.date === formattedDate);

  const handleSaveEvent = async (event: EventDraft) => {
    if (!user) return;

    const id =
      editingEventIndex !== null
        ? eventsForSelectedDate[editingEventIndex].id
        : Date.now().toString();

    const updatedEvent: Event = { ...event, id };

    try {
      await set(ref(db, `events/${user.uid}/${id}`), updatedEvent);
      setModalVisible(false);
      setEditingEventIndex(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to save event.');
    }
  };

  const handleDeleteEvent = async (index: number) => {
    if (!user) return;

    const eventToDelete = eventsForSelectedDate[index];
    if (!eventToDelete) return;

    try {
      await remove(ref(db, `events/${user.uid}/${eventToDelete.id}`));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event.');
    }
  };

  const handleEditEvent = (index: number) => {
    setEditingEventIndex(index);
    setModalVisible(true);
  };

  return (
    <LinearGradient colors={[colors.lightGray, colors.white]} style={styles.gradientBackground}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CalendarHeader
          currentDate={currentDate}
          onPrev={() => setCurrentDate(subMonths(currentDate, 1))}
          onNext={() => setCurrentDate(addMonths(currentDate, 1))}
        />

        <CalendarView currentDate={currentDate} selectedDate={selectedDate} onDayPress={setSelectedDate} />

        <AddEventButton
          onPress={() => {
            setEditingEventIndex(null);
            setModalVisible(true);
          }}
        />

        <EventList
          events={eventsForSelectedDate}
          selectedDate={format(selectedDate, 'MMMM d, yyyy')}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </ScrollView>

      <EventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingEventIndex(null);
        }}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        editingEvent={editingEventIndex !== null ? eventsForSelectedDate[editingEventIndex] : null}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
