export type UserRole = 'student' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string; // For student
  department?: string; // For organizer or student
  avatarUrl?: string;
}

export type EventCategory = 'Technical' | 'Cultural' | 'Workshops' | 'Sports';

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // e.g. "2026-10-15"
  time: string; // e.g. "10:00 AM - 04:00 PM"
  venue: string;
  description: string;
  organizerName: string;
  organizerId: string;
  maxCapacity: number;
  registeredCount: number;
  bannerGradient: string;
  tags: string[];
}

export interface Registration {
  id: string; // e.g. "REG-EVT4-8921"
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  studentId: string;
  studentName: string;
  studentRollNumber: string;
  studentEmail: string;
  registeredAt: string; // ISO string
  checkInStatus: 'Pending' | 'Checked-in';
}

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description: string;
  duration?: number;
}

export type ViewportMode = 'responsive' | 'desktop-1440' | 'mobile-375' | 'design-system';
export type AppScreen = 'auth' | 'catalog' | 'my-passes' | 'organizer-dashboard' | 'design-system';
export type ThemeMode = 'dark' | 'light';
