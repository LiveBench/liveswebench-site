import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import report from '../assets/Report.md?raw';

const Details = () => {
  return (
    <div className="mx-auto md:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <article>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}>
              {report}
            </ReactMarkdown>
          </article>
      </div>
    </div>
  );
};

export default Details; 