import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { addMonths, subMonths, format } from 'date-fns';
import { ref, onValue, set, remove } from 'firebase/database';
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

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState(null);
  const [events, setEvents] = useState([]);

  const user = auth.currentUser;
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) return;

    const userEventsRef = ref(db, `events/${user.uid}`);
    const unsubscribe = onValue(userEventsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const allEvents = Object.values(data);
      setEvents(allEvents);
    });

    return () => unsubscribe();
  }, [user]);

  const eventsForSelectedDate = events.filter((e) => e.date === formattedDate);

  const handleSaveEvent = async (event) => {
    if (!user) return;

    const id = editingEventIndex !== null ? eventsForSelectedDate[editingEventIndex].id : Date.now().toString();
    const updatedEvent = { ...event, id };

    try {
      await set(ref(db, `events/${user.uid}/${id}`), updatedEvent);
      setModalVisible(false);
      setEditingEventIndex(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save event.");
    }
  };

  const handleDeleteEvent = async (index) => {
    if (!user) return;

    const eventToDelete = eventsForSelectedDate[index];
    if (!eventToDelete) return;

    try {
      await remove(ref(db, `events/${user.uid}/${eventToDelete.id}`));
    } catch (error) {
      Alert.alert("Error", "Failed to delete event.");
    }
  };

  const handleEditEvent = (index) => {
    setEditingEventIndex(index);
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={[colors.lightGray, colors.white]}
      style={styles.gradientBackground}
    >
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

        <CalendarView
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDayPress={setSelectedDate}
        />

        <AddEventButton
          onPress={() => {
            setEditingEventIndex(null);
            setModalVisible(true);
          }}
          colors={colors}
        />

        <EventList
          events={eventsForSelectedDate}
          selectedDate={format(selectedDate, 'MMMM d, yyyy')}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          colors={colors}
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
        editingEvent={
          editingEventIndex !== null ? eventsForSelectedDate[editingEventIndex] : null
        }
        colors={colors}
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
    paddingBottom: 40, // Optional: ensure spacing for bottom content
  },
});
