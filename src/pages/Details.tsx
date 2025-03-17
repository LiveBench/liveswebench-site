import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import details from '../assets/details.md?raw';

const Details = () => {
  return (
    <div className="mx-auto px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <article>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}>
              {details}
            </ReactMarkdown>
          </article>
      </div>
    </div>
  );
};

export default Details; 