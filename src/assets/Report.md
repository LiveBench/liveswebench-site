Introducing **LiveSWEBench**: a benchmark for AI coding assistants at varying levels of developer involvement.

LiveSWEBench answers the following questions:
1. Which assistant is most useful when operating with no developer involvement?
2. Which assistant is most useful when operating with some developer guidance?
3. Which assistant is most useful when operating with major developer involvement?

Our goal is to provide a useful aid for developers and organizations choosing which tools to incorporate into their workflows by evaluating tools in the most common use cases. 

Inspired by benchmarks like [LiveBench](https://livebench.ai), LiveSWEBench aims to prevent test set contamination and stay in line with developing agent capabilities by updating tasks over time. 
Our tasks are sourced from issue-pull request pairs from five real-world Github repositories. The initial results are based on 143 total tasks split among three task types, but our flexible and efficient collection process means we will be able to add new tasks or refresh existing ones in the future.
# Overview
LiveSWEBench consists of 3 task types, each of which evaluates AI coding assistants at a different level of developer involvement:
1. Fully agentic tasks, where assistants are given a real-world Github issue and asked to solve it entirely autonomously (similar to [SWE-Bench](https://www.swebench.com/))
2. Targeted edit tasks, where assistants are told the name of a file to modify and given a more specific but still high-level prompt about the change to make
3. Autocomplete tasks, where autocomplete assistants are very specifically prompted to generate code at a specific file location

These tasks were sourced using utilities from [SWE-Bench](https://www.swebench.com/) to find issue-merged pull request pairs from large, well-maintained Github repositories. Our tasks provide a comprehensive evaluation of coding assistants' performance in a variety of contexts. Specifically, our tasks are sourced from the following repositories:
- [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) (JavaScript, TypeScript, React) - an open-source full-stack web development and machine learning curriculum and learning platform
- [pytorch/torchtune](https://github.com/pytorch/torchtune) (Python, Pytorch) - a library for easily creating, training, and experimenting with large language models
- [wagtail/wagtail](https://github.com/wagtail/wagtail) (Python, Django, HTML, JavaScript) - a content management system providing extensive capability and fluid user experience
- [junit-team/junit5](https://github.com/junit-team/junit5) (Java) - one of the most popular frameworks for testing Java code
- [nlohmann/json](https://github.com/nlohmann/json) (C++) - a popular library for adding JSON support to C++

# Motivation
## AI Coding Agents
Discovery of emergent agentic and reasoning capabilities in language models (LMs) has enabled the creation of intelligent autonomous code-writing agents that are capable of making complex changes in large repositories based on a single prompt. AI-assistance is now available to developers at every level of granularity. At the highest level, agents can ingest vague, natural-language task prompts and fully autonomously explore the codebase, implement changes, and validate their solutions, with no developer involvement whatsoever. An agent can also be more specifically prompted by a developer to make changes in a single file or set of files; many tools allow the direct specification of which files should be edited, and a more direct prompt can produce increased accuracy in the agent's solution. This "chat-to-edit" functionality can be implemented either using a fully agentic framework, with constraints on the files to be edited, or by using techniques such as retrieval-augmented generation (RAG) to provide all necessary context upfront in the initial prompt. At the lowest level of autonomy come code autocomplete tools, which provide inline suggestions for the rest of the current line or next few lines being actively typed by the developer.

While the underlying LM may remain the same, many frameworks have emerged for developing AI agents, claiming to offer benefits over the others in terms of speed and reliability by implementing a unique approach to providing codebase context or tool use. 
<figure id="ai-coding-assistants" className="m-0 w-full">
<div className="overflow-x-auto w-full">
<table className="overflow-x-auto">
  <tr>
    <th>Tool Name</th>
    <th>Operation</th>
    <th>Agent</th>
    <th>Chat-To-Edit</th>
    <th>Autocomplete</th>
  </tr>
  <tr>
    <td><a href="https://cursor.com">Cursor</a></td>
    <td>IDE</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td><a href="https://codeium.com/windsurf">Windsurf</a></td>
    <td>IDE</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td><a href="https://github.com/features/copilot">Github Copilot</a></td>
    <td>IDE</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td><a href="https://docs.all-hands.dev/">OpenHands</a></td>
    <td>CLI</td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://aider.chat">Aider</a></td>
    <td>CLI</td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview">Claude Code</a></td>
    <td>CLI</td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td><a href="https://developers.google.com/gemini-code-assist/docs/overview">Gemini Code Assist</a></td>
    <td>IDE</td>
    <td></td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td><a href="https://aws.amazon.com/q/">Amazon Q</a></td>
    <td>IDE</td>
    <td>X</td>
    <td>X</td>
    <td>X</td>
  </tr>
  <tr>
    <td><a href="https://swe-agent.com/latest/">SWE-Agent</a></td>
    <td>CLI</td>
    <td>X</td>
    <td></td>
    <td></td>
  </tr>
</table>
</div>
<figcaption>Table 1: An overview of popular AI coding assistants, with their modes of operation and capabilities.</figcaption>

</figure>

[Table 1](#ai-coding-assistants) shows a sample of popular AI coding assistants and highlights which features each provides as well as its mode of operation (Integrated development environment (IDE) or command-line interface (CLI)). In general, command-line tools offer only fully agentic modes, while IDE-integration enables code autocomplete. More limited editing modes tend to be a stepping-stone to the development of fully agentic modes; for instance popular applications such as Cursor and Windsurf, which first developed the RAG-enabled edit modes, now default to their fully agentic modes. Because of this, and to ensure fairness when comparing to pure agent tools, we opted to use agent modes for evaluation of the targeted edits task.
## AI Benchmarking
A variety of evaluations have been developed to evaluate language models both on general-purpose capabilities and specifically on code generation ability. Benchmarks exist to evaluate LMs on reasoning, language understanding, math skills, and instruction following using diverse sets of tasks. For AI agents specifically, benchmarks have been developed to evaluate tool use capabilities and computer control.
More specific benchmarks also exist for LM code generation. [HumanEval](https://arxiv.org/abs/2107.03374) and [LiveCodeBench](https://arxiv.org/abs/2403.07974) have become standard evaluations for isolated code generation tasks. [Aider's polyglot benchmark](https://aider.chat/docs/leaderboards/) evaluates code-writing ability in multiple programming languages. SWE-Bench is the current standard evaluation for code writing in large, real-world repositories using agentic functionality. However, no existing benchmark evaluates AI coding assistants at varying levels of developing involvement in a variety of language and framework environments. In addition, no major benchmarks exist for AI autocomplete tools. LiveSWEBench therefore greatly extends the scope of evaluation compared to existing benchmarks and provides a more comprehensive view of agents' capabilities.

# Task Details
## Task Collection and Validation
Our task collection and validation process was inspired heavily by that of [SWE-Bench](https://www.swebench.com/). Tasks are constructed from issue-pull request (PR) pairs from real-world, widely used Github repositories with permissive licenses. We focus on widely used repositories to ensure that extensive documentation is likely present, robust unit test suites have been implemented, and code is sensibly organized and formatted. We do not, however, restrict to only Python codebases; instead, we include a diverse set of languages and frameworks such as C++, Java, Typescript, and Python. We filter by PRs where unit tests were modified, with the assumption that such tests were added or updated specifically to evaluate the success of the code in the PR in solving the issue. We also filtered by PRs from the past year to reduce the risk of contamination. GitHub scraping and processing utilities were adapted from the SWE-Bench codebase.

The extraction process provides us with the following items:
- The problem statement, the text of the original Github issue and comments made before the first PR commit
- The base commit hash prior to the PR
- The "test patch" containing the changes to test files made in the PR
- The "gold patch" containing the other changes to the codebase made in the PR. 

In all three task types, the overall goal is to use the AI assistant to reconstruct the gold patch, either entirely autonomously, by prompting for edits in specific files, or using autocomplete prompts at specific locations within files.

We apply the system of execution-based validation developed by SWE-Bench. Task instances were validated by running the repository test suite three times: first, with no changes applied, as a baseline; second, with only the test patch changes applied, as another baseline; and finally, with the test and gold patch changes applied, to validate the feasibility of the task. Manual inspection pruned infeasible tasks, where tests could not be run or there were not tests that switched from fail to pass when the gold patch was applied. This validation process left us with 53 agent tasks.

<div id="task_stats_container" className="flex flex-col lg:flex-row gap-3 justify-center items-center w-full">
<figure id="repo_stats">
	<div className="overflow-x-auto w-full">
	<table className="overflow-x-auto">
		<tr>
			<th>Name</th>
			<th># Agent Tasks</th>
			<th># Edit Tasks</th>
			<th># Autocomplete Tasks</th>
		</tr>
		<tr>
			<td>freeCodeCamp</td>
			<td>12</td>
			<td>12</td>
			<td>10</td>
		</tr>
		<tr>
			<td>torchtune</td>
			<td>11</td>
			<td>7</td>
			<td>7</td>
		</tr>
		<tr>
			<td>wagtail</td>
			<td>11</td>
			<td>9</td>
			<td>11</td>
		</tr>
		<tr>
			<td>junit5</td>
			<td>11</td>
			<td>9</td>
			<td>11</td>
		</tr>
		<tr>
			<td>json</td>
			<td>8</td>
			<td>6</td>
			<td>8</td>
		</tr>
	</table>
	</div>
	<figcaption>Table 2: The number of task instances of each type for each repository.</figcaption>
</figure>
<figure id="task_stats" className="m-0 w-full">
	<div className="overflow-x-auto w-full">
	<table className="overflow-x-auto w-full">
		<thead>
			<tr>
			<th></th>
			<th></th>
			<th>Minimum</th>
			<th>Median</th>
			<th>Mean</th>
			<th>Maximum</th>
			</tr>
		</thead>
		<tbody>
			<tr>
			<td rowspan="4">Agent</td>
			<td># Lines Changed</td>
			<td>2</td>
			<td>34</td>
			<td>157.02</td>
			<td>4644</td>
			</tr>
			<tr>
			<td># Files Changed</td>
			<td>1</td>
			<td>3</td>
			<td>22.83</td>
			<td>973</td>
			</tr>
			<tr>
			<td>Prompt Length (characters)</td>
			<td>93</td>
			<td>1610</td>
			<td>2506.15</td>
			<td>21521</td>
			</tr>
			<tr>
			<td># Edit Locations</td>
			<td>2</td>
			<td>6</td>
			<td>39.43</td>
			<td>1670</td>
			</tr>
			<tr>
			<td rowspan="4">Edit</td>
			<td># Lines Changed</td>
			<td>1</td>
			<td>10</td>
			<td>20.37</td>
			<td>137</td>
			</tr>
			<tr>
			<td># Other files in gold</td>
			<td>0</td>
			<td>2</td>
			<td>23.24</td>
			<td>972</td>
			</tr>
			<tr>
			<td>Prompt Length (characters)</td>
			<td>37</td>
			<td>130</td>
			<td>144.98</td>
			<td>322</td>
			</tr>
			<tr>
			<td># Edit Locations</td>
			<td>1</td>
			<td>2</td>
			<td>2.39</td>
			<td>4</td>
			</tr>
			<tr>
			<td rowspan="5">Autocomplete</td>
			<td># Hunks</td>
			<td>1</td>
			<td>2</td>
			<td>3.27</td>
			<td>16</td>
			</tr>
			<tr>
			<td># Additions Per Hunk</td>
			<td>1</td>
			<td>1</td>
			<td>2.3</td>
			<td>8</td>
			</tr>
			<tr>
			<td># Files Modified</td>
			<td>1</td>
			<td>1</td>
			<td>1.9</td>
			<td>8</td>
			</tr>
			<tr>
			<td>Prompt Length (characters)</td>
			<td>145</td>
			<td>312.71</td>
			<td>354.74</td>
			<td>1242</td>
			</tr>
			<tr>
			<td># Edit Locations</td>
			<td>1</td>
			<td>2</td>
			<td>4.07</td>
			<td>22</td>
			</tr>
			<tr>
			<td rowspan="2">Codebase</td>
			<td># Non-test code files</td>
			<td>261</td>
			<td>1516</td>
			<td>1552.4</td>
			<td>3867</td>
			</tr>
			<tr>
			<td># Non-test code lines</td>
			<td>52386</td>
			<td>130097</td>
			<td>208477.2</td>
			<td>493985</td>
			</tr>
		</tbody>
	</table>
	</div>
	<figcaption>Table 3: Statistics for each task type, including the minimum, median, mean, and maximum values for various metrics. Edit locations are defined by the function/class/etc name shown in patch hunk headers.</figcaption>
</figure>
</div>

## Task Evaluation
Given a solution patch, either the original from the GitHub pull request or one generated by an agent, the evaluation process for all three task types is mostly similar:

1. Clone the repository and checkout the pre-PR commit
2. Install dependencies
3. Apply the test file patch
4. Apply the solution patch, using `git apply`
	 - If `git apply` fails, we use `git apply --reject` to apply however many hunks from the solution patch can be applied successfully. Generally, the original apply only fails if the solution patch contains modifications to test code which conflict with the changes from the test patch.
5. Run repository tests
	- When possible, for efficiency, we filter to only run the tests modified in the test patch
6. Inspect test logs, comparing with the baseline results to determine task success
A task is considered resolve when the set of tests passed and failed by the solution patch run matches those from the gold patch run. The tasks differ only in the process of creating the solution patch. The remainder of this section details the inference process for each of the tasks.

It must be noted that repository dependencies are not installed prior to performing inference due to capacity and time constraints. This means that agents were not always able to test their code before submitting their solutions (though some agents were, in fact, able to successfully install dependencies and run tests themselves). In a future update, we plan to implement repository- or instance-level container images so that all agents will be able to test and iterate upon their solutions before submission.
### Agent Task
The agent task evaluates the capacity of AI coding agents to operate with little to no developer involvement. Agents are provided with the raw text of a Github issue and instructed to solve it. No codebase context is provided and no indications are given as to what files may be relevant to the issue, aside from those discussed in the issue text or comments themselves. This means that the agent is required to explore the codebase autonomously to discover relevant context, pinpoint the source of the issue, and come up with a solution. The task therefore serves as an evaluation of the agent framework and scaffolding, including its context management and tool usage.

The inference process is as follows:

1. Setup the repository in its baseline state, prior to the creation of the task PR
2. Activate the tool being evaluated with its current working directory set to the repository location
3. Prompt the tool with the text of the Github issue
4. Accept all suggestions, allow all terminal commands, etc, until the tool finishes generating
5. Generate a patch file record of the suggested changes using `git diff`
### Targeted Edits Task
The targeted editing task evaluates the ability of the assistant to generate code changes when given a specific edit prompt in a single file. This simulates a common use case for AI assistants (especially prior to the development of agentic functionality) wherein a developer, working on a broader issue, can summarize the needed local changes into a prompt for the assistant. The prompts for this task are more similar to what would be included in a pull request description: a high level, few sentence explanation of the changes. The assistant is instructed with the name of the file to edit; however, it is not told the names of other files that may be relevant for understanding the prompt or generating the edits. This task therefore still relies on some level of agentic capability or integration of broader repository context into the prompt.

Task instances for this category were extracted from the agentic tasks. More specifically, we selected one file from each task's gold patch where the changes to that file could reasonably be summarized in a few sentences. We filtered for files containing actual code changes; i.e. not only changes to imports or documentation. From the original 53 task instances, our filtering left us with 49 edit task instances. We then used an LM (Claude 3.5 Sonnet) to concisely summarize the changes made to the edit file. In fact, many agent task instances had multiple files that could qualify as edit tasks. In the future, we may expand this task category to include all possible task instances.

The inference process for this task type is in general very similar to that of the agentic task, the main difference being the more specific prompt and the inclusion of the edit file name as context:

1. Setup the repository in baseline state
2. Apply the gold patch, aside from the changes made to the edit file
	- In most cases, the changes made to the edit file build upon changes made to other files in the same PR. It is therefore necessary for the agent to be aware of the other changes being made so their changes can work correctly.
3. Activate the tool and prompt with the edit prompt and name of the edit file (selected as context, in tools that support such selection)
4. Accept all suggestions, allow all terminal commands, etc, until generation is finished
5. Revert the application of the gold patch and generate a solution patch file using `git diff`
During evaluation, the partial gold patch is applied prior to applying the agent's solution patch (i.e. prior to [step 4](#task-evaluation)).
### Autocomplete Task
The autocomplete task evaluates the utility of inline completions in making small-scale changes to repository code. The difficulty of this task comes from the dependence of the changes on code from the rest of the current file or other files in the repository. This task simulates the most involved form of AI-assisted development, where a developer's code-writing ability is directly supplemented by the completion suggestions.

Task instances for this category were similarly extracted as the edit tasks, the major difference being the localization of changes to individual patch hunks rather than entire files. Specifically, patch hunks were filtered to remove any that did not include code changes, had non-contiguous additions, or more than 8 line additions, leaving only sets of few-line changes. Each hunk was then passed into an LM (Claude 3.5 Sonnet) to generate a specific description of the changes. Hunks and their prompts from the same original task were then grouped back together to create the task instances. This process left us with 41 autocomplete tasks with a total of 135 hunks to complete.

The inference process is as follows:

1. Setup the repository in baseline state
2. Apply the gold patch, aside from the hunks to be completed
3. Activate the tool and open the relevant files
4. For each hunk to be completed:
	1. Copy the generated autocomplete prompt and paste it as a comment in the line prior to where the additions should be
	2. Press enter and tab until suggestions appear
	3. While there are still still completion suggestions (up to a maximum of 5 acceptances), press tab to accept each suggestion and then enter to move to the next line
5. Once all hunks have been processed, revert the gold patch application and generate the solution patch
During evaluation, the gold patch (stripped of the autocomplete hunks) is applied prior to applying the solution patch.

In some cases, autocomplete models get stuck in loops of generating the same suggestions repeatedly. When this occurred, we kept only the first repetition of the suggestions.
### Tool Notes
Tools were generally setup and evaluated using default settings, with "agent" mode selected in chat where appropriate. Aside from Amazon Q, which does not allow users to choose the model to be used, all tools were evaluated with Claude 3.7 Sonnet as the LM backend. This consistency ensures that LiveSWEBench is a valid evaluation of the actual agentic scaffolding, rather than the underlying LM itself. The model was selected as the highest-performing model with broad support among agent tools.

Github Copilot was evaluated using a pre-release build in Visual Studio Code - Insiders, to enable the agent functionality. The autocomplete model was left as the default; in the future, we may re-evaluate this task using the newer GPT-4O autocomplete preview.

Agent and edit task patches were collected for all tools as of March 14th, 2025. Autocomplete evaluation was performed during the week of March 17th, 2025.
# Results and Discussion
<figure id="full_results_graph" className="flex flex-col items-center m-0 w-full">
	<img src="/full_graph.png" alt="Resolution scores by tool and task type" width="100%" height="100%" className="object-contain lg:w-1/2 xxl:w-1/3"/>
	<figcaption>Figure 1: A graph of resolution scores for each evaluated tool, split among the three task types</figcaption>
</figure>
<div id="results_container" className="flex flex-col lg:flex-row gap-3 justify-center items-center w-full">
<figure id="score_by_repo" className="flex flex-col items-center m-0 w-full">
	<img src="/radar.png" alt="Task resolution rates by repository" width="100%" height="100%" className="object-contain lg:w-1/2 xxl:w-1/3"/>
	<figcaption>Figure 2: A radar chart of task resolution rates by repository. Task types are overlaid on top of each other.</figcaption>
</figure>
</div>

[Figure 1](#full_results_graph) shows task resolution rates for each evaluated tool, split among the three task types. We see that the top several scores on the agent task are quite similar, within a few percent of each other. The edit task is almost universally easier. This gradient is unsurprising, as the edit task is much more constrained in scope than the agent task, with detailed, direct prompts of what must be done to resolve the issue and changes made only to a single file or lines of code at a time. Overall, we can conclude that SWE-Agent and OpenHands are currently the most capable agent frameworks, with Windsurf and Cursor not far behind. Aider has the worst performance on the agent task of all tools evaluated with Claude 3.7 Sonnet as the model, but makes up partially for this with its edit task performance. Amazon Q lags behind all other tools, which may in large part be due to its underlying model being less capable.

[Figure 2](#score_by_repo) provides a more detailed view of task performance by repository. We can see that Aider's deficiency on the agent task comes in large part from its performance on the json repository. This repository features very large files, which it seems Aider has difficulty handling; the patches generated by Aider for this repository often only contained modifications to irrelevant files. Amazon Q also struggled greatly with this repository. Overall, we find that Github Copilot, SWE-Agent, and OpenHands had the most consistent performance across all repositories. [Figure 2](#score_by_repo) also reveals the general bias in scores towards the Python repositories (torchtune and wagtail).

It is interesting to analyze the degree of improvement between the agent and edit tasks is not consistent among the tools. While the top six agent scores are within a few percent of each other, the edit task results had greater variance. The general equality among assistants for the agent task is likely attributable to the same model being used and (in general) the same tools being provided as part of the agent framework, e.g. read file, edit file, search directory, run bash command. When given complete autonomy and a detailed, high-level description of the task, it seems the raw model intelligence may be the most important factor. Since the agent task provides no hints as to where changes need to be made, exploration of the codebase is also a given. The edit task's specification of the file to be edited may appear to make this task much easier, but the changes needed may still depend on context from other files. It's likely that the agents who saw less improvement between the agent and edit tasks were less likely to still explore the codebase when prompted with the specific edit file; in contrast, Aider, which always automatically explores to generate a repository map at the beginning of execution, saw the greatest improvement of all between the agent and edit tasks. The edit task also does not directly inform the agent of recent changes made to the codebase as part of the partially applied PR. Future work could investigate the impact of the context and information directly provided as part of the edit task prompt. Overall, we see that only Aider and OpenHands had universally improved performance between the agent and edit tasks, though other agents tended to only perform worse in one repository for the edit task.

The autocomplete task proved more difficult than expected. Most likely, this difficulty comes from the generally lower intelligence capacity of autocomplete models, as they are much more optimized for speed of generations. We found that the largest challenge for the autocomplete task was knowing when to stop; in many cases, the first few suggestions from the model would constitute a complete and correct solution, but the model would go on to suggest additional breaking code that would result in task failure.

Our autocomplete evaluation is purely an evaluation of the underlying model used. The task format does not engage with certain additional features often included as part of autocomplete functionality, such as next edit prediction, where a tool may save time by predicting future edits in other parts of the same file. The constrained nature of this autocomplete task means its results are not a fully representative view of the average developer experience of using these tools. A survey measuring actual keystroke reduction as developers complete tasks using different autocomplete tools could be an illuminating additional view of the state of AI autocomplete.

# Limitations and Future Work

The goal of LiveSWEBench is to remain at the forefront of agent development by integrating new tasks and improving evaluation methods over time. Most urgently, we plan to rework our inference and evaluation harnesses to better make use of containerization to ensure consistent evaluations. We also plan to re-evaluate agents in environments where dependencies are already installed to evaluate agents' ability to test their code prior to submission. Finally, we wish to expand LiveSWEBench to encompass additional task types, such as greenfield project setup and frontend code generation based on design screenshots.