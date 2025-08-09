import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  isToday,
} from 'date-fns';

// Define colors to match your vibrant design
const colors = {
  yellow: '#ffd500',
  red: '#d71a28',
  orange: '#f36c21',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f8fafc',
};

export default function CalendarView({ currentDate, selectedDate, onDayPress }) {
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });

  // Week day headers
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const weeks = [];
  let day = startDate;

  while (day <= endMonth || weeks.length < 6) {
    const week = [];

    for (let i = 0; i < 7; i++) {
      const copy = day;
      const isSelected = isSameDay(copy, selectedDate);
      const isCurrentMonth = isSameMonth(copy, currentDate);
      const isTodayDate = isToday(copy);

      week.push(
        <TouchableOpacity
          key={copy.toISOString()}
          onPress={() => onDayPress(copy)}
          style={[
            styles.dayContainer,
            !isCurrentMonth && styles.dayOutsideMonth
          ]}
          activeOpacity={0.8}
        >
          {isSelected ? (
            // Selected Day with Triple Gradient
            <LinearGradient
              colors={[colors.yellow, colors.orange, colors.red]}
              style={styles.selectedDayOuter}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.selectedDayInner}>
                <Text style={styles.selectedDayText}>
                  {copy.getDate()}
                </Text>
              </View>
            </LinearGradient>
          ) : isTodayDate ? (
            // Today's Date with Special Styling
            <View style={styles.todayContainer}>
              <LinearGradient
                colors={['rgba(255, 213, 0, 0.1)', 'rgba(243, 108, 33, 0.1)']}
                style={styles.todayBackground}
              >
                <Text style={[
                  styles.dayText,
                  styles.todayText,
                  !isCurrentMonth && styles.dayTextOutsideMonth
                ]}>
                  {copy.getDate()}
                </Text>
              </LinearGradient>
            </View>
          ) : (
            // Regular Day with Subtle Background
            <View style={styles.regularDay}>
              <Text style={[
                styles.dayText,
                !isCurrentMonth && styles.dayTextOutsideMonth
              ]}>
                {copy.getDate()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
      day = addDays(day, 1);
    }

    weeks.push(
      <View key={day.toISOString()} style={styles.week}>
        {week}
      </View>
    );
  }

  return (
    <View style={styles.calendarContainer}>
      {/* // Week Day Headers */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((dayName, index) => (
          <Text key={index} style={styles.weekDayText}>
            {dayName}
          </Text>
        ))}
      </View>
      
      {/* // Elegant Divider Line */}
      <LinearGradient
        colors={['transparent', colors.orange, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.divider}
      />
      
      {/* // Calendar Weeks */}
      <View style={styles.weeksContainer}>
        {weeks}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 20,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 2,
    borderColor: colors.yellow,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.orange,
    textAlign: 'center',
    width: 35,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  weeksContainer: {
    gap: 12,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  dayContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
  },
  dayOutsideMonth: {
    opacity: 0.4,
  },
  regularDay: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
    backgroundColor: 'rgba(248, 250, 252, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(243, 108, 33, 0.1)',
  },
  selectedDayOuter: {
    width: 28,
    height: 28,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  selectedDayInner: {
    width: 25,
    height: 25,
    borderRadius: 19.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  todayContainer: {
    width: 25,
    height: 25,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: colors.orange,
    overflow: 'hidden',
  },
  todayBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.red,
  },
  todayText: {
    fontWeight: 'bold',
    color: colors.orange,
  },
  dayTextOutsideMonth: {
    color: colors.gray,
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});