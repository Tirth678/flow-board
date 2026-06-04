import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './screens/Auth';
import Dashboard from './screens/Dashboard';
import Board from './screens/Board';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/signup" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
