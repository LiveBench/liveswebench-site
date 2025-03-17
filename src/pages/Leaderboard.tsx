import agentCsvData from '../assets/agent.csv?raw';
import editCsvData from '../assets/edit.csv?raw';
import autocompleteCsvData from '../assets/autocomplete.csv?raw';

const Leaderboard = () => {
  // Tool mapping for website links
  const toolWebsites: Record<string, string> = {
    "Windsurf": "https://www.windsurf.ai/",
    "Github Copilot": "https://github.com/features/copilot",
    "SWE-Agent": "https://github.com/Princeton-SysML/SWE-agent",
    "OpenHands": "https://github.com/OpenHandsAI/OpenHands",
    "Cursor": "https://cursor.sh/",
    "Claude Code": "https://claude.ai/",
    "Aider": "https://aider.chat/",
    "Amazon Q": "https://aws.amazon.com/q/",
  };

  // Parse CSV data
  const parseCSV = (csvData: string): { Tool: string; Score: number }[] => {
    const lines = csvData.trim().split('\n');
    // Skip header line
    return lines.slice(1).map(line => {
      const [tool, scoreStr] = line.split(',');
      return {
        Tool: tool,
        Score: parseFloat(scoreStr)
      };
    }).filter(item => !isNaN(item.Score));
  };

  const agentData = parseCSV(agentCsvData);
  const editData = parseCSV(editCsvData);
  const autocompleteData = parseCSV(autocompleteCsvData);

  // Generate leaderboard data
  const generateLeaderboardData = () => {
    const allTools = new Set([
      ...agentData.map((item) => item.Tool),
      ...editData.map((item) => item.Tool),
      ...autocompleteData.map((item) => item.Tool),
    ]);

    const leaderboardData = Array.from(allTools).map((tool) => {
      const agentScore = agentData.find((item) => item.Tool === tool)?.Score || null;
      const editScore = editData.find((item) => item.Tool === tool)?.Score || null;
      const autocompleteScore = autocompleteData.find((item) => item.Tool === tool)?.Score || null;

      // Calculate global average based on available scores
      const availableScores = [agentScore, editScore, autocompleteScore].filter(
        (score) => score !== null
      );
      const globalAverage = 
        availableScores.length > 0
          ? availableScores.reduce((sum, score) => sum + (score as number), 0) / availableScores.length
          : 0;

      return {
        name: tool,
        website: toolWebsites[tool] || "#",
        globalAverage,
        agentScore,
        editScore,
        autocompleteScore,
      };
    });

    // Sort by global average
    return leaderboardData.sort((a, b) => b.globalAverage - a.globalAverage);
  };

  const leaderboardData = generateLeaderboardData();

  // Format score for display
  const formatScore = (score: number | null) => {
    if (score === null) return "N/A";
    return (score * 100).toFixed(1) + "%";
  };

  return (
    <div className="mx-auto px-8 py-8">
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-6">About</h2>
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
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-6">Leaderboard</h2>
          <div className="overflow-x-auto">
            <table className="bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-center">Global Average</th>
                  <th className="py-3 px-6 text-center">Agent % Resolved</th>
                  <th className="py-3 px-6 text-center">Edit % Resolved</th>
                  <th className="py-3 px-6 text-center">Autocomplete % Resolved</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {leaderboardData.map((tool, index) => (
                  <tr key={index} className={index % 2 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-6 text-left">
                      <a 
                        href={tool.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 no-underline"
                      >
                        {tool.name}
                      </a>
                    </td>
                    <td className="py-3 px-6 text-center font-semibold">
                      {formatScore(tool.globalAverage)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatScore(tool.agentScore)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatScore(tool.editScore)}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {formatScore(tool.autocompleteScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard; 