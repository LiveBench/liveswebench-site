const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex flex-col text-sm text-gray-600 mt-2">
              <span>Created by Gabriel Guralnick</span>
              <span>Sponsored by <a href="https://abacus.ai" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Abacus.AI</a></span>
            </div>
            <p>
              This website is licensed under a <a rel="license" className="text-blue-600 hover:underline" href="http://creativecommons.org/licenses/by-sa/4.0/">
                Creative Commons Attribution-ShareAlike 4.0 International License
              </a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 