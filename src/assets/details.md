Introducing **LiveSWEBench**: a benchmark for AI coding assistants at varying levels of developer involvement.

LiveSWEBench answers the following questions:
1. Which tool is most useful when operating with no developer involvement?
2. Which tool is most useful when operating with some developer guidance?
3. Which tool is most useful when operating with major developer involvement?

Inspired by contamination-limited benchmarks like [LiveBench](https://livebench.ai), LiveSWEBench aims to prevent test set contamination and stay in line with developing agent capabilities by updating tasks over time. Our initial release contains 143 tasks sourced from issue-pull request pairs from five real-world Github repositories.

Our results provide an analysis of the current state of AI agent development and can serve as a useful aid for developers choosing what tools to incorporate into their workflow.
# Overview
LiveSWEBench consists of 3 task types, each of which evaluates AI coding assistants at a different level of developer involvement:
1. Fully agentic tasks, where assistants are given a real-world Github issue and asked to solve it (similar to SWE-Bench)
2. Targeted edit tasks, where assistants are told the name of a file to modify and given a more specific but still high-level prompt about the change to make
3. Autocomplete tasks, where autocomplete assistants are very specifically prompted to generate code at a specific file location

These tasks were sourced using utilities from [SWE-Bench](https://www.swebench.com/) to find issue-merged pull request pairs from large, well-maintained Github repositories. Our tasks span Python, C++, Java, Javascript, and Typescript, using frameworks such as Pytorch, Django, Express, and React, providing a comprehensive evaluation of coding assistants in a variety of contexts. Specifically, our tasks are sourced from
- [freeCodeCamp/freeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp) - JavaScript, TypeScript, React
- [pytorch/torchtune](https://github.com/pytorch/torchtune) - Python, Pytorch
- [wagtail/wagtail](https://github.com/wagtail/wagtail) - Python, Django, HTML, JavaScript
- [junit-team/junit5](https://github.com/junit-team/junit5) - Java
- [nlohmann/json](https://github.com/nlohmann/json) - C++

# Motivation
## AI Coding Agents
Discovery of emergent agentic and reasoning capabilities in language models (LMs) has further enabled the creation of intelligent autonomous code-writing agents that are capable of making complex changes in large repositories based on a single prompt. AI-assistance is now available to developers at every level of granularity. At the highest level, agents can ingest vague, natural-language task prompts and fully autonomously explore the codebase, implement changes, and validate their solutions to solve tasks, with no developer involvement whatsoever. While the underlying LM may remain the same, many frameworks have emerged for developing AI agents, claiming to offer benefits over the others in terms of speed and reliability by implementing a unique approach to providing codebase context or tool use. More commonly, an agent can be more specifically prompted by a developer to make changes in a single file or set of files; many tools allow the direct specification of which files should be edited, and a more direct prompt can produce increased accuracy in the agent's solution. This "chat-to-edit" functionality can be implemented either using a fully agentic framework, with constraints on the files to be edited, or by using techniques such as retrieval-augmented generation (RAG) to provide all necessary context upfront in the initial prompt. At the lowest level of autonomy come code autocomplete tools, which provide inline suggestions for the rest of the current line or next few lines being actively typed by the developer.

<figure id="ai-coding-assistants">

| Tool Name          | Operation | Agent | Chat-To-Edit | Autocomplete |
| ------------------ | --------- | ----- | ------------ | ------------ |
| [Cursor](https://cursor.com)             | IDE       | X     | X            | X            |
| [Windsurf](https://codeium.com/windsurf)       | IDE       | X     | X            | X            |
| [Github Copilot](https://github.com/features/copilot)     | IDE       | X     | X            | X            |
| [OpenHands](https://docs.all-hands.dev/)          | CLI       | X     |              |              |
| [Aider](https://aider.chat)              | CLI       | X     |              |              |
| [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)        | CLI       | X     |              |              |
| [Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview) | IDE       |       | X            | X            |
| [Amazon Q](https://aws.amazon.com/q/)           | IDE       | X     | X            | X            |
| [SWE-Agent](https://swe-agent.com/latest/)          | CLI       | X     |              |              |

<figcaption>Table 1: An overview of popular AI coding assistants, with their modes of operation and capabilities.</figcaption>

</figure>

A wide variety of applications have emerged claiming to provide some or all of this functionality. [Table 1](#ai-coding-assistants) shows a sample of such applications and highlights which features each provides as well as its mode of operation (IDE or command-line interface (CLI)). In general, command-line tools offer only fully agentic modes, while IDE-integration enables code autocomplete. More limited editing modes tend to be a stepping-stone to the development of fully agentic modes; for instance popular applications such as Cursor and Windsurf, which first developed the RAG-enabled edit modes, now default to their fully agentic modes. Because of this, and to ensure fairness when comparing to pure agent tools, we opted to use agent modes for evaluation of the targeted edits task.
## AI Benchmarking
A variety of evaluations have been developed to evaluate language models both on general-purpose capabilities and specifically on code generation ability. Benchmarks exist to evaluate LMs on reasoning, language understanding, math skills, and instruction following using diverse sets of tasks. For AI agents specifically, benchmarks have been developed to evaluate tool use capabilities and computer control.
Popular evaluations for code generation include HumanEval and LiveCodeBench. These evaluations tend to use isolated coding challenges rather than situating tasks within broader codebase contexts. The primary evaluation of more complex edits to be made in large, real-world repositories is SWE-Bench. SWE-Bench, however, focuses mainly on non-interactive agents and only evaluates effectiveness within Python codebases, while LiveSWEBench evaluates multiple agent types and a greater variety of coding languages and frameworks. In addition, no significant benchmark yet exists to comprehensively evaluate AI autocomplete tools. LiveSWEBench therefore greatly extends the scope of evaluation compared to existing benchmarks and provides a more comprehensive view of agents' capabilities.

# Details on Tasks
## Task Collection and Validation
Our task collection and validation process was inspired heavily by that of SWE-Bench. Tasks are constructed from issue-pull request (PR) pairs from real-world, widely used Github repositories with permissive licenses. We focus on widely used licenses to ensure that extensive documentation is likely present, robust unit test suites have been implemented, and code is sensibly organized and formatted. We do not, however, restrict to only Python codebases; instead, we include a diverse set of languages and frameworks such as C++, Java, Typescript, and Python. We filter by PRs where unit tests were modified, with the assumption that such tests were added or updated specifically to evaluate the success of the code in the PR in solving the issue. We also filtered by PRs from the past year to reduce the risk of contamination. GitHub scraping and processing utilities were taken with slight modifications from SWE-Bench.

We additionally apply the system of execution-based validation developed by SWE-Bench. After tasks were collected, they were validated by running the repository test suite three times: first, without either the test file or code file changes applied, as a baseline; second, with only the test file changes applied, as another baseline; and finally, with the test and solution code changes applied, to validate the feasibility of the task. Manual inspection pruned infeasible tasks, where tests could not be run or there were not tests that switched from fail to pass when the solution patch was applied. This validation process left us with 53 agent tasks.
## Task Evaluation
Given a solution patch, either the original from the GitHub pull request or one generated by an agent, the evaluation process for all three task types is mostly similar:
1. Clone the repository and checkout the pre-PR commit
2. Install dependencies
3. Apply the test file patch
4. Apply the solution patch, using `git apply`
	1. If `git apply` does not work, we use `git apply --reject` to apply however many hunks from the solution patch can be applied successfully. Generally, the original apply only fails if the solution patch contains modifications to test code, which we would not want to apply as they would overwrite the test changes from the test patch.
5. Run repository tests, filtering when possible to only the test files modified in the test patch
6. Inspect test logs, comparing with the baseline results to determine task success
The tasks differ, then, only in the process of creating the solution patch. The remainder of this section details the inference process for each of the tasks.

It must be noted that repository dependencies are not installed prior to performing inference due to capacity and time constraints. This means that agents were not always able to test their code before submitting their solutions, though some agents were, in fact, able to successfully install dependencies and run tests themselves. In a future update, we plan to implement repository- or instance-level container images so that all agents will be able to test and iterate upon their solutions before submission.
### Agent Task
The agent task evaluates the capacity of AI coding agents to operate with little to no developer involvement. In this task, then, agents are provided with the raw text of a Github issue (and comments made on that issue prior to the creation of the first PR commit) and instructed to solve it. No codebase context is provided and no indications are given as to what files may be relevant to the issue, aside from those discussed in the issue text or comments themselves. This means that the agent solving the task is required to explore the codebase autonomously to discover relevant context, pinpoint the source of the issue, and come up with a solution. The task therefore serves as an evaluation of the agent framework and scaffolding, including its context management and tool usage.

The inference process is as follows:
1. Setup the repository in its baseline state, prior to the creation of the task PR
2. Activate the tool being evaluated with its current working directory set to the repository location
3. Prompt the tool with the text of the Github issue
4. Accept all suggestions, allow all terminal commands, etc, until the tool finishes generating
5. Generate a patch file record of the suggested changes using `git diff`
### Targeted Edits Task
The targeted editing task evaluates the ability of the AI coding assistant to generate code changes when given a specific edit prompt in a single file. This simulates a common use case for AI assistants (especially prior to the development of agentic functionality) wherein a developer, working on a broader issue, can summarize the needed changes into a prompt for the assistant. The prompts for this task are more similar to what would be included in a pull request description: a high level, few sentence explanation of the changes to be made. The assistant is instructed with the name of the file to edit; however, it is not told the names of other files that may be relevant for understanding the prompt or generating the edits. This task therefore still relies on some level of agentic capability or integration of broader repository context into the prompt.

Task instances for this category were extracted from the agentic tasks. More specifically, we selected one file from each task's gold patch where the changes to that file could reasonably be summarized in a few sentences. We filtered for files containing actual code changes; i.e. not only changes to imports or documentation. From the original 53 task instances, our filtering left us with 49 edit task instances. We then used an LM (Claude 3.5 Sonnet) to concisely summarize the changes made to the edit file.

The inference process for this task type is in general very similar to that of the agentic task, the main difference being the more specific prompt and the inclusion of the edit file name as context:
1. Setup the repository in baseline state
2. Apply the gold patch, aside from the changes made to the edit file
3. Activate the tool and prompt with the edit prompt and name of the edit file (selected as context, in tools that support such selection)
4. Accept all suggestions, allow all terminal commands, etc, until generation is finished
5. Revert the application of the gold patch and generate a solution patch file using `git diff`
During evaluation, then, the partial gold patch is similarly applied prior to applying the agent's solution patch (i.e. prior to step 4).
### Autocomplete Task
The autocomplete task evaluates the utility of inline completions in making small-scale changes to repository code. The complexity of this task comes from the dependence of the changes on code from the rest of the current file or other files in the repository. This task simulates the most involved form of AI-assisted development, where a developer's code-writing ability is supplemented by the completion suggestions.

Task instances for this category were similarly extracted as the edit tasks, the major difference being the localization of changes to individual patch hunks rather than entire files. Specifically, patch hunks were filtered to remove any that did not include code changes, had non-contiguous additions, or more than 8 line additions, leaving only sets of few-line changes. Each hunk was then passed into an LM (Claude 3.5 Sonnet) to generate a specific description of the changes. Hunks from the same original task were grouped together. This process left us with 41 autocomplete task with a total of 135 hunks to complete.

The inference process, then, is as follows:
1. Setup the repository in baseline state
2. Apply the gold patch, aside from the hunks to be completed
3. Activate the tool and open the relevant files
4. For each hunk to be completed:
	1. Copy the generated autocomplete prompt and paste it as a comment in the line prior to where the additions should be
	2. Press enter and tab until suggestions appear
	3. While there are still still completion suggestions (up to a maximum of 5 acceptances), press tab to accept each suggestion and then enter to move to the next line
5. Once all hunks have been processed, revert the gold patch application and generate the solution patch
During evaluation, the gold patch (stripped of the autocomplete hunks) is applied prior to applying the solution patch.
### Tool Notes
Tools were generally setup and evaluated using default settings, with "agent" mode selected in chat where appropriate. Aside from Amazon Q, which does not allow users to choose the model to be used, all tools were evaluated with Claude 3.7 Sonnet as the LM backend. This consistency ensures that LiveSWEBench is an evaluation of the agentic scaffolding, rather than the underlying LM itself. The model was selected as the highest-performing model with broad support among agent tools.

Github Copilot was evaluated using a pre-release build in Visual Studio Code - Insiders, to enable the agent functionality. In addition, GPT-4O was selected as the autocomplete model.

Agent and edit task patches were collected for all tools as of March 14th, 2025. Autocomplete evaluation was performed during the week of March 17th, 2025.
# Limitations
The goal of LiveSWEBench is to remain at the forefront of agent development by integrating new tasks and improving evaluation methods over time. Most urgently, we plan to rework our inference and evaluation harnesses to better make use of containerization to ensure consistent evaluations. We also plan to re-evaluate agents in environments where dependencies are already installed to evaluate agents' ability to test their code prior to submission.