import { createSlice, current, createAsyncThunk } from "@reduxjs/toolkit";
import { showAlert, hideAlert } from "./alertSlice";

const _url = import.meta.env.VITE_API_URL || "http://localhost:8081";
const host = _url.endsWith("/") ? _url : _url + "/";

// Fetch Todos Action
export const fetchTodos = createAsyncThunk("fetchTodos", async (params) => {
  // Convert params object to query string
  const constructQueryString = (params) => {
    return params
      ? Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&")
      : "";
  };

  const token = JSON.parse(localStorage.getItem("token"));
  const queryString = constructQueryString(params);
  const url = `${host}task/gettask?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return await response.json();
});

// Add Todos Action
export const addTodo = createAsyncThunk(
  "addTodo",
  async (taskData, { dispatch }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const url = `${host}task/addtask`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(taskData),
    });
    const result = await response.json();
    if (result.success) {
      dispatch(
        showAlert({ message: "Task added successfully!", type: "success" })
      );
    } else {
      dispatch(showAlert({ message: "Failed to add task.", type: "error" }));
    }

    return result;
  }
);

// DELETE Todos
export const deleteTodo = createAsyncThunk(
  "deleteTodo",
  async (id, { dispatch }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const url = `${host}task/deletetask/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    const result = await response.json();
    if (result.type === "Success") {
      dispatch(
        showAlert({ message: "Task deleted successfully!", type: "warning" })
      );
    } else {
      dispatch(showAlert({ message: "Failed to delete task", type: "error" }));
    }

    return result;
  }
);

// Update Todos
export const updateTodo = createAsyncThunk(
  "updateTodo",
  async ({ id, updatedata }, { dispatch }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const url = `${host}task/updatetask/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(updatedata),
    });
    const result = await response.json();

    if (result.type === "Success") {
      dispatch(
        showAlert({ message: "Task updated successfully!", type: "info" })
      );
    } else {
      dispatch(
        showAlert({
          message: result.msg || "Failed to update task",
          type: "error",
        })
      );
    }

    return result;
  }
);
const taskSlice = createSlice({
  name: "task",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    isUpdateTask: false,
  },
  extraReducers: (builder) => {
    // fetchTodos
    builder.addCase(fetchTodos.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.success) {
        state.data = action.payload.tasks || []; // assuming 'tasks' is the array
        state.isError = false;
      } else {
        state.isError = true;
        console.error(
          "Fetch failed:",
          action.payload.errors || "Unknown error"
        );
      }
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      console.error(action.error.message);
    });

    // Add Task
    builder.addCase(addTodo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.success) {
        const newTask = action.payload.task;
        state.data = [...state.data, newTask];
        state.isUpdateTask = !state.isUpdateTask;
      } else {
        state.isError = true;
        console.error(
          "Task was not added: ",
          action.payload.message || "Unknown error"
        );
      }
    });

    builder.addCase(addTodo.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // Update Task
    builder.addCase(updateTodo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.type === "Success") {
        state.data = state.data.map((task) =>
          task._id === action.payload.task._id ? action.payload.task : task
        );
        state.isUpdateTask = !state.isUpdateTask; // Trigger UI refresh if needed
      } else {
        state.isError = true;
        state.errorMessage = action.payload.msg || "Update failed";
      }
    });

    builder.addCase(updateTodo.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });

    // DELETE Task
    builder.addCase(deleteTodo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = state.data.filter(
        (task) => task._id !== action.payload.task._id
      ); // Remove the deleted task
      state.isUpdateTask = !state.isUpdateTask;
    });
    builder.addCase(deleteTodo.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
    });
  },
});

export default taskSlice.reducer;
