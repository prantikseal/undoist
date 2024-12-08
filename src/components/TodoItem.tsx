"use client";

import { Todo } from "@/store/todoStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "./RichTextEditor";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [errors, setErrors] = useState<{ text?: string; description?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { text?: string; description?: string } = {};

    if (!editText.trim()) {
      newErrors.text = "Task title is required";
    } else if (editText.length > 100) {
      newErrors.text = "Task title must be less than 100 characters";
    }

    if (editDescription.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onEdit(todo.id, { text: editText, description: editDescription });
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(todo.id)}
        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${todo.completed ? "bg-black border-black" : "border-gray-300"}`}
      >
        <AnimatePresence>
          {todo.completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-3 h-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex-1">
        <motion.div
          key="display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h3
            className={`text-lg font-medium ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.text}
          </h3>
          <div
            className={`prose prose-sm text-gray-600 ${
              todo.completed ? "line-through" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: todo.description }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(todo.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          Delete
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Task <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value);
                      if (errors.text) {
                        setErrors((prev) => ({ ...prev, text: undefined }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded resize-none ${
                      errors.text ? "border-red-500" : ""
                    }`}
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
                    value={editDescription}
                    onChange={setEditDescription}
                    placeholder="Enter task description"
                    error={errors.description}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-black text-white rounded"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
