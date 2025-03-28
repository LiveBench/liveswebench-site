import agentCsvData from '../assets/agent_results.csv?raw';
import editCsvData from '../assets/edit_results.csv?raw';
import promptedAutocompleteCsvData from '../assets/prompted_autocomplete_results.csv?raw';
import inlineAutocompleteCsvData from '../assets/inline_autocomplete_results.csv?raw';
import LeaderboardTable from '../components/LeaderboardTable';
import { useState } from 'react';

const Leaderboard = () => {
  const [sortBy, setSortBy] = useState<string>('global');
  const [sortDirection, setSortDirection] = useState<string>('desc');
  const [filters, setFilters] = useState({
    agent: true,
    edit: true,
    prompted_autocomplete: false,
    inline_autocomplete: false
  });

  // Define task types
  const taskTypes = [
    { key: 'agent', label: 'Agentic Programming' },
    { key: 'edit', label: 'Targeted Editing' },
    { key: 'prompted_autocomplete', label: 'Prompted Autocomplete' },
    { key: 'inline_autocomplete', label: 'Inline Autocomplete' }
  ];

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
  const promptedAutocompleteData = parseCSV(promptedAutocompleteCsvData);
  const inlineAutocompleteData = parseCSV(inlineAutocompleteCsvData);

  // Generate leaderboard data
  const generateLeaderboardData = () => {
    const allTools = new Set([
      ...agentData.map((item) => item.Tool),
      ...editData.map((item) => item.Tool),
      ...promptedAutocompleteData.map((item) => item.Tool),
      ...inlineAutocompleteData.map((item) => item.Tool),
    ]);

    const leaderboardData = Array.from(allTools).map((tool) => {
      const agentScore = agentData.find((item) => item.Tool === tool)?.Score || null;
      const editScore = editData.find((item) => item.Tool === tool)?.Score || null;
      const promptedAutocompleteScore = promptedAutocompleteData.find((item) => item.Tool === tool)?.Score || null;
      const inlineAutocompleteScore = inlineAutocompleteData.find((item) => item.Tool === tool)?.Score || null;

      return {
        tool: {
          name: tool,
          website: toolWebsites[tool] || "#",
        },
        agent: agentScore,
        edit: editScore,
        prompted_autocomplete: promptedAutocompleteScore,
        inline_autocomplete: inlineAutocompleteScore,
      };
    });

    // Sort by global average
    return leaderboardData;
  };

  const leaderboardData = generateLeaderboardData();

  const handleUpdateSortBy = (column: string) => {
    setSortBy(column);
  };

  const handleUpdateSortDirection = (direction: string) => {
    setSortDirection(direction);
  };

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Get active filter columns based on filter state
  const activeFilterColumns = Object.entries(filters)
    .filter(([_, isActive]) => isActive)
    .map(([column]) => column);

  return (
    <div className="mx-auto md:px-8 py-8">
      <section className="mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-6 text-center">About</h2>
          <p className="text-gray-700 mb-3">
            LiveSWEBench is a benchmark designed to evaluate the software engineering capabilities of AI agent applications.
            We aim to answer the following questions:
          </p>
          <ul>
            <li>How skilled are AI coding assistants when operating fully autonomously?</li>
            <li>How effective are AI coding assistants at operating under developer instruction?</li>
            <li>How useful are AI coding assistants at supplementing developer code writing?</li>
          </ul>
          <p className="text-gray-700 mb-3">
            To answer these questions, we evaluate the performance of each assistant on three task types:
          </p>
          <ul>
            <li>Agentic Programming, where the assistant is given a high-level task and must complete it fully autonomously.</li>
            <li>Targeted editing, where the assistant is given a more direct instruction and file to edit (still operating as an agent).</li>
            <li>Autocompletion, including both prompted completions (filling in code snippets) and inline completions (generating code as you type).</li>
          </ul>
          <p className="text-gray-700">
            Our task collection and evaluation framework is heavily inspired by that of <a className="text-blue-600" href="https://www.swebench.com/">SWE-Bench</a>.
          </p>
          <p className="text-gray-700">
            We plan to evaluate release new tasks and evaluate more tools regularly to keep up with the latest developments and ensure the benchmark remains contamination-free.
          </p>
        </div>
      </section>

      <section>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-hidden">
          <h2 className="text-3xl font-bold mb-6 text-center">Leaderboard</h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 sm:space-x-6">
            {taskTypes.map(task => (
              <div key={task.key} className="flex items-center w-full max-w-[200px] sm:w-auto justify-start">
                <input
                  type="checkbox"
                  id={`${task.key}-filter`}
                  checked={filters[task.key as keyof typeof filters]}
                  onChange={() => handleFilterChange(task.key as keyof typeof filters)}
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor={`${task.key}-filter`} className="text-gray-700">{task.label}</label>
              </div>
            ))}
          </div>
            
          <LeaderboardTable 
            data={leaderboardData} 
            sortBy={sortBy} 
            sortDirection={sortDirection} 
            filterColumns={activeFilterColumns} 
            updateSortBy={handleUpdateSortBy}
            updateSortDirection={handleUpdateSortDirection}
          />
          <p className="text-gray-700">*Github Copilot was evaluated using the pre-release in VSCode Insiders to enable the agent mode.</p>
          <p className="text-gray-700">Aside from Amazon Q, all tools were evaluated using Claude 3.7 Sonnet as the LLM.</p>
        </div>
      </section>
    </div>
  );
};

export default Leaderboard; 