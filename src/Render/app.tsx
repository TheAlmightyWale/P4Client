import { createUseStore, useDispatch } from '@zubridge/electron';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// UI components
import { Button } from './Components/button';

// Create the store hook
const useStore = createUseStore();

function App() {
  const store = useStore();
  const dispatch = useDispatch();

  // Get state values
  const counter = (store?.counter || 0) as number;

  // Action handlers
  const handleIncrement = async () => {
    await dispatch('COUNTER:INCREMENT');
  };

  const handleDecrement = async () => {
    await dispatch('COUNTER:DECREMENT');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[theme(--container-width)] mx-auto my-5 mt-[60px]">
        {/* Counter Display */}
        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Counter: {counter}</h2>
        </div>

        {/* Counter Actions */}
        <div className="flex flex-col gap-4 items-center mb-8">
          <div className="flex gap-4 justify-between w-full">
            <Button onClick={handleDecrement} className="flex-1">
              -
            </Button>
            <Button onClick={handleIncrement} className="flex-1">
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Get the DOM container element
const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);