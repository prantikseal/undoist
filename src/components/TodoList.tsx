"use client";

import { useTodoStore } from "@/store/todoStore";
import TodoItem from "./TodoItem";
import Calendar from "./Calendar";
import { format } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TodoList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toggleTodo, deleteTodo, editTodo, getTodosByDate } = useTodoStore();
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const todaysTodos = getTodosByDate(formattedDate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      
      <motion.div
        layout
        className="flex items-center justify-between"
      >
        <motion.h2
          layout
          className="text-2xl font-bold"
        >
          {format(selectedDate, "EEEE")}
        </motion.h2>
        <motion.div
          layout
          className="text-sm text-gray-500"
        >
          {format(selectedDate, "MMMM d")}
        </motion.div>
      </motion.div>

      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {todaysTodos.length > 0 ? (
            todaysTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8 text-gray-500"
            >
              No tasks for today
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
