import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';

// Local colors (unchanged)
const colors = {
  yellow: '#ffd500',
  red: '#d71a28',
  orange: '#f36c21',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
};

// Minimal nav typing so we don't have to import React Navigation types here
type ProfileScreenProps = {
  navigation: {
    replace: (routeName: string) => void;
  };
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const user: User | null = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem('wasLoggedIn');
    navigation.replace('Login');
  };

  return (
    <LinearGradient
      colors={[colors.yellow, colors.orange, colors.red]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileCard}>
          {/* Profile Icon with Gradient */}
          <View style={styles.iconContainer}>
            <LinearGradient colors={[colors.orange, colors.red]} style={styles.iconGradient}>
              <FontAwesome5 name="user-circle" size={70} color={colors.white} />
            </LinearGradient>
          </View>

          {/* Profile Title */}
          <Text style={styles.title}>Your Profile</Text>

          {/* Email Information Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.emailWrapper}>
              <FontAwesome5 name="envelope" size={16} color={colors.orange} style={styles.emailIcon} />
              <Text style={styles.text}>{user?.email ?? 'Unknown user'}</Text>
            </View>
          </View>

          {/* Logout Button with Gradient */}
          <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient colors={[colors.red, colors.orange]} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <FontAwesome5 name="sign-out-alt" size={16} color={colors.white} style={styles.logoutIcon} />
              <Text style={styles.buttonText}>Log Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 2,
    borderColor: 'rgba(243, 108, 33, 0.2)',
  },
  iconContainer: {
    marginBottom: 25,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.red,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
    fontWeight: '600',
  },
  emailWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(243, 108, 33, 0.3)',
    width: '100%',
    justifyContent: 'center',
  },
  emailIcon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: colors.red,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    width: '100%',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  logoutIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
