
import { Course } from './types';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
export const TIMESLOTS = ['1st Period', '2nd Period', '3rd Period', '4th Period'] as const;

// Monday, March 2nd, 2026
export const SEMESTER_START_DATE = new Date('2026-03-02'); 

export const TIME_RANGES: Record<string, string> = {
  '1st Period': '08:30 - 10:05',
  '2nd Period': '10:25 - 12:00',
  '3rd Period': '14:00 - 15:35',
  '4th Period': '15:55 - 17:30',
};

const allWeeks = Array.from({ length: 18 }, (_, i) => i + 1);
const earlyWeeks = Array.from({ length: 9 }, (_, i) => i + 1);
const lateWeeks = Array.from({ length: 9 }, (_, i) => i + 10);

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    name: 'Advanced UX Design',
    instructor: 'Dr. Sarah Chen',
    room: 'Lab 402',
    day: 'Monday',
    timeSlot: '1st Period',
    color: 'from-purple-400 to-blue-500',
    weeks: allWeeks
  },
  {
    id: '2',
    name: 'Neural Networks',
    instructor: 'Prof. James Watt',
    room: 'Hall A',
    day: 'Tuesday',
    timeSlot: '3rd Period',
    color: 'from-pink-400 to-rose-500',
    weeks: earlyWeeks
  },
  {
    id: '3',
    name: 'Distributed Systems',
    instructor: 'Elena Rodriguez',
    room: 'Room 101',
    day: 'Wednesday',
    timeSlot: '2nd Period',
    color: 'from-cyan-400 to-blue-600',
    weeks: allWeeks
  },
  {
    id: '4',
    name: 'Cyber Security',
    instructor: 'Mark Thompson',
    room: 'Secure Lab',
    day: 'Thursday',
    timeSlot: '4th Period',
    color: 'from-amber-400 to-orange-500',
    weeks: lateWeeks
  },
  {
    id: '5',
    name: 'Quantum Computing',
    instructor: 'Dr. Alan Turing',
    room: 'Physics 01',
    day: 'Friday',
    timeSlot: '3rd Period',
    color: 'from-emerald-400 to-teal-600',
    weeks: earlyWeeks
  }
];
