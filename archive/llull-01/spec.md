# Design Phase 01: Llull-01

Llull-01 is the first strictly declarative dialect in this project. Its name honors Ramon Llull, in particular his work concerning elections. Files containing Llull-01 source code use the suffix `.ll01`.

This phase is intended to produce a language theoretically usable for real reactive applications. It is not merely an assembly notation for the execution model. Work on conveniences that imitate imperative notation is deferred.

Syntax decisions in this document apply to Llull-01. Decisions about the execution model are intended to apply to the language family unless a later design explicitly revises them.

## General character

- The notation is purely declarative.
- The language is dynamically typed during this phase. Static typing remains a later design task.
- Commands generally establish concurrent constraints. Their textual order does not establish execution order unless a construct explicitly represents an ordering relation.
- Runtime names ordinarily denote flows.
- The runtime may represent one source expression or name using several lower-level components. Static elaboration may distribute those components without pretending that a linear or affine runtime flow has been duplicated.

## Lexical conventions

Whitespace and comments normally delimit words, as in FORTH. A word containing only letters, digits, and underscores, and not beginning with a digit, is an identifier. There are no reserved identifier words. Language marks may instead be punctuation-bearing words such as `-if`, `-then`, `-else`, and `/if`.

The following lexical and token-level conventions apply:

- `//` introduces a comment extending to the end of the line, following BCPL.
- The standalone words `/*` and `*/` delimit a nestable comment.
- The standalone word `#` quotes the next word as an interned symbol. Thus `# age` denotes the interned symbol whose spelling is `age`, while `age` denotes a runtime flow. This is a grammatical quotation operator rather than a special lexical prefix.
- A selector may be represented as an ordered sequence of symbols, such as `[ # deposit # amount # reply ]`.
- `<<` and `>>` delimit a character string and may nest. The delimiters need not have surrounding whitespace. Backslash escapes unmatched delimiters and introduces conventional escaped characters such as `\n`.
- The standalone words `(` and `)` group a compound expression. Whitespace or a comment must delimit each parenthesis from adjacent words.

Ordinary double-quoted strings may be added as a compact conventional form. Nested `<< ... >>` quotation is the form intended for multiline text and quoted source.

## Flows, asking, and telling

A runtime identifier denotes the asking reference for a flow. The standalone word `!` followed by an identifier denotes its telling reference:

```ll01
result
! result
```

The first form asks for the information carried by `result`; the second possesses the right to resolve it.

A teller can be resolved through an ordinary method call:

```ll01
! foo bind to 2 .
```

This resolves `foo` to `2`; it does not mutate a variable. The shorter notation `! foo := 2 .` may later be provided as sugar for the same operation.

Multiple source occurrences of a copyable asking reference cause the compiler to elaborate whatever fan-out or copying operation the next semantic layer requires. This need not physically copy an immutable resolved value. A runtime may share the representation or fan out an unresolved flow. A later static type system will reject implicit duplication of flows containing linear components. Llull-01 reports such misuse as a runtime failure.

Compilation names do not denote runtime flows and therefore do not use `!`. Compilation constructs program artifacts rather than interpreting ordinary runtime code at compile time. Declarative compile-time computation may exist as a separate facility without conflating the two semantic strata.

## Failure

A flow may resolve to a value or to stable failure information. Failure awakens dependents and propagates through them instead of leaving every dependent permanently suspended. Supervising structures may respond by replacing work, reporting the failure, or deliberately preserving the failed state.

Runtime type errors use this failure model. Supervision may borrow ideas from Erlang, but failure must account explicitly for suspended computations and their dependents.

## Messages and selectors

The ordinary message syntax starts with the receiver and a verb. It is followed by zero or more keyword-and-argument pairs:

```ll01
receiver verb keyword argument keyword argument .
```

The selector consists of the verb followed by the ordered keywords. Argument values are not part of selector identity. For example:

```ll01
account deposit amount quantity confirm ! result .
```

has selector `[ deposit amount confirm ]` and arguments `[ quantity ! result ]`.

After the receiver and verb, keyword and argument positions alternate. A message argument is either an atomic value or asking reference, a teller reference such as `! result`, or a compound expression enclosed by standalone parentheses:

```ll01
account transfer amount ( x plus y ) destination savings .
```

Requiring parentheses around compound arguments avoids a tagmatic ambiguity without requiring colons between keywords and arguments.

Replies from stateful message receivers are explicit tellers supplied as arguments. A process message does not implicitly return both a reply and the next sending channel. This preserves a uniform model in which the channel successor is plumbing that static elaboration may hide, while replies remain ordinary flows.

A generic, dynamically constructed send may be written in the following style:

```ll01
my_account send verb # deposit with [
  # amount 30
  # confirm ! result
] .
```

The bracketed value is an ordered sequence of keyword-and-argument pairs, not an unordered map. Its keys, together with `# deposit`, determine the complete selector. Duplicate keys are invalid. Direct message notation may elaborate to this generic operation.

## Immutable objects and slots

An immutable object is a finite mapping from selector keys to slots. A selector key is represented structurally as an ordered sequence of words rather than as a concatenated string.

A slot contains:

- a selector key;
- a disposition, either returning or activating;
- a value.

A returning slot returns its stored flow and has a selector with no arguments. An activating slot treats its value as a method. If the method flow is unresolved, activation suspends; if it resolves to a non-activatable value, activation fails.

Public component access is message sending rather than primitive field extraction. A caller therefore need not know whether a component is stored or computed:

```ll01
account balance
account deposit amount quantity confirm ! result
```

Private values may reside in the lexical environment captured while composing the object. They need not appear as publicly accessible slots. Within a method, an unqualified slot name may abbreviate a unary message to the current receiver, preserving the ability to replace stored data with computed behavior. The exact shadowing and qualification rules remain deferred until examples require them.

One provisional runtime object-composition form is:

```ll01
! my_object bind to {
  age ^ 32 ,
  adult_eh do:
    ^ age >= 18
  /do ,
} .
```

Here `age` is a returning slot and `adult_eh` is an activating slot. In a slot declaration, `^` marks the flow to return. Within a method, `^` resolves the method-result flow. It does not perform an imperative control transfer or make other concurrent commands unreachable.

The language does not expose identity for immutable objects. Separately composed but extensionally equivalent objects cannot be distinguished merely by their construction histories. Capabilities such as channel endpoints remain operationally distinct, but no general identity comparison is thereby implied. A program that deliberately requires a stable distinguishable token may obtain a fresh anonymous symbol through an appropriate oracle capability.

Inheritance is not part of the initial object model. If experience motivates it, a single immutable prototype relation, resembling a disciplined form of JavaScript delegation, is preferred as the first extension. The basic slot does not currently contain an inheritance bit.

## Compile-time object composition

Runtime composition produces an immutable object value. Compile-time composition produces or extends a program artifact. The two operations may share object-body notation and an algebra of composition without being the same semantic operation.

Compile-time artifact composition is order-independent:

- contributions with disjoint selectors combine;
- identical repeated contributions may be accepted;
- conflicting definitions of the same selector fail;
- no definition silently wins because it occurred later in source text.

An explicit overriding construct may eventually express precedence deliberately. An artifact may collect fragments in several lexical locations and then be sealed. Sealing establishes an assembly and version boundary useful for separate compilation and hot updates.

## Ordered message channels

Creating an ordinary message channel requires no oracle. It produces two linear capabilities:

- a sending end that appends one message and yields its successor sending end;
- a receiving end that removes one message and yields its successor receiving end.

Messages retain their order. Static elaboration may hide the successive channel endpoints while preserving their linear use.

A stateful receiver emerges from the relationship between a receiving end and a current immutable object. Upon receiving a message, the appropriate method produces the object that will receive the next message:

```text
( receiving-end0, object0 )
    -> message0
    -> ( receiving-end1, object1 )
    -> message1
    -> ( receiving-end2, object2 )
```

This behavior does not require a primitive identity-bearing process object.

## Oracles and stream merging

An oracular merge operator may consume an oracle capability and an existing sending end, create two or more input channels, and return their sending ends. It owns the corresponding receiving ends and forwards their messages into the original channel.

Such a merge:

- preserves the order within every input stream;
- chooses an interleaving oracularly;
- forwards every selected message exactly once;
- states any fairness guarantee separately from its nondeterministic choice.

In a live execution, machine scheduling may supply the oracle's answers. The semantic requirement is that every scheduling-dependent observable choice be attributable to an oracle capability. Recorded answers can replace live scheduling during replay.

## Operator graph, demand, and abandonment

The runtime models calculation as a directed graph. Nodes are operators and forward arrows are flows. Values move forward along the arrows. Demand moves backward from consumers toward the computations required to produce their inputs.

Output devices are persistent roots of demand. An unresolved node with demanded output receives scheduling priority; a node with no demanded output does not. Demand propagating through dependencies acts as priority donation, so work needed by an urgent output inherits that urgency rather than causing a priority inversion.

Demand belongs to active paths rather than merely to asking capabilities. When several consumers ask for one calculation, withdrawing one consumer's demand does not cancel the demand of the others.

An oracle-authorized abandonment operator accepts an asker for a calculation and an asker for control. While its own result is demanded, it propagates demand toward both inputs:

- if the calculation resolves first, it forwards the result and withdraws its demand from the control path;
- if the control path resolves first, it reports abandonment and withdraws its demand from the calculation;
- if both are eligible at the decision point, the oracle accounts for the selected outcome.

When no other path demands the abandoned calculation, its operators cease to receive runtime service. This provides selective cancellation without introducing an identity-bearing calculation object. Already committed messages or device output are not undone.

The runtime must notice withdrawn demand at bounded safe points. Long primitive or foreign operations must either provide such safe points or declare their inability to be interrupted. Abandonment must also discharge internal linear obligations in a defined cancelled state rather than silently strand observable teller obligations.

Boolean demand distinguishes needed from unneeded work. Richer reactive scheduling may be expressed by demand-transforming merge and throttle operators that convey urgency, weight, deadline, work budget, or continuous versus opportunistic demand. Equal effective demand receives fair service. Priority and fairness are therefore expressed primarily through graph topology and demand allocation rather than through a primitive identity-bearing process with a fixed scheduling class.

> Developed through design discussion between the project author and OpenAI Codex.
