"use client";
import React, { useRef } from "react";
import { RootState } from "../redux/store"; // Define RootState if needed
import {
  increment,
  decrement,
  incrementByAmount,
} from "../redux/slices/counterSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/hooks/hooks";

const MyCounter = () => {
  const store = useAppStore();
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
  }
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state: RootState) => state.counter.value);

  return (
    <div>
      <div>Count: {counter}</div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </button>
    </div>
  );
};

export default MyCounter;
