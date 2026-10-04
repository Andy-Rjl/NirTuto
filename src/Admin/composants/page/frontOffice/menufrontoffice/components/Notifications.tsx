import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  message: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ notifications }) => (
  <div className="fixed bottom-10 right-10 z-100 flex flex-col gap-3">
    <AnimatePresence>
      {notifications.map((n) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, x: 50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-[#1A234E] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
        >
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg">
            ✓
          </div>
          <span className="font-bold text-sm">{n.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default Notifications;