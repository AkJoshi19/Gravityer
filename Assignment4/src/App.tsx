import React, { useEffect } from 'react';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { FilterType } from './types/todo';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { fetchTodos, addTodo, toggleTodo, deleteTodo, setFilter } from './store/todoSlice';

function App() {
  const dispatch = useAppDispatch();
  const { todos, filter, loading, error } = useAppSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = async (text: string) => {
    dispatch(addTodo(text));
  };

  const handleToggle = async (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDelete = async (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleFilterChange = (newFilter: FilterType) => {
    dispatch(setFilter(newFilter));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    completed: todos.filter((t) => t.completed).length,
    pending: todos.filter((t) => !t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <AddTodo onAdd={handleAddTodo} />
        <TodoFilter
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;