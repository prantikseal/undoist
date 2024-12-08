"use client";

import { useState, useEffect } from "react";
import AddTodoButton from '@/components/AddTodoButton';
import TodoList from '@/components/TodoList';
import WelcomeScreen from "@/components/WelcomeScreen";
import { useTodoStore } from "@/store/todoStore";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const todos = useTodoStore((state) => state.todos);

  useEffect(() => {
    // Check if there are any todos after hydration
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    setShowWelcome(!hasSeenWelcome);
    setIsLoading(false);
  }, []);

  const handleContinue = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {showWelcome ? (
        <WelcomeScreen onContinue={handleContinue} />
      ) : (
        <main className="container mx-auto max-w-2xl p-4">
          <TodoList />
          <AddTodoButton />
        </main>
      )}
    </>
  );
}
