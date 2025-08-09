import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
};

export default function CalendarHeader({ currentDate, onPrev, onNext }) {
  return (
    <View style={styles.header}>
      {/* // Previous Month Button */}
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={onPrev}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.orange, colors.red]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 
            name="chevron-left" 
            size={16} 
            color={colors.white} 
          />
        </LinearGradient>
      </TouchableOpacity>

      {/* // Month and Year Display */}
      <View style={styles.monthContainer}>
        <FontAwesome5 
          name="calendar-alt" 
          size={20} 
          color={colors.orange} 
          style={styles.calendarIcon}
        />
        <Text style={styles.monthText}>
          {format(currentDate, 'MMMM yyyy')}
        </Text>
      </View>

      {/* // Next Month Button */}
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={onNext}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.orange, colors.red]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <FontAwesome5 
            name="chevron-right" 
            size={16} 
            color={colors.white} 
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(243, 108, 33, 0.2)',
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  calendarIcon: {
    marginRight: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.red,
    textAlign: 'center',
  },
  arrowButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    width: 27,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});