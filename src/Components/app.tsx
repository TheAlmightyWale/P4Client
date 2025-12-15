// `src/renderer/App.tsx`
import { useDispatch, createUseStore } from '@zubridge/electron';
import type { AppState } from 'src/Workspace';

// Create a hook to access the store
export const useStore = createUseStore<AppState>();

export function App() {
  const counter = useStore((state: AppState) => state.counter);
  const dispatch = useDispatch<AppState>();

  // For enhanced type safety, you can specify action types
  const typedDispatch = useDispatch<AppState, { SET_COUNTER: number }>();

  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch('INCREMENT')}>Increment</button>
      <button onClick={() => dispatch('DECREMENT')}>Decrement</button>
      <button onClick={() => dispatch({ type: 'SET_COUNTER', payload: 0 })}>Reset</button>
      {/* Type-checked action dispatch */}
      <button onClick={() => typedDispatch({ type: 'SET_COUNTER', payload: 42 })}>Set to 42 (Type-checked)</button>
    </div>
  );
}