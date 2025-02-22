import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Todo, FilterType } from '../types/todo';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  loading: true,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    return JSON.parse(savedTodos);
  }

  try {
    const response = await fetch('https://dummyjson.com/todos?limit=10');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data.todos || !Array.isArray(data.todos)) {
      throw new Error('Invalid data format received from API');
    }

    const todosWithLocalIds = data.todos.map((todo: any) => ({
      ...todo,
      id: Math.random().toString(36).substr(2, 9),
      apiId: todo.id,
    }));

    localStorage.setItem('todos', JSON.stringify(todosWithLocalIds));
    return todosWithLocalIds;
  } catch (error) {
    // Return empty array instead of throwing
    console.warn('Failed to fetch todos from API, starting with empty list');
    return [];
  }
});

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (text: string) => {
    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      todo: text,
      completed: false,
      userId: 1,
    };

    try {
      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: text,
          completed: false,
          userId: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiTodo = await response.json();
      return {
        ...newTodo,
        apiId: apiTodo.id,
      };
    } catch (error) {
      // Return the local todo without apiId if API fails
      console.warn('Failed to sync new todo with API, saving locally only');
      return newTodo;
    }
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (id: string, { getState }) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find((t) => t.id === id);
    if (!todo) throw new Error('Todo not found');

    const updatedTodo = { ...todo, completed: !todo.completed };

    if (todo.apiId) {
      try {
        const response = await fetch(`https://dummyjson.com/todos/${todo.apiId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            completed: updatedTodo.completed,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.warn('Failed to sync todo update with API, saving locally only');
      }
    }

    return updatedTodo;
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { getState }) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find((t) => t.id === id);
    if (!todo) throw new Error('Todo not found');

    if (todo.apiId) {
      try {
        const response = await fetch(`https://dummyjson.com/todos/${todo.apiId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.warn('Failed to sync todo deletion with API, deleting locally only');
      }
    }

    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load todos';
        state.todos = [];
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        localStorage.setItem('todos', JSON.stringify(state.todos));
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          localStorage.setItem('todos', JSON.stringify(state.todos));
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
        localStorage.setItem('todos', JSON.stringify(state.todos));
      });
  },
});

export const { setFilter } = todoSlice.actions;
export default todoSlice.reducer;