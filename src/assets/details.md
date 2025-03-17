Introducing **LiveSWEBench**: a benchmark for AI coding assistants at varying levels of developer involvement.

LiveSWEBench answers the following questions:
1. Which tool is most useful when operating with no developer involvement?
2. Which tool is most useful when operating with some developer guidance?
3. Which tool is most useful when operating with major developer involvement?

Inspired by LiveBench, LiveSWEBench aims to prevent test set contamination and stay in line with developing agent capabilities by updating tasks over time. Our initial release contains 143 tasks sourced from issue-pull request pairs from five real-world Github repositories.

Our results provide an interesting analysis of the current state of AI agent development and can serve as a useful aid for developers choosing what tools to incorporate into their workflow.
# Overview
LiveSWEBench consists of 3 task types, each of which evaluates AI coding assistants at a different level of developer involvement:
1. Fully agentic tasks, where assistants are given a real-world Github issue and asked to solve it (similar to SWE-Bench)
2. Targeted edit tasks, where assistants are told the name of a file to modify and given a more specific but still high-level prompt about the change to make
3. Autocomplete tasks, where autocomplete assistants are very specifically prompted to generate code at a specific file location

These tasks were sourced using utilities from SWE-Bench to find issue-merged pull request pairs from large, well-maintained Github repositories. Our tasks span Python, C++, Java, Javascript, and Typescript, using frameworks such as Pytorch, Django, Express, and React, providing a comprehensive evaluation of coding assistants in a variety of contexts. Specifically, our tasks are sourced from
- freeCodeCamp/freeCodeCamp - JavaScript, TypeScript, React
- pytorch/torchtune - Python, Pytorch
- wagtail/wagtail - Python, Django, HTML, JavaScript
- junit-team/junit5 - Java
- nlohmann/json - C++
# Motivation
Discovery of emergent agentic and reasoning capabilities in LLM has further enabled the creation of intelligent autonomous code-writing agents that are capable of making complex changes in large repositories based on a single prompt. AI-assistance is now available to developers at every level of granularity: at the highest level, raw user issues can be submitted for agentic solving; with more targeted prompting an agent can make accurate and targeted edits in individual files; and LLM-powered autocomplete tools can save time as developers write code manually. Many tools claim to provide powerful assistance at all these levels; however, there has not yet been a thorough, objective evaluation of these capabilties.
- talk about swebench and other benchmarks
# Details on Tasks
Aside from Amazon Q, which does not allow users to choose the model to be used, all tools were evaluated with Claude 3.7 Sonnet as the LLM backend. This consistency ensures that LiveSWEBench is an evaluation of the agentic scaffolding, rather than the underlying LLM itself.

## Task Collection and Validation
We mirror the task collection process of SWE-Bench. 

As in SWE-Bench, our tasks are constructed from issue-pull request (PR) pairs on real-world, widely used Github repositories. Unlike SWE-Bench, however, we do not restrict to only Python codebases; instead, we include a diverse set of languages and frameworks such as C++, Java, Typescript, and Python. We filter by PRs where unit tests were modified, with the assumption that such tests were added or updated specifically to evaluate the success of the code in the PR in solving the issue. 

After tasks were collected, they were validated by running the repository test suite three times: first, without either the test file or code file changes applied, as a baseline; second, with only the test file changes applied, as another baseline; and finally, with the test and code changes applied, to validate the feasibility of the task. Manual inspection pruned infeasible tasks, where there were not tests that switched from fail to pass when the gold patch was applied. This validation process left us with 53 agent tasks.
## Task Evaluation
### Agent Task
The agent task evaluates the capacity of AI coding agents to operate with little to no developer involvement. To that end, we provide the agent with the text of a Github issue from a public, widely-used repository, and evaluate its proposed solution using unit and integration tests from the repository. As mentioned previously, the issue-PR pairs all contain modifications to the repository unit tests that evaluate whether the issue has been successfully resolved; these unit tests provide a useful metric for judging the quality of the agents' solutions.

The agent tasks provide no suggestions to the agent as to what parts of the codebase are relevant or what specific changes should be made to resolve the issue, aside from those that might be contained in the original issue description or comments. This means that the agent solving the task is required to explore the codebase autonomously to discover relevant context, pinpoint the source of the issue, and come up with a solution. The task therefore serves as an evaluation of the agent framework and scaffolding, including its context management and tool usage.

The inference process is as follows:
4. Setup the repository in its baseline state, prior to the creation of the task PR
5. Activate the tool being evaluated with its current working directory set to the repository location
6. Prompt the tool with the text of the Github issue
7. Accept all suggestions, allow all terminal commands, etc, until the tool finishes generating
8. Generate a patch file record of the suggested changes using `git diff`

The inference process is as follows:
9. Setup the repository in the baseline state
10. Apply the test patch, the set of test updates from the original PR
11. Apply the patch generated by the tool, using `git apply` 
	1. We use `git apply --reject` so that patches with partially invalid or conflicting content (e.g. patches where unit tests are modified) are applied to the fullest extent that they can be.
12. Run repository unit tests using the appropriate framework
13. Inspect the testing log and compare to the test run with the gold patch to determine the score

### Targeted Edits Task
The targeted editing task evaluates the ability of the AI coding assistant to generate code changes when given a specific edit prompt in a single file. This simulates a common use case for AI assistants (especially prior to the development of agentic functionality) wherein a developer, working on a broader issue, can summarize the needed changes into a prompt for the assistant. The prompts for this task are more similar to what would be included in a pull request description: a high level, few sentence explanation of the changes to be made. The assistant is instructed with the name of the file to edit; however, it is not told the names of other files that may be relevant for understanding the prompt or generating the edits. This task therefore still relies on some level of agentic capability or integration of broader repository context into the prompt.

Task instances for this category were extracted from the agentic tasks. More specifically, we selected one file from each task's gold patch where the changes to that file could reasonably be summarized in a few sentences. We filtered for files containing actual code changes; i.e. not only changes to imports or documentation. From the original 53 task instances, our filtering left us with 49 edit task instances. We then used an LLM (Claude 3.5 Sonnet) to concisely summarize the changes made to the edit file.

The evaluation process for this task type is in general very similar to that of the agentic task, the main difference being the more specific prompt and the inclusion of the edit file name as context. In tools where it is possible, the filename was selected as context to include; in others, the filename was simply included in the prompt.

### Autocomplete Task

# Future Work
