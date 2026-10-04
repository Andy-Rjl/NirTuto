import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, ShieldCheck,
} from 'lucide-react';

interface DashboardHeaderProps {
  showCalendar: boolean;
  setShowCalendar: (v: boolean) => void;
  viewDate: Date;
  handlePrevMonth: (e: React.MouseEvent) => void;
  handleNextMonth: (e: React.MouseEvent) => void;
  monthName: string;
  daysInMonth: number;
  firstDayOfMonth: number;
  today: Date;
}

const DashboardHeader = ({
  showCalendar, setShowCalendar,
  viewDate, handlePrevMonth, handleNextMonth,
  monthName, daysInMonth, firstDayOfMonth, today,
}: DashboardHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
      >
        <ShieldCheck size={18} className="text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: '#1e1b4b' }}>
            Tableau de bord
          </h1>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Plateforme active
          </p>
        </div>
      </div>
    </div>

    {/* Calendar button */}
    <div className="relative self-start sm:self-auto">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
        style={showCalendar
          ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }
          : { background: 'white', color: '#6366f1', border: '2px solid #e0e7ff' }
        }
      >
        <CalendarIcon size={13} />
        <span>Calendrier</span>
      </button>

      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute right-0 top-full mt-2 z-50 rounded-2xl p-4 w-64"
          style={{ background: 'white', boxShadow: '0 20px 60px rgba(99,102,241,0.2)', border: '1px solid #e0e7ff' }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black capitalize" style={{ color: '#1e1b4b' }}>{monthName}</span>
            <div className="flex gap-1">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-indigo-50 rounded-lg transition-all" style={{ color: '#6366f1' }}><ChevronLeft size={12} /></button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-indigo-50 rounded-lg transition-all" style={{ color: '#6366f1' }}><ChevronRight size={12} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['L','M','M','J','V','S','D'].map((d, i) => (
              <span key={i} className="text-[8px] font-black text-slate-400">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isToday = day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
              return (
                <button key={day} onClick={() => setShowCalendar(false)}
                  className="text-[10px] py-1.5 rounded-lg font-bold transition-all"
                  style={isToday
                    ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white' }
                    : { color: '#475569' }
                  }
                >{day}</button>
              );
            })}
          </div>
          <button onClick={() => setShowCalendar(false)} className="w-full mt-3 py-2 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-indigo-500 transition-colors" style={{ background: '#f8fafc' }}>
            Fermer
          </button>
        </motion.div>
      )}
    </div>
  </div>
);

export default DashboardHeader;