import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const colors = {
  yellow: '#ffd500',
  red: '#d71a28',
  orange: '#f36c21',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f8fafc',
  darkGray: '#374151',
};

export default function EventList({ events, selectedDate, onEdit, onDelete }) {
  return (
    <View style={styles.container}>
      {/* Beautiful Header with Gradient Background */}
      <View style={styles.headerDescriptionContainer}>
        <FontAwesome5
          name="calendar-day"
          size={14}
          color={colors.gray}
          style={styles.headerIcon}
        />
        <Text style={styles.headerDescriptionText}>Events for {selectedDate}</Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <FontAwesome5 
            name="calendar-times" 
            size={48} 
            color={colors.gray} 
            style={styles.noEventsIcon}
          />
          <Text style={styles.noEvents}>No events for this day</Text>
          <Text style={styles.noEventsSubtext}>Tap "Add Event" to create your first event</Text>
        </View>
      ) : (
        events.map((e, i) => (
          <View key={i} style={styles.eventCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.9)']}
              style={styles.eventGradient}
            >
              <TouchableOpacity 
                style={styles.eventInfo} 
                onPress={() => onEdit(i)}
                activeOpacity={0.7}
              >
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <FontAwesome5 
                      name="calendar-check" 
                      size={16} 
                      color={colors.orange} 
                      style={styles.eventIcon}
                    />
                    <Text style={styles.title}>{e.title}</Text>
                  </View>
                  {!!e.description && (
                    <Text style={styles.description}>{e.description}</Text>
                  )}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                testID={`delete-button-${i}`} 
                onPress={() => onDelete(i)} 
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[colors.red, '#b91c1c']}
                  style={styles.deleteGradient}
                >
                  <FontAwesome5 
                    name="trash-alt" 
                    size={16} 
                    color={colors.white} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 15, 
    flex: 1,
  },
  headerIcon: {
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  headerDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  headerDescriptionText: {
    fontSize: 13,
    color: colors.gray,
    fontWeight: '500',
  },  
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 108, 33, 0.2)',
  },
  noEventsIcon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  noEvents: { 
    fontStyle: 'italic', 
    color: colors.gray,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  noEventsSubtext: {
    color: colors.gray,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(243, 108, 33, 0.2)',
    overflow: 'hidden',
  },
  eventInfo: { 
    flex: 1,
  },
  eventContent: {
    padding: 18,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIcon: {
    marginRight: 10,
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 17, 
    color: colors.red,
    flex: 1,
    letterSpacing: 0.3,
  },
  description: { 
    fontSize: 15, 
    color: colors.darkGray,
    lineHeight: 22,
    marginTop: 4,
    paddingLeft: 26,
  },
  deleteButton: { 
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
});
