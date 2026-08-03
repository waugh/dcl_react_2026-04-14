# dcl_react_2026-04-14
Attempt to build a declarative programming language for writing programs that react to their environments and permit deliberate races and resist accidental races.

## Project overview

This project seeks to find or invent a programming language or family of programming languages.

### Goals

- Programming language for general purposes.
- Allows programming of reactive processes that can respond to stimuli from the environment and to the amount of time computations take to complete.
- Suitable for the Web, on both the front end and back end.
- Purely declarative.
- Should support hot updates.
- Hides from the programmer the distinction between primary and secondary memory.

### Common semantic foundation

The language variants in this project share an execution model based on flows, capabilities, oracles, and demand. A dialect may give these concepts different notation or organize programs around different higher-level abstractions, but it relies on the same underlying semantics.

#### First-class items

A **first-class item** is anything that may be carried by a flow, passed as an argument, returned as a result, stored in an aggregate, or captured by a closure. A first-class item may convey information, authority, or both.

A **value** is a first-class item that conveys information without conveying special authority. Numbers, strings, symbols, and immutable aggregates containing only values are examples. A **capability** is a first-class item that conveys authority, such as the right to ask, tell, send, receive, or make an oracular choice. An aggregate may contain values and capabilities together and therefore convey both information and authority.

A procedure consisting of constant executable code can be a copyable value. A closure combines such a procedure with captured first-class items. Its usage constraints follow structurally from its captured environment: a closure containing a linear item is linear; one containing an affine item but no linear item is affine; and one containing only copyable items is copyable. Records, tuples, and other aggregates follow the same principle.

Being first-class does not imply that an item is copyable, printable, comparable, or possessed of observable identity. Linear and affine restrictions continue to apply whenever an item is passed, returned, stored, or captured.

#### Flows

The runtime represents a calculation as a directed graph. Its nodes are operators and its forward arrows are flows. A flow begins unresolved and, under the single-assignment rule, can be resolved only once. Its outcome may be a first-class item or stable failure information. Operators that require unresolved inputs suspend until the necessary information becomes available. Items and failures propagate forward through the graph.

Source notation need not expose every runtime flow separately. One source expression may elaborate into several flows or capability-bearing components, and a compiler may insert fan-out for copyable information. Such elaboration must not duplicate a linear or affine capability illegally.

#### Capabilities

Authority over a flow is divided directionally:

- An **asker** provides the right to observe the flow's outcome and to propagate demand for it.
- A **teller** provides the right to resolve the flow. A holder of a teller may derive a corresponding asking-only capability, but an asker cannot derive telling authority.

Capabilities are first-class items. They can be passed, captured in closures, stored in aggregates, and divided among components of a program. Their multiplicity depends on what they authorize and on the item carried by the flow. Some capabilities are copyable, some are affine, and some are linear. A teller or channel endpoint may, for example, require exactly one use, while an asking capability for copyable immutable information may be fanned out automatically.

The asker/teller distinction lets programs construct evolving behavior without mutable variables. For example, successive immutable first-class items can hold opposite ends of a single-assignment linked stream and thereby implement a message channel.

#### Oracles

An oracle capability authorizes a deliberate choice whose outcome may be observably nondeterministic, such as selecting an interleaving when streams are merged. Without suitable oracle authority, differences in machine scheduling must not change a program's observable result.

During live execution, scheduling and environmental events may supply oracle answers. Answers may instead be recorded and replayed. Oracle capabilities may be divided and passed to the components authorized to make choices. Their exact protocols, including splitting, recording, fairness, and the representation of answers, remain to be designed.

#### Demand

First-class items and failures move forward through the operator graph; demand moves backward from consumers toward the operators needed to produce their inputs. Output devices and other externally observed results act as persistent roots of demand. Unresolved work with demanded output receives runtime service, while work with no demanded output receives no scheduling priority.

Demand belongs to active paths through the graph rather than merely to the existence of an asking capability. If several consumers demand one calculation, withdrawal by one consumer does not cancel the others. If all demand for a calculation is withdrawn, the runtime may abandon it. Demand withdrawal must be noticed at bounded safe points, and abandonment must account for externally visible results and linear obligations rather than silently stranding them.

Backward demand also carries effective urgency through dependency paths. Work required by an urgent output inherits that urgency, reducing priority inversion. Fairness is required among work with equal effective priority. Merge and throttle operators may transform demand to express richer distinctions such as urgency, weight, deadline, or work budget; the precise protocols for doing so remain open.

### Other ideas to consider in the design

- Concurrent-constraint logic programming.
- Commands or statements generally run concurrently and their order does not matter.
- Strong static typing, at least as expressive in practice as Elm's type system.
- Type system extensions for linearity, including mixed records and tuples containing both copyable and linear first-class items.
- Clear distinction between linear and affine capabilities in the design space. A linear capability must be used exactly once. An affine capability may be used at most once, so it can be dropped but not duplicated.
- A concrete model of hot code updates, including versioning rules, migration behavior, and what happens to suspended computations during upgrade.
- Persistence via transactions, with explicit criteria for compaction or elision of history that does not affect future observable behavior.
- A modular composition model for large applications that avoids architecture-level boilerplate.
- Language dialects may provide or simulate object-like concepts, including mutable ones. A record is not thereby an object: it is an aggregate and does not primitively dispatch messages to methods. Mutable object-like behavior may, for example, emerge from a succession of states that consume a linked list of messages, with each state arranging for its successor to consume the rest of the list.

## Why “Llull”?

The languages are named in honor of the Catalan thinker Ramon Llull (c. 1232–1316). His work is not a technical source for their programming-language design. Although Llull is widely known for a philosophy concerned with combining and categorizing ideas, this project particularly honors his pioneering work on electoral methods—what would now be studied as voting theory or social-choice theory.

Llull described election procedures based on systematic pairwise comparisons centuries before the modern development of the field. His electoral writings include the Latin *Artificium electionis personarum* and *De arte eleccionis*, and a Catalan worked example in chapter 24 of *Blaquerna*, “En qual manera Natana fo eleta a abadessa.” [The Augsburg Web Edition of Llull’s Electoral Writings](https://www.math.uni-augsburg.de/htdocs/emeriti/pukelsheim/llull/) presents linked manuscript facsimiles, transcriptions, and English translations of all three works. Günter Hägele and Friedrich Pukelsheim provide historical and technical context in [“Llull’s Writings on Electoral Systems”](https://opus.bibliothek.uni-augsburg.de/opus4/files/27281/Studia_Lulliana_2001v041p003.pdf), *Studia Lulliana* 41, 2001.

## Prior art and references

The project draws ideas from, or bears comparison with, the following work. Inclusion here does not imply that the project adopts every feature or semantic commitment of a cited system.

The most important foundation is the work of Vijay A. Saraswat and Kenneth M. Kahn, especially Lucy and ToonTalk. Llull takes from this line of work the separation of asking and telling capabilities for one-shot variables, which is fundamental to its flow model. It also takes the technique of representing a reference to mutable state by means of a message channel: successive immutable states consume messages and arrange for their successors to consume the remainder of the channel.

- Carl Hewitt, Peter Bishop, and Richard Steiger, [“A Universal Modular ACTOR Formalism for Artificial Intelligence”](https://www.ijcai.org/Proceedings/73/Papers/027B.pdf), *Proceedings of the Third International Joint Conference on Artificial Intelligence*, 1973. This is an early statement of the Actor model of concurrent computation.
- Vijay A. Saraswat, [*Concurrent Constraint Programming*](https://mitpress.mit.edu/9780262192972/concurrent-constraint-programming/), MIT Press, 1993. Saraswat develops a family of languages in which concurrent agents communicate by asking and telling constraints in a shared store of partial information. This work is a principal source for Llull’s asker/teller terminology and concurrent-constraint foundation.
- Kenneth M. Kahn and Vijay A. Saraswat, [“Actors as a Special Case of Concurrent Constraint Programming”](https://doi.org/10.1145/97946.97955), *OOPSLA/ECOOP 1990*. The paper presents Lucy, a subset of Janus, relates actors to concurrent constraint programming, and is a primary source for Llull’s treatment of one-shot variables and capability-separated communication.
- Kenneth M. Kahn, [“ToonTalk—An Animated Programming Environment for Children”](https://toontalk.com/Papers/jvlc96.pdf), *Journal of Visual Languages and Computing* 7(2), 1996. The ToonTalk implementation supplies an especially concrete, visual realization of this style of concurrent computation and of evolving behavior mediated by message channels.
- Magnus Carlsson and Thomas Hallgren, [“FUDGETS: A Graphical User Interface in a Lazy Functional Language”](https://doi.org/10.1145/165180.165228), *Conference on Functional Programming Languages and Computer Architecture*, 1993. Fudgets is relevant to the compositional construction of reactive user interfaces. It did not originate the concept of oracles, but its paper is where Jack Waugh first encountered that concept.
- David Ungar and Randall B. Smith, [“Self: The Power of Simplicity”](https://bibliography.selflanguage.org/self-power.html), *OOPSLA 1987*. Self influenced the Llull-01 exploration of slots, delegation, and message syntax.
- Elizabeth D. Rather, Donald R. Colburn, and Charles H. Moore, [“The Evolution of Forth”](https://www.forth.com/resources/forth-programming-language/), *History of Programming Languages II*, 1993. Forth is relevant both as a compact language design and as prior art for word-oriented syntax.
- Manfred von Thun, [“Joy: Forth’s Functional Cousin”](https://www.complang.tuwien.ac.at/anton/euroforth/ef01/thomas01a.pdf), *EuroForth 2001*. Joy contributed terminology and examples from concatenative functional programming.
- E. A. Ashcroft and W. W. Wadge, [“Lucid, a Nonprocedural Language with Iteration”](https://doi.org/10.1145/359636.359715), *Communications of the ACM* 20(7), 1977. Lucid—not Hope, as first recalled during this project’s design discussion—is the language in which variables denote histories and an ordinary constant denotes a constant history.
- Conal Elliott and Paul Hudak, [“Functional Reactive Animation”](https://doi.org/10.1145/258948.258973), *International Conference on Functional Programming*, 1997. This is foundational work on functional reactive programming.
- Penobscot Development Corporation, [“Kala Technical Brief”](https://stason.org/TULARC/software/object-oriented-programming/9-3-Kala-Commercial-Systems-Other-Models-Object-orient.html), preserved in the *Object-Oriented Technology FAQ*. Kala’s policy-neutral persistent data service is relevant to the goal of hiding the distinction between primary and secondary memory.
- David Maier, Jacob Stein, Allen Otis, and Alan Purdy, [“Development of an Object-Oriented DBMS”](https://mail.im.tku.edu.tw/~cjou/adbms/OODBMS.pdf), *OOPSLA 1986*. The paper describes GemStone’s division into a Stone process for secondary storage, concurrency, transactions, and recovery, and a per-session Gem process implementing the Smalltalk-derived OPAL language and virtual image. Stone used optimistic concurrency and copy-on-write shadow object tables: a successful transaction could be committed atomically by replacing the database root, while an aborted transaction’s shadow table could be discarded. GemStone’s programmer-delimited transactions provide relevant prior art—and a point of contrast with the intended ability of Llull systems to infer transaction boundaries.
- Casey Muratori, [“The Big OOPs: Anatomy of a Thirty-five-year Mistake”](https://www.youtube.com/watch?v=wo84LFzx5nI), Better Software Conference, 2025, and [“The Downfall of Object-Oriented Programming with Casey Muratori”](https://www.youtube.com/watch?v=ToBF_mLxEcI), interview. Muratori argues that object-oriented techniques—and especially compile-time hierarchies of encapsulation made to mirror a domain model—are routinely applied where their costs exceed their benefits. His critique prompted the project to reconsider native method dispatch as a universal foundation and helped motivate the move from the object-oriented Llull-01 experiment to the procedure-and-record foundation of Llull-02.
- [*Byte*, August 1981: Smalltalk](https://archive.computerhistory.org/resources/access/text/2024/06/102739398-05-0001-acc.pdf). The issue’s presentation of Smalltalk-80, including the balloon cover, was a formative influence on the project’s originator.

## Repository organization

- `README.md` describes the language family's shared goals and semantics.
- `doc/` contains design material and records of development sessions.
- `examples/` contains dialect-specific source examples.
- `archive/` preserves work on design branches that are no longer active.

## Who Is Doing This?

Jack Waugh originated and guides the project and makes its final design decisions. He earned a BS in Information and Computer Science from the Georgia Institute of Technology in 1978. He has researched prior art relevant to this work intermittently since the early 1980s. A formative event was the August 1981 issue of *Byte* magazine devoted to Smalltalk-80, with the Smalltalk balloon depicted on its cover.

OpenAI Codex has collaborated extensively on the project. Codex is an AI coding agent created, coded, and trained by OpenAI. Jack estimates that Codex has performed more than 75 percent of the work completed so far. Its contributions include sustained design discussion; drafting and editing specifications and explanatory prose; identifying and correcting mistakes in examples and capability flow; offering reasoned recommendations at design points where Jack had no initial preference; researching technical and historical prior art on the Internet; and helping organize the evolving project without displacing Jack's authorship and direction.
