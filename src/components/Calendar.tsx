"use client";

import { format, addDays, startOfWeek } from "date-fns";
import { motion } from "framer-motion";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 }); 

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    const dayNumber = format(date, "d");
    const dayLetter = format(date, "EEEEE");
    const isSelected =
      format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <motion.button
        key={i}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onDateSelect(date)}
        className={`flex flex-col items-center p-2 rounded-lg transition-colors
          ${isSelected ? "bg-black text-white" : ""}
          ${isPast ? "text-gray-400" : ""}
        `}
      >
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium"
        >
          {dayLetter}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium"
        >
          {dayNumber}
        </motion.span>
      </motion.button>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <motion.div className="text-sm text-gray-500 mb-2">
        {format(selectedDate, "MMMM yyyy")}
      </motion.div>
      <motion.div
        layout
        className="flex justify-between"
      >
        {weekDays}
      </motion.div>
    </motion.div>
  );
}
