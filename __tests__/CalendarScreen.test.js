import React from 'react';
import { render } from '@testing-library/react-native';
import CalendarScreen from '../screens/CalendarScreen';

// ✅ Mock Firebase Realtime Database functions
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// ✅ Mock your custom firebase.js exports
jest.mock('../firebase', () => ({
  db: {},
  auth: {},
}));

describe('CalendarScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<CalendarScreen />);
    // You can adjust this to check for any known text in your screen, for now:
    expect(true).toBeTruthy();
  });
});
