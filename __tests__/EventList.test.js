import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EventList from '../components/EventList';

describe('EventList', () => {
    const mockEvents = [
        { title: 'Meeting', description: 'Discuss roadmap', date: '2025-08-08' },
        { title: 'Workout', description: 'Gym session', date: '2025-08-08' },
    ];

    it('renders event titles and descriptions', () => {
        const { getByText } = render(
            <EventList
                events={mockEvents}
                selectedDate="August 8, 2025"
                onEdit={() => { }}
                onDelete={() => { }}
            />
        );

        expect(getByText('Events for August 8, 2025')).toBeTruthy();
        expect(getByText('Meeting')).toBeTruthy();
        expect(getByText('Discuss roadmap')).toBeTruthy();
        expect(getByText('Workout')).toBeTruthy();
        expect(getByText('Gym session')).toBeTruthy();
    });

    it('shows "No events" message when there are no events', () => {
        const { getByText } = render(
            <EventList
                events={[]}
                selectedDate="August 8, 2025"
                onEdit={() => { }}
                onDelete={() => { }}
            />
        );

        expect(getByText('No events for this day.')).toBeTruthy();
    });

    it('calls onEdit when an event is pressed', () => {
        const onEditMock = jest.fn();

        const { getByText } = render(
            <EventList
                events={mockEvents}
                selectedDate="August 8, 2025"
                onEdit={onEditMock}
                onDelete={() => { }}
            />
        );

        fireEvent.press(getByText('Meeting'));
        expect(onEditMock).toHaveBeenCalledWith(0); // first event index
    });

    it('calls onDelete when trash icon is pressed', () => {
        const onDeleteMock = jest.fn();
        const { getByTestId } = render(
            <EventList
                events={mockEvents}
                selectedDate="August 8, 2025"
                onEdit={jest.fn()}
                onDelete={onDeleteMock}
            />
        );

        const deleteButton = getByTestId('delete-button-0');
        fireEvent.press(deleteButton);
        expect(onDeleteMock).toHaveBeenCalledWith(0);
    });

});
