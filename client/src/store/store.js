import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./languageSlice/languageSlice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});