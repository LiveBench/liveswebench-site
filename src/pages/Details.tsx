import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import details from '../assets/details.md?raw';

const Details = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <article>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {details}
            </ReactMarkdown>
          </article>
      </div>
    </div>
  );
};

export default Details; 