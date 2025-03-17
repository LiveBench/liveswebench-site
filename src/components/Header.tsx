import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'border-b-2 border-blue-500' : '';
  };

  return (
    <header className="w-full bg-white shadow-md py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8 pt-4">
          <h1 className="text-5xl font-bold text-gray-800">LiveSWEBench</h1>
          <p className="text-l text-gray-600 mt-2">How helpful are AI software engineering assistants in real-world scenarios?</p>
        </div>
        
        <nav className="flex justify-center space-x-8 mt-4">
          <Link to="/" className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${isActive('/')}`}>
            Leaderboard
          </Link>
          <Link to="/details" className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${isActive('/details')}`}>
            Details
          </Link>
          <a 
            href="https://github.com/liveswebench/liveswebench" 
            className="px-3 py-2 text-gray-700 hover:text-blue-600"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Code
          </a>
          <a 
            href="#" 
            className="px-3 py-2 text-gray-700 hover:text-blue-600"
            onClick={(e) => { e.preventDefault(); alert('Data download coming soon!'); }}
          >
            Data
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 