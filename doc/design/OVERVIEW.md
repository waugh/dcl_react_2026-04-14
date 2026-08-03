# Find or invent a programming language or a family of programming languages
## Goals
- Programming language for general purposes.
- Allows to program reactive processes (can react to stimuli from the environment and to the amount of time that computations take to complete).
- Suitable for the Web (front end and back end).
- Purely declarative.
- Should support hot updates.
- Hide from the programmer, the distinction between primary and secondary memory.

## Common semantic foundation

The language variants in this project share an execution model based on flows, capabilities, oracles, and demand. A dialect may give these concepts different notation or organize programs around different higher-level abstractions, but it relies on the same underlying semantics.

### Flows

The runtime represents a calculation as a directed graph. Its nodes are operators and its forward arrows are flows. A flow begins unresolved and, under the single-assignment rule, can be resolved only once. Its outcome may be a value or stable failure information. Operators that require unresolved inputs suspend until the necessary information becomes available. Values and failures propagate forward through the graph.

Source notation need not expose every runtime flow separately. One source expression may elaborate into several flows or capability-bearing components, and a compiler may insert fan-out for copyable information. Such elaboration must not duplicate a linear or affine capability illegally.

### Capabilities

Authority over a flow is divided directionally:

- An **asker** provides the right to observe the flow's outcome and to propagate demand for it.
- A **teller** provides the right to resolve the flow. A holder of a teller may derive a corresponding asking-only capability, but an asker cannot derive telling authority.

These capabilities are values that can be passed, captured in closures, stored in aggregates, and divided among components of a program. Their multiplicity depends on what they authorize and on the value carried by the flow. Some capabilities are copyable, some are affine, and some are linear. A teller or channel endpoint may, for example, require exactly one use, while an asking capability for copyable immutable information may be fanned out automatically.

The asker/teller distinction lets programs construct evolving behavior without mutable variables. For example, successive immutable values can hold opposite ends of a single-assignment linked stream and thereby implement a message channel.

### Oracles

An oracle capability authorizes a deliberate choice whose outcome may be observably nondeterministic, such as selecting an interleaving when streams are merged. Without suitable oracle authority, differences in machine scheduling must not change a program's observable result.

During live execution, scheduling and environmental events may supply oracle answers. Answers may instead be recorded and replayed. Oracle capabilities may be divided and passed to the components authorized to make choices. Their exact protocols, including splitting, recording, fairness, and the representation of answers, remain to be designed.

### Demand

Values and failures move forward through the operator graph; demand moves backward from consumers toward the operators needed to produce their inputs. Output devices and other externally observed results act as persistent roots of demand. Unresolved work with demanded output receives runtime service, while work with no demanded output receives no scheduling priority.

Demand belongs to active paths through the graph rather than merely to the existence of an asking capability. If several consumers demand one calculation, withdrawal by one consumer does not cancel the others. If all demand for a calculation is withdrawn, the runtime may abandon it. Demand withdrawal must be noticed at bounded safe points, and abandonment must account for externally visible results and linear obligations rather than silently stranding them.

Backward demand also carries effective urgency through dependency paths. Work required by an urgent output inherits that urgency, reducing priority inversion. Fairness is required among work with equal effective priority. Merge and throttle operators may transform demand to express richer distinctions such as urgency, weight, deadline, or work budget; the precise protocols for doing so remain open.

## Other ideas to consider in the design

- Concurrent-constraint logic programming.
- Commands or statements generally run concurrently and their order does not matter.
- Strong static typing, at least as expressive in practice as Elm's type system.
- Type system extensions for linearity, including mixed records and tuples containing both copyable and linear values.
- Clear distinction between linear and affine capabilities in the design space (for example, teller-like references may need strict exactly-once use).
  ( definitions in the above:
    - Linear capability: must be used exactly once.
    - Affine capability: may be used at most once (so it can be dropped/unused,
      but not duplicated).
  )
- A concrete model of hot code updates, including versioning rules, migration behavior, and what happens to suspended computations during upgrade.
- Persistence via transactions, with explicit criteria for compaction/elision of history that does not affect future observable behavior.
- Modular composition model for large applications, to avoid architecture-level boilerplate.
- Two "object"-like concepts: an immutable object (which is a value that includes or points to methods), and a "process" consuming a linked list of messages. In the latter case, a method passes the rest of the message list to the next state.

> Written with [StackEdit](https://stackedit.io/) and with OpenAI Codex CLI.
