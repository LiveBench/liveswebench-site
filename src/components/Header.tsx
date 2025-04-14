import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faNewspaper, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-600' : 'bg-black';
  };

  return (
    <header className="w-full bg-white shadow-md py-8">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center mb-4 pt-4">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">LiveSWEBench</h1>
          <h2 className="text-2xl text-gray-600 mt-0 mb-0 text-center">A Challenging, Contamination-Free Benchmark for AI Software Engineers</h2>
          <h3 className="text-xl text-gray-500 mt-0 mb-0 text-center">From the creators of <a href="https://livebench.ai/" className="text-blue-600">LiveBench</a></h3>
        </div>
        
        <nav className="flex justify-center items-center flex-wrap gap-4 mx-auto max-w-4xl">
          <Link to="/" className={`px-4 py-2 text-white ${isActive('/')} hover:bg-gray-600 rounded-full no-underline flex-grow-0`}>
            <FontAwesomeIcon icon={faMedal} className="mr-2" />
            Leaderboard
          </Link>
          <Link to="/details" className={`px-4 py-2 text-white ${isActive('/details')} hover:bg-gray-600 rounded-full no-underline flex-grow-0`}>
            <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
            Details
          </Link>
          <a 
            href="https://github.com/livebench/liveswebench" 
            className="px-4 py-2 text-white bg-black hover:bg-gray-600 rounded-full no-underline flex-grow-0"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} className="mr-2" />
            Code
          </a>
          <a 
            href="https://huggingface.co/collections/livebench/liveswebench-67eaf012f02466f4e2a757e0" 
            className="px-4 py-2 text-white bg-black hover:bg-gray-600 rounded-full no-underline flex-grow-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faDatabase} className="mr-2" />
            Data
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header; 