# Find or invent a programming language or a family of programming languages
## Goals
- Programming language for general purposes.
- Allows to program reactive processes (can react to stimuli from the environment and to the amount of time that computations take to complete).
- Suitable for the Web (front end and back end).
- Purely declarative.
- Should support hot updates.
- Hide from the programmer, the distinction between primary and secondary memory.
## Ideas to consider in the design
- Concurrent-constraint logic programming.
- Single assignment.
- A variable has two references -- one that provides the right to assign a value, and the other that allows to query the value. These are called "teller" and "asker" by Saraswat and Kahn.
- Commands or statements generally run concurrently and their order does not matter.
- Condition tests block until data upon which they depend become available.
- Environment can provide an argument conceived as an unlimited supply of oracles to represent the outcomes of deliberate races; this can be split and passed where the capability is to be extended.
- Strong static typing, at least as expressive in practice as Elm's type system.
- Type system extensions for linearity, including mixed records and tuples containing both copyable and linear values.
- Clear distinction between linear and affine capabilities in the design space (for example, teller-like references may need strict exactly-once use).
  ( definitions in the above:
    - Linear capability: must be used exactly once.
    - Affine capability: may be used at most once (so it can be dropped/unused,
      but not duplicated).
  )
- Determinism by default, with races deliberately staged and made explicit through oracle capabilities.
- A concrete model of hot code updates, including versioning rules, migration behavior, and what happens to suspended computations during upgrade.
- Persistence via transactions, with explicit criteria for compaction/elision of history that does not affect future observable behavior.
- Modular composition model for large applications, to avoid architecture-level boilerplate.
- Two "object"-like concepts: an immutable object (which is a value that includes or points to methods), and a "process" consuming a linked list of messages. In the latter case, a method passes the rest of the message list to the next state.

> Written with [StackEdit](https://stackedit.io/) and with OpenAI Codex CLI.
