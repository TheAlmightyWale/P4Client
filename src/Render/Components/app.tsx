// `src/renderer/App.tsx`
import { useStore } from "../Hooks/UseStore";
import { useDispatch } from '@zubridge/electron';

export function App() {
  const store = useStore();
  const dispatch = useDispatch();
  
  const counter = (store?.counter || 0) as number

  return (
    <div>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch('INCREMENT')}>Increment</button>
      <button onClick={() => dispatch('DECREMENT')}>Decrement</button>
      <button onClick={() => dispatch({ type: 'SET_COUNTER', payload: 0 })}>Reset</button>
    </div>
  );
}