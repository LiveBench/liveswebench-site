const Leaderboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">About</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            LiveSWEBench is a benchmark designed to evaluate the software engineering capabilities of AI agent applications.
            We aim to answer the following questions:
            <ul className="pl-4 list-outside list-disc">
              <li>How skilled are AI coding assistants when operating fully autonomously?</li>
              <li>How effective are AI coding assistants at operating under developer instruction?</li>
              <li>How useful are AI coding assistants at supplementing developer code writing?</li>
            </ul>
          </p>
          <p className="text-gray-700 mb-4">
            To answer these questions, we evaluate the performance of each assistant on three task types:
            <ul className="pl-4 list-outside list-disc">
              <li>Agentic Programming, where the assistant is given a high-level task and must complete it fully autonomously.</li>
              <li>Targeted editing, where the assistant is given a more specific instruction and file to edit.</li>
              <li>Autocompletion, where the assistant is prompted inline with a very specific instruction.</li>
            </ul>
          </p>
          <p className="text-gray-700">
            Our task collection and evaluation framework is heavily inspired by that of <a className="text-blue-600" href="https://www.swebench.com/">SWE-Bench</a>.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 italic">Leaderboard data coming soon...</p>
          {/* Leaderboard content will be added here */}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard; 