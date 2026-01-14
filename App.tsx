import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_COURSES, DAYS, TIMESLOTS, TIME_RANGES, SEMESTER_START_DATE } from './constants';
import { Course, Day, TimeSlot } from './types';

// Storage Keys
const STORAGE_KEY = 'lumina_schedule_v1';
const THEME_KEY = 'lumina_theme_v1';

// Components
const GlassCard: React.FC<{ course: Course; onClick: () => void }> = ({ course, onClick }) => (
  <div 
    onClick={onClick}
    className="liquid-card aspect-[1.1/0.85] p-1 md:p-2 rounded-md md:rounded-[1.5rem] flex flex-col justify-center items-center text-center group cursor-pointer relative overflow-hidden animate-in fade-in duration-500"
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 opacity-0 lg:group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10 flex flex-col items-center w-full">
      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${course.color} mb-1 md:mb-1.5 opacity-100 shadow-[0_2px_8px_rgba(0,0,0,0.15)] group-hover:scale-125 transition-transform`} />
      <h3 className="font-extrabold text-[8px] md:text-[12px] leading-[1.05] tracking-tight line-clamp-2 px-0.5 text-slate-800 dark:text-slate-200">
        {course.name}
      </h3>
      <span className="text-[6px] md:text-[8px] text-slate-600 dark:text-slate-400 mt-0.5 uppercase tracking-tighter truncate w-full font-bold opacity-80 group-hover:opacity-100 transition-opacity">
        {course.room}
      </span>
    </div>
  </div>
);

const Modal: React.FC<{ 
  course: Course; 
  onClose: () => void; 
  onRemove: (id: string) => void; 
  onUpdate: (course: Course) => void; 
}> = ({ course, onClose, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState<Course>(course);

  const handleCloseTrigger = () => {
    setIsClosing(true);
    setTimeout(onClose, 500);
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-400/10 dark:bg-black/40 ${isClosing ? 'backdrop-animate-out' : 'backdrop-animate-in'}`} onClick={handleCloseTrigger}>
      <div 
        className={`glass-panel modal-glow-persistent w-full max-w-lg p-6 md:p-12 rounded-t-[2.5rem] md:rounded-[3.5rem] relative ${isClosing ? 'modal-animate-out' : 'modal-animate-in'} safe-bottom`}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden" />

        <button 
          onClick={handleCloseTrigger}
          className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/10 transition-all z-20"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${course.color} shadow-sm`} />
          <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400">Course Insight</span>
        </div>

        {isEditing ? (
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Course Name</label>
              <input 
                className="w-full liquid-card bg-white/20 dark:bg-white/10 p-4 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-200/50 text-slate-800"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Instructor</label>
              <input 
                className="w-full liquid-card bg-white/20 dark:bg-white/10 p-4 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-200/50 text-slate-800"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              />
            </div>
            <div className="flex gap-4 pt-4 md:pt-6">
              <button 
                onClick={handleSave}
                className="flex-1 bg-slate-800 text-white py-4 rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 transition-all"
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-white/40 text-slate-500 py-4 rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-800 mb-6 md:mb-8 leading-tight">
              {course.name}
            </h2>
            
            <div className="grid grid-cols-2 gap-y-6 md:gap-y-10 gap-x-4 md:gap-x-8 mb-8 md:mb-14">
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Instructor</span>
                <p className="font-bold text-slate-700 text-base md:text-lg truncate">{course.instructor}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Location</span>
                <p className="font-bold text-slate-700 text-base md:text-lg">{course.room}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Day</span>
                <p className="font-bold text-slate-700 text-base md:text-lg">{course.day}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-1">Schedule</span>
                <p className="font-bold text-slate-700 text-base md:text-lg">{TIME_RANGES[course.timeSlot]}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#1A1F2B] text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
              >
                Edit Entry
              </button>
              <button 
                onClick={() => onRemove(course.id)}
                className="w-full bg-rose-50/50 text-rose-600 py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 transition-all border border-rose-100/50"
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AddCourseModal: React.FC<{ 
  onClose: () => void; 
  onAdd: (course: Course) => void; 
}> = ({ onClose, onAdd }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    instructor: '',
    room: '',
    day: 'Monday',
    timeSlot: '1st Period',
    color: 'from-blue-400 to-indigo-600',
    weeks: Array.from({ length: 18 }, (_, i) => i + 1)
  });

  const handleCloseTrigger = () => {
    setIsClosing(true);
    setTimeout(onClose, 500);
  };

  const handleSave = () => {
    if (!formData.name || !formData.instructor) {
      alert("Please fill in the course name and instructor.");
      return;
    }
    const newCourse: Course = {
      ...formData,
      id: Date.now().toString(),
    } as Course;
    onAdd(newCourse);
    handleCloseTrigger();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-400/10 dark:bg-black/40 ${isClosing ? 'backdrop-animate-out' : 'backdrop-animate-in'}`} onClick={handleCloseTrigger}>
      <div 
        className={`glass-panel modal-glow-persistent w-full max-w-xl p-6 md:p-12 rounded-t-[2.5rem] md:rounded-[3.5rem] relative overflow-y-auto max-h-[95vh] no-scrollbar ${isClosing ? 'modal-animate-out' : 'modal-animate-in'} safe-bottom`}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-6 md:hidden" />
        
        <button 
          onClick={handleCloseTrigger}
          className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all z-20"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${formData.color} shadow-sm`} />
          <span className="text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase text-slate-500 dark:text-slate-400">Enroll New Entry</span>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Course Name</label>
            <input 
              className="w-full liquid-card bg-white/20 p-4 rounded-xl md:rounded-2xl outline-none text-slate-800"
              placeholder="e.g. Cognitive Psychology"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Instructor</label>
              <input 
                className="w-full liquid-card bg-white/20 p-4 rounded-xl md:rounded-2xl outline-none text-slate-800"
                placeholder="Dr. Smith"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Room</label>
              <input 
                className="w-full liquid-card bg-white/20 p-4 rounded-xl md:rounded-2xl outline-none text-slate-800"
                placeholder="101"
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Day</label>
              <select 
                className="w-full liquid-card bg-white/20 p-4 rounded-xl md:rounded-2xl outline-none text-slate-800"
                value={formData.day}
                onChange={(e) => setFormData({...formData, day: e.target.value as Day})}
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest px-2">Slot</label>
              <select 
                className="w-full liquid-card bg-white/20 p-4 rounded-xl md:rounded-2xl outline-none text-slate-800"
                value={formData.timeSlot}
                onChange={(e) => setFormData({...formData, timeSlot: e.target.value as TimeSlot})}
              >
                {TIMESLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-4 md:pt-6">
            <button 
              onClick={handleSave}
              className="w-full bg-[#1A1F2B] text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase active:scale-95 transition-all shadow-lg"
            >
              Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => (
  <button 
    onClick={onToggle}
    className="glass-panel w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-xl md:text-2xl transition-all active:scale-90"
    aria-label="Toggle Theme"
  >
    {isDark ? '🌙' : '☀️'}
  </button>
);

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  const [currentWeek, setCurrentWeek] = useState(1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [isGridVisible, setIsGridVisible] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleWeekChange = (w: number) => {
    setIsGridVisible(false);
    setTimeout(() => {
      setCurrentWeek(w);
      setIsGridVisible(true);
    }, 200);
  };

  const handleAISchedule = async () => {
    if (!aiGoal.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a university academic advisor. Goal: "${aiGoal}". Suggest 8 courses (Monday-Friday, 4 periods/day). Return JSON.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                instructor: { type: Type.STRING },
                room: { type: Type.STRING },
                day: { type: Type.STRING, enum: [...DAYS] },
                timeSlot: { type: Type.STRING, enum: [...TIMESLOTS] },
                color: { type: Type.STRING },
                weeks: { type: Type.ARRAY, items: { type: Type.INTEGER } },
              },
              required: ['id', 'name', 'instructor', 'room', 'day', 'timeSlot', 'color', 'weeks'],
            },
          },
        },
      });
      const suggestedCourses = JSON.parse(response.text) as Course[];
      setCourses(suggestedCourses);
    } catch (e) { alert('Sync failed.'); } finally { setIsAiLoading(false); }
  };

  const getCourseForSlot = (day: Day, slot: TimeSlot) => 
    courses.find(c => c.day === day && c.timeSlot === slot && c.weeks.includes(currentWeek));

  const calculateDate = (dayOffset: number, week: number) => {
    const d = new Date(SEMESTER_START_DATE);
    d.setDate(d.getDate() + (week - 1) * 7 + dayOffset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen px-2 py-6 md:p-12 lg:p-20 flex flex-col items-center relative z-10 transition-colors duration-500">
      {/* Header Section */}
      <header className="w-full max-w-7xl mb-8 md:mb-16 space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 animate-pulse" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 dark:text-slate-400">Lumina Academy</span>
            </div>
            <h1 className="text-4xl md:text-9xl font-black tracking-tighter leading-none text-slate-800 dark:text-white opacity-95 transition-colors">Course Flow</h1>
          </div>
          
          <div className="flex flex-wrap gap-2.5 w-full lg:w-auto items-center">
            <div className="relative flex-1 group min-w-[200px] md:min-w-[300px]">
              <input 
                type="text" 
                placeholder="Career path..."
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
                className="glass-panel w-full px-5 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-[3rem] outline-none focus:ring-2 focus:ring-blue-200/50 transition-all text-sm shadow-xl dark:text-white"
              />
              <button 
                onClick={handleAISchedule}
                className="absolute right-2 top-2 bottom-2 px-4 bg-slate-800 dark:bg-slate-200 dark:text-slate-900 text-white text-[9px] font-black tracking-widest uppercase rounded-xl active:scale-95"
              >
                {isAiLoading ? '...' : 'SYNC'}
              </button>
            </div>
            
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="glass-panel px-5 py-4 h-12 md:h-16 rounded-2xl md:rounded-[3rem] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all group"
            >
              <span className="text-xl text-slate-500 dark:text-slate-400 group-hover:rotate-90 transition-transform">+</span>
              <span className="text-[9px] font-black tracking-widest uppercase text-slate-600 dark:text-slate-300">Add</span>
            </button>

            <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="glass-panel p-1.5 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full mx-auto mb-8 shadow-lg border border-white/10">
        {Array.from({ length: 18 }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            onClick={() => handleWeekChange(w)}
            className={`flex-shrink-0 w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center text-[10px] md:text-sm font-black transition-all ${
              currentWeek === w 
                ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md scale-110' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white/10'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Main Timetable */}
      <main className={`w-full max-w-7xl glass-panel p-2 md:p-10 rounded-[2rem] md:rounded-[4rem] overflow-x-auto relative transition-grid ${isGridVisible ? 'opacity-100' : 'opacity-0 scale-[0.98]'}`}>
        <div className="min-w-[450px] md:min-w-[1050px]">
          {/* Column Headers */}
          <div className="grid grid-cols-[45px_repeat(5,1fr)] md:grid-cols-[80px_repeat(5,1fr)] gap-2 md:gap-3 mb-4 md:mb-10 text-center border-b border-slate-200/20 dark:border-slate-800/40 pb-3 md:pb-8">
            <div className="flex items-center justify-center" />
            {DAYS.map((day, idx) => (
              <div key={day} className="flex flex-col items-center justify-center">
                <span className="text-[6px] md:text-[10px] font-black text-slate-500 dark:text-slate-500 tracking-[0.05em] uppercase mb-0.5">{calculateDate(idx, currentWeek)}</span>
                <span className="text-base md:text-5xl font-black tracking-tighter uppercase text-slate-800 dark:text-slate-200 transition-colors">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Time Rows */}
          <div className="space-y-1.5 md:space-y-3">
            {TIMESLOTS.map((slot, index) => (
              <React.Fragment key={slot}>
                <div className="grid grid-cols-[45px_repeat(5,1fr)] md:grid-cols-[80px_repeat(5,1fr)] gap-2 md:gap-3 items-center">
                  {/* Sticky Time Slot Marker */}
                  <div className="sticky-col flex flex-col items-center justify-center liquid-card aspect-[1/0.95] rounded-lg md:rounded-[1.5rem] py-1.5 md:py-6 shadow-md">
                    <span className="font-antonio text-[10px] md:text-[22px] font-bold text-slate-700 dark:text-slate-300 leading-none">{TIME_RANGES[slot].split(' - ')[0].split(':')[0]}</span>
                    <div className="h-[1px] w-[30%] bg-slate-200 dark:bg-slate-700 my-1 md:my-3" />
                    <span className="font-antonio text-[10px] md:text-[22px] font-bold text-slate-700 dark:text-slate-300 leading-none">{TIME_RANGES[slot].split(' - ')[1].split(':')[0]}</span>
                  </div>
                  
                  {/* Course Slots */}
                  {DAYS.map(day => {
                    const course = getCourseForSlot(day, slot);
                    return (
                      <div key={`${day}-${slot}`} className="relative">
                        {course ? (
                          <GlassCard course={course} onClick={() => setSelectedCourse(course)} />
                        ) : (
                          <div className="aspect-[1.1/0.85] w-full rounded-md md:rounded-[1.5rem] border border-dashed border-slate-200/30 dark:border-slate-800/40 flex items-center justify-center opacity-40">
                             <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {slot === '2nd Period' && (
                  <div className="relative py-1 md:py-4 px-2 md:px-20">
                    <div className="h-[1px] w-full bg-slate-200/20 dark:bg-slate-800/40 shimmer-line" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>

      {/* Responsive Insight Footer */}
      <footer className="w-full max-w-7xl mt-10 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
        <div className="glass-panel p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] shadow-lg flex flex-col justify-center">
          <h4 className="font-black text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-slate-500 mb-1 md:mb-5 leading-none">Blocks</h4>
          <span className="text-xl md:text-5xl font-black text-slate-800 dark:text-white">{courses.filter(c => c.weeks.includes(currentWeek)).length}</span>
        </div>
        <div className="glass-panel p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] shadow-lg flex flex-col justify-center">
          <h4 className="font-black text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-slate-500 dark:text-slate-500 mb-1 md:mb-5 leading-none">Load</h4>
          <span className="text-xl md:text-5xl font-black text-slate-800 dark:text-white">{(courses.filter(c => c.weeks.includes(currentWeek)).length * 1.5).toFixed(0)}h</span>
        </div>
        <div className="col-span-2 lg:col-span-2 glass-panel p-4 md:p-10 rounded-[1.5rem] md:rounded-[3rem] flex items-center justify-between shadow-lg group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 dark:from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] md:text-base text-slate-600 dark:text-slate-400 font-bold tracking-tight">Status: Sync v1.3</p>
            <p className="text-[8px] md:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black leading-none">Performance: High Density Opt.</p>
          </div>
          <div className="shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[1.2rem] bg-white/10 dark:bg-black/20 flex items-center justify-center border border-white/5 dark:border-white/10 shadow-inner relative z-10">
            <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-blue-400 animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedCourse && (
        <Modal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)}
          onRemove={(id) => { setCourses(courses.filter(c => c.id !== id)); setSelectedCourse(null); }}
          onUpdate={(uc) => setCourses(courses.map(c => c.id === uc.id ? uc : c))}
        />
      )}
      {isAddModalOpen && (
        <AddCourseModal 
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(nc) => setCourses([...courses, nc])}
        />
      )}
    </div>
  );
};

export default App;