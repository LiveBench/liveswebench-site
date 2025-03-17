import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Leaderboard from './pages/Leaderboard';
import Details from './pages/Details';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
