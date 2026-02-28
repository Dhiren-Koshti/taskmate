import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";
import alertReducer from "./slices/alertSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    alert: alertReducer,
    theme: themeReducer,
  },
});

