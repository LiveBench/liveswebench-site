import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'border-b-2 border-blue-500' : '';
  };

  return (
    <header className="w-full bg-white shadow-md py-8">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center mb-4 pt-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">LiveSWEBench</h1>
          <p className="text-xl text-gray-600 mt-0 mb-0">How helpful are AI software engineering assistants in real-world scenarios?</p>
        </div>
        
        <nav className="flex justify-center space-x-8 flex-row">
          <Link to="/" className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${isActive('/')} no-underline`}>
            Leaderboard
          </Link>
          <Link to="/details" className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${isActive('/details')} no-underline`}>
            Details
          </Link>
          <a 
            href="https://github.com/livebench/liveswebench" 
            className="px-3 py-2 text-gray-700 hover:text-blue-600 no-underline"
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => { e.preventDefault(); alert('Code release coming soon!'); }}
          >
            Code
          </a>
          <a 
            href="#" 
            className="px-3 py-2 text-gray-700 hover:text-blue-600 no-underline"
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