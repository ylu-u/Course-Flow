
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type TimeSlot = '1st Period' | '2nd Period' | '3rd Period' | '4th Period';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  room: string;
  day: Day;
  timeSlot: TimeSlot;
  color: string;
  weeks: number[]; // Array of week numbers this course is active (1-18)
}

export interface AIScheduleSuggestion {
  reasoning: string;
  courses: Course[];
}
