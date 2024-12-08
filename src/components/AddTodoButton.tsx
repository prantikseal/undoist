"use client";

import { useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "./RichTextEditor";

interface FormErrors {
  text?: string;
  description?: string;
  startDate?: string;
  submit?: string;
}

export default function AddTodoButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTodo = useTodoStore((state) => state.addTodo);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!text.trim()) {
      newErrors.text = "Task title is required";
    } else if (text.length > 100) {
      newErrors.text = "Task title must be less than 100 characters";
    }

    if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const selectedDate = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      addTodo({
        text,
        description,
        completed: false,
        date: startDate,
        startDate,
      });

      setText("");
      setDescription("");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setErrors({});
      setIsOpen(false);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add todo. Please try again.",
      }));
      console.error(error, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-lg"
      >
        +
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Add New Todo</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (errors.text) {
                        setErrors((prev) => ({ ...prev, text: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded resize-none ${
                      errors.text ? "border-red-500" : ""
                    }`}
                    placeholder="Enter task title"
                    rows={2}
                  />
                  {errors.text && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.text}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter task description"
                    error={errors.description}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) {
                        setErrors((prev) => ({
                          ...prev,
                          startDate: undefined,
                        }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded ${
                      errors.startDate ? "border-red-500" : ""
                    }`}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                  {errors.startDate && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.startDate}
                    </motion.p>
                  )}
                </div>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 text-red-500 p-3 rounded"
                  >
                    {errors.submit}
                  </motion.div>
                )}

                <div className="flex gap-2 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border rounded"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`px-4 py-2 bg-black text-white rounded flex items-center ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Adding...
                      </>
                    ) : (
                      "Add Task"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
