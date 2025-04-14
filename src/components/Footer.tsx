const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 w-full">
            <div className="flex flex-col text-sm text-gray-600 mt-2 text-center align-middle w-full">
              <span>Created by <a href="https://gnguralnick.github.io" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Gabriel Guralnick</a></span>
              <span>Sponsored by <a href="https://abacus.ai" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Abacus.AI</a></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 