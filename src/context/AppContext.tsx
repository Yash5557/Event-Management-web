import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  EventItem,
  Registration,
  ToastMessage,
  ToastType,
  ViewportMode,
  AppScreen,
  ThemeMode,
  EventCategory,
} from '../types';
import {
  INITIAL_STUDENT_USER,
  INITIAL_ORGANIZER_USER,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
} from '../data/mockEvents';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginAs: (role: 'student' | 'organizer') => void;
  logout: () => void;
  
  events: EventItem[];
  registrations: Registration[];
  
  activeScreen: AppScreen;
  setActiveScreen: (screen: AppScreen) => void;
  
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  
  theme: ThemeMode;
  toggleTheme: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastType, title: string, description: string) => void;
  removeToast: (id: string) => void;
  
  // Actions
  registerForEvent: (eventId: string) => boolean;
  createEvent: (newEvent: Omit<EventItem, 'id' | 'registeredCount' | 'bannerGradient'>) => void;
  deleteEvent: (eventId: string) => void;
  toggleCheckIn: (registrationId: string) => void;
  
  // Active Pass Modal
  activePass: Registration | null;
  openPassModal: (registration: Registration) => void;
  closePassModal: () => void;
  
  // Organizer Drawers & Modals
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  selectedRosterEventId: string | null;
  setSelectedRosterEventId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_STUDENT_USER);
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('cp_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('cp_registrations');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });
  
  const [activeScreen, setActiveScreen] = useState<AppScreen>('catalog');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [activePass, setActivePass] = useState<Registration | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRosterEventId, setSelectedRosterEventId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cp_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cp_registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addToast = (type: ToastType, title: string, description: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { id, type, title, description, duration: 4500 };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loginAs = (role: 'student' | 'organizer') => {
    if (role === 'student') {
      setCurrentUser(INITIAL_STUDENT_USER);
      setActiveScreen('catalog');
      addToast('info', 'Logged in as Student', `Welcome back, ${INITIAL_STUDENT_USER.name}`);
    } else {
      setCurrentUser(INITIAL_ORGANIZER_USER);
      setActiveScreen('organizer-dashboard');
      addToast('info', 'Logged in as Organizer', `Welcome, ${INITIAL_ORGANIZER_USER.name}`);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveScreen('auth');
    addToast('info', 'Signed Out', 'You have been safely signed out.');
  };

  // Register for event logic
  const registerForEvent = (eventId: string): boolean => {
    if (!currentUser) {
      addToast('warning', 'Authentication Required', 'Please sign in to reserve your event pass.');
      setActiveScreen('auth');
      return false;
    }

    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) {
      addToast('error', 'Event Not Found', 'The requested event is no longer available.');
      return false;
    }

    // Edge case 1: Check if already registered
    const existing = registrations.find(
      (r) => r.eventId === eventId && r.studentId === currentUser.id
    );
    if (existing) {
      addToast(
        'warning',
        'Already Registered',
        'You already hold an active entry pass for this event.'
      );
      openPassModal(existing);
      return false;
    }

    // Edge case 2: Capacity full / sold out
    if (targetEvent.registeredCount >= targetEvent.maxCapacity) {
      addToast(
        'error',
        'Event Registration Closed',
        'This event has reached full capacity. No more seats are available.'
      );
      return false;
    }

    // Successful registration
    const newRegId = `REG-EVT${targetEvent.id.replace('evt-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRegistration: Registration = {
      id: newRegId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventCategory: targetEvent.category,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventVenue: targetEvent.venue,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNumber: currentUser.rollNumber || 'CS-2024-GEN',
      studentEmail: currentUser.email,
      registeredAt: new Date().toISOString(),
      checkInStatus: 'Pending',
    };

    // Optimistic capacity increment
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
      )
    );

    setRegistrations((prev) => [newRegistration, ...prev]);

    // Toast notification
    addToast(
      'success',
      'Registration Confirmed!',
      'Your digital entry pass has been generated and added to My Passes.'
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#10B981', '#06B6D4', '#A855F7'],
      });
    } catch {
      // Ignore if confetti is unavailable
    }

    // Open digital ticket pass
    setTimeout(() => {
      openPassModal(newRegistration);
    }, 400);

    return true;
  };

  const createEvent = (
    data: Omit<EventItem, 'id' | 'registeredCount' | 'bannerGradient'>
  ) => {
    const gradients = [
      'from-indigo-600 via-purple-600 to-pink-500',
      'from-blue-600 via-indigo-600 to-cyan-500',
      'from-emerald-600 via-teal-600 to-cyan-500',
      'from-amber-600 via-orange-600 to-rose-500',
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const newEventItem: EventItem = {
      ...data,
      id: `evt-${Date.now().toString().slice(-4)}`,
      registeredCount: 0,
      bannerGradient: randomGradient,
    };

    setEvents((prev) => [newEventItem, ...prev]);
    setIsCreateModalOpen(false);
    addToast('success', 'Event Published Successfully', `"${data.title}" is now open for campus registrations.`);
  };

  const deleteEvent = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
    addToast('info', 'Event Removed', `"${target?.title || 'Event'}" has been deleted.`);
    if (selectedRosterEventId === eventId) {
      setSelectedRosterEventId(null);
    }
  };

  const toggleCheckIn = (registrationId: string) => {
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id === registrationId) {
          const nextStatus = r.checkInStatus === 'Checked-in' ? 'Pending' : 'Checked-in';
          addToast(
            'info',
            nextStatus === 'Checked-in' ? 'Student Checked In' : 'Check-in Reverted',
            `${r.studentName} (${r.studentRollNumber}) marked as ${nextStatus}.`
          );
          return { ...r, checkInStatus: nextStatus };
        }
        return r;
      })
    );
  };

  const openPassModal = (registration: Registration) => {
    setActivePass(registration);
  };

  const closePassModal = () => {
    setActivePass(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAs,
        logout,
        events,
        registrations,
        activeScreen,
        setActiveScreen,
        viewportMode,
        setViewportMode,
        theme,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        registerForEvent,
        createEvent,
        deleteEvent,
        toggleCheckIn,
        activePass,
        openPassModal,
        closePassModal,
        isCreateModalOpen,
        setIsCreateModalOpen,
        selectedRosterEventId,
        setSelectedRosterEventId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
