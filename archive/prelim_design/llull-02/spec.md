# Llull-02 Design Specification

Llull-02 is a purely declarative language for reactive applications. It is a
member of the Llull language family and uses the common semantic foundation of
flows, capabilities, oracles, and backward-propagating demand.

This document records the design decisions made so far. It is not yet a complete
language reference. Examples illustrate intended notation; details explicitly
identified as open remain subject to design and experimentation.

Files containing Llull-02 source use the suffix `.ll02`.

## General character

- Programs describe constraints and dependencies rather than an imperative
  sequence of state changes.
- Commands generally participate concurrently. Their textual order does not by
  itself establish execution order.
- Procedures and records are fundamental. Native object identity, classes, and
  method lookup are not.
- Procedure artifacts, procedures carried at runtime, and closures are all
  invocable through one procedure-call operation.
- An additional OO-looking call notation invokes an explicit interpreter
  protocol built from ordinary records and pure procedures.
- The initial design may be dynamically checked. A later static type system is
  expected to express copyable, affine, and linear usage.

## Lexical conventions

Whitespace and comments normally delimit words, as in FORTH. A word containing
only letters, digits, and underscores, and not beginning with a digit, is an
identifier. Identifier spellings are not reserved as language keywords.
Language words instead bear punctuation, as in `-call`, `-if`, and `/if`.

The following lexical conventions apply:

- `//` introduces a comment extending through the end of the line.
- The standalone words `/*` and `*/` delimit a nestable comment.
- The standalone word `#` quotes the next word as an interned symbol. Thus
  `# age` is a symbol while `age` ordinarily names a runtime flow. The quoted
  word may itself be a language word, so `# -call` is valid.
- `<<` and `>>` delimit a character string and may nest. They do not require
  surrounding whitespace. Backslash escapes unmatched delimiters and introduces
  conventional escaped characters such as `\n`.
- Ordinary double-quoted strings may later be admitted as a compact form.
  Nested `<< ... >>` quotation is the form intended for multiline strings and
  quoted source.
- The standalone words `(` and `)` group a compound expression. Each
  parenthesis must be separated from adjacent words by whitespace or a comment.
- The standalone words `[` and `]` delimit a sequence, tuple, or array. The
  final distinction among those concepts remains to be designed.

Commands end with periods. Field descriptions in record constructors and
similar declarative bodies end with commas.

Alternative closing words may be admitted where they improve readability, such
as `/do` and `/done`, or `/if` and `/fi`.

## Names and program artifacts

Runtime flow names begin with a lowercase letter and conventionally use
`snake_case`:

```ll02
new_channel
result
_reply
```

A leading underscore is permitted and conventionally means “teller to.” This is
only a naming convention; `!` is what actually denotes telling authority.

The presence of an uppercase letter marks a name as the name of a program
artifact. Procedure artifacts conventionally use lower camel case:

```ll02
newChannel
mergeStreams
```

This distinction is intended to be enforced, not merely recommended. A future
module system may qualify artifact names. The qualification operator is
provisionally the standalone word `::`, with whitespace around it:

```ll02
Channels :: newChannel
```

`:=` means “is hereby defined to mean” or establishes a closed definition.
Runtime flows also resolve only once, so definition and single assignment have
closely related meanings. `+:` is reserved for order-independent contributions
to an extensible artifact; it is not used to define an ordinary procedure that
cannot sensibly be reopened.

## First-class items

A first-class item is anything that may be carried by a flow, passed as an
argument, returned as a result, stored in an aggregate, or captured by a
closure. An item may convey information, authority, or both.

A value conveys information without special authority. A capability conveys
authority, such as the right to ask, tell, send, receive, or obtain an oracular
answer. Being first-class does not imply that an item is copyable, printable,
comparable, or possessed of observable identity.

Aggregates and closures inherit usage restrictions from their contents. An item
containing a linear component is linear. An item containing an affine component
but no linear component is affine. An item containing only copyable components
is copyable.

## Flows, askers, and tellers

The runtime is modeled as a directed graph whose nodes are operators and whose
forward arrows are flows. A flow starts unresolved and may resolve only once,
either to a first-class item or to stable failure information.

A runtime identifier ordinarily denotes the asking reference for a flow. The
standalone word `!` followed by that identifier denotes its telling reference:

```ll02
answer
! answer
```

An asker provides authority to observe the outcome and propagate demand. A
teller provides authority to resolve the flow. A holder of a teller may derive
an asking-only capability, but an asker cannot derive telling authority. The
notation for deriving the asker remains open; it may be unnecessary if tellers
are defined to include asking authority.

Multiple uses of an asker carrying copyable information authorize the compiler
to insert whatever fan-out the lower semantic layer requires. This does not
authorize duplication of an affine or linear item.

## Failure

A flow may resolve to stable failure information. Failure awakens dependents and
propagates rather than leaving the dependent graph permanently suspended.
Dynamic type errors, malformed protocol use, and failed destructuring use this
model unless a more specific rule applies.

## Records and structures

A record is a runtime aggregate containing named fields. Records do not
primitively possess identity and do not natively dispatch messages.

A structure is an informal design description of a record layout, including the
intended uses and meanings of its fields. A conforming record used in the
described way is an instance of that structure. A structure is not necessarily a
runtime item, a static type, an enforced schema, or a program artifact.

A record constructor is provisionally written:

```ll02
{
  foo : zoom ,
  bletch : schwartz ,
}
```

The exact semantics of duplicate fields, field order, and record extension
remain to be completed. Records themselves are immutable.

Within a bracketed sequence, this notation:

```ll02
amount : quantity
```

abbreviates:

```ll02
{ key : # amount , payload : quantity , }
```

This provides a compact representation for ordered keyword-and-argument pairs.

## Procedures and closures

A pure procedure artifact consists of constant executable code. It contains no
captured runtime environment and is a copyable value.

A closure combines procedure code with captured first-class items. Its
multiplicity is inherited from its captured environment. Methods of an inner
record or other nested construct may close over names introduced in an outer
lexical context.

Procedures are first-class items. A procedure can be passed, returned, stored,
or received through a flow and then invoked. Calling is therefore not restricted
to statically named procedure artifacts.

## Procedure calls

The language word `-call` invokes a procedure expression. Keyword-and-argument
pairs follow it:

```ll02
-call newChannel
  sending ! sending_end
  receiving ! receiving_end
.
```

The procedure may instead come from a runtime flow:

```ll02
-call channel_factory
  sending ! sending_end
  receiving ! receiving_end
.
```

Or it may be computed:

```ll02
-call ( choose_procedure mode )
  input data
  output ! result
.
```

After the procedure expression, keyword and argument positions alternate. A
compound argument is parenthesized. Keywords name parameters and make calls
self-documenting. Their order is intended not to affect a procedure call;
keywords must be unique, and each required parameter must be supplied exactly
once. The rules for optional parameters remain open.

The Fortran- and PL/I-like explicit call word makes procedure invocation
visibly distinct from OO-looking interpretation while keeping the two forms
similar in length.

## OO-looking calls and interpreters

Llull-02 provides OO-looking call syntax without making native method dispatch
fundamental:

```ll02
my_account deposit amount 30 confirm ! result .
```

The parts are:

- receiver: `my_account`;
- verb: `deposit`;
- keywords: `amount` and `confirm`;
- arguments: `30` and `! result`.

The selector consists of the verb followed by the ordered keywords. Keyword
order is therefore significant for an OO-looking call even though it is not
significant for a procedure call. Parentheses delimit compound arguments:

```ll02
my_account deposit
  amount ( base_amount + adjustment )
  confirm ! result
.
```

The receiver is an interpreter: a record conforming at least to this informal
structure:

```ll02
{
  how : <pure procedure> ,
  rest : <arbitrary first-class item> ,
}
```

The `how` field must contain a pure procedure, not a closure. It is consequently
copyable. Captured state belongs explicitly in `rest`, which may contain
copyable, affine, or linear items and gives the receiver the corresponding
multiplicity.

The OO-looking call invokes `how` with a reflection of the receiver, verb,
keywords, and arguments. The receiver itself is included in that reflection.
The exact standard record layout for a reflected call remains to be fixed. It
must preserve keyword order and preserve every argument capability without
illegal copying.

The result of `how` is the result of the OO-looking call. When interpreters are
used as references to evolving processes, the convention is for this result to
be the receiver that handles the next call. This is a convention, not a semantic
restriction: an interpreter procedure may return any permitted item.

Invoking an interpreter with `-call` may be defined as an interpreted call whose
verb is `# -call`. Symbols are therefore permitted to quote language words.
Under this rule every closure has a valid semantic representation as an
interpreter whose pure `how` procedure receives an explicit environment in
`rest`. A compiler need not use that representation internally; native closure
representations will often be more efficient.

Interpreter records are preferred over self-recursive closure receivers because
they make state explicit, avoid recursive knot-tying in every receiver
definition, allow behavior and state to be replaced independently, and remain
subject to ordinary record and multiplicity rules.

## Reflection and programmatic dispatch

OO-looking interpretation requires calls to be reifiable as ordinary data. A
reflected call must represent:

- the receiver;
- the verb as an interned symbol;
- the ordered keywords as interned symbols;
- the corresponding arguments, including asker and teller capabilities.

The reverse operation must also be expressible: code can take such a reflected
call and ask an interpreter to interpret it. No native slot lookup is implied.
The canonical message structure and the surface notation for explicit
reflection remain open.

## Destructuring

Destructuring is syntactically distinct from constructing a record of tellers:

```ll02
destruct:
  foo : ! bar ,
  bletch : ! qux ,
/destruct := some_record .
```

The left side is a source-level binding form, not an arbitrary computed item and
not a reified pattern. The right side may be any computed item. Field names and
destination tellers must appear in the source.

Destructuring is intended to be atomic. Missing fields cause stable failure. The
initial rule should require exact coverage when consuming a linear record so
that no unmentioned linear field is silently discarded. A future explicit
remainder clause may support partial destructuring safely. Destructuring a
linear record consumes it and distributes its fields according to their own
multiplicities.

## Ordered message channels

An ordinary message channel requires no oracle. It can be represented directly
as a single-assignment linked stream. An asker to a link provides receiving
authority; its corresponding teller provides sending authority. A resolved link
contains a message and the next channel representation:

```ll02
{
  car : message ,
  cdr : next_receiving_end ,
}
```

Sending resolves the current teller with a link containing the message and a
fresh successor. The channel preserves message order. No exported channel
constructor is necessary if client code can create the initial flow and use this
structure directly.

Message channels can realize references to mutable object-like processes without
mutable variables or identity-bearing objects. Each immutable state consumes
the next message and produces the state that will consume the remainder of the
stream.

Closing a channel to indicate that no further messages will arrive has not yet
been designed.

## Oracles

An oracle capability authorizes one observably nondeterministic choice or some
other service that would otherwise prevent referential transparency. Examples
include choosing the winner of a race and selecting an interleaving when streams
are merged. Machine scheduling may supply an answer in a live execution;
recorded answers may supply it during replay.

The full semantic capability may be supplied as an infinite tree of oracles.
Both individual oracle capabilities and the tree nodes used to divide them are
affine. Taking branches distributes independent authority without allowing it to
be duplicated.

The precise protocols and source syntax for oracles remain open. In particular,
the surface language may be able to sugar oracle-tree management much more
heavily than the full semantics used to explain referential transparency.

**Design reminder:** discuss oracle syntax next, including how programs receive,
split, and spend oracle authority and which common races can hide the tree
plumbing behind safe sugar.

## Stream merging

An oracular merge can consume oracle authority and merge two or more ordered
input streams. It preserves order within each input, selects the interleaving
oracularly, and forwards each selected item exactly once. Fairness is a separate
property and must be stated rather than inferred merely from nondeterministic
choice.

## Demand, scheduling, and abandonment

First-class items and failures move forward through the operator graph. Demand
moves backward from consumers toward the operators needed to produce their
inputs. Output devices and other externally observed results are persistent
roots of demand.

Work with demanded output receives runtime service; work with no demanded
output receives no scheduling priority. Backward demand carries effective
urgency through dependency paths, providing priority donation and reducing
priority inversion. Work with equal effective priority must receive fair
service.

Demand belongs to active paths, not merely to the existence of an asker. If
several consumers demand one calculation, withdrawal by one does not cancel the
others. If all demand is withdrawn, the runtime may abandon the calculation.

An oracle-authorized race between a calculation and a control flow can implement
cancellation. If control resolves first, demand is withdrawn from the
calculation; if the calculation resolves first, its result is forwarded. If both
are eligible at the semantic decision point, oracle authority accounts for the
choice.

Withdrawal must be noticed at bounded safe points. Foreign or primitive
operations must provide safe points or declare that they cannot be interrupted.
Abandonment cannot undo already committed output and must not silently strand
observable linear obligations.

Merge and throttle operators may transform demand to express urgency, weight,
deadline, or work budget. The exact demand protocol remains open.

## Pure procedures and mathematical functions

A pure procedure is constant code with no captured environment. Purity of
representation alone does not prove that the procedure implements a
mathematical function: its permitted operations and arguments matter as well.

A sufficient condition for a pure procedure to implement a partial mathematical
function is that:

- its inputs are values rather than authority-bearing items;
- it performs no externally observable telling;
- it exercises no oracle or environmental capability;
- it cannot observe scheduling, time, identity, or representation;
- every procedure it calls satisfies the corresponding conditions.

Under those conditions its output depends only on its inputs. The function may
be partial because execution may diverge or resolve to failure. Internal local
flows and tellers need not disqualify an implementation if they have no
externally observable effect, so prohibiting every telling operation would be a
sufficient but unnecessarily strong rule.

A future effect or capability type system may make such claims mechanically
checkable.

## Foreign-language front ends and interoperability

The execution model appears capable of supporting front ends for functional and
logic languages. Haskell-like laziness maps naturally to demand and suspended
flows; Prolog-like logical variables, unification, and search map naturally to
flows, constraints, and oracles. Full front ends would nevertheless have to
account for language-specific semantics such as Haskell's bottom, type classes,
and `IO`, and Prolog's backtracking, cut, and dynamic database operations.

Interlanguage calls should preserve the full power of each participating
language through a shared item, capability, failure, demand, cancellation, and
oracle protocol rather than reducing every language to a lowest common
denominator.

## JavaScript host interface

In a JavaScript environment, application assembly should explicitly choose the
authority granted to Llull-02 code. A Llull component may receive:

- suitably scoped oracle authority; and
- the sending end of a message channel connected to a JavaScript service
  dispatcher.

The application assembler provides an index of the JavaScript facilities that
may be requested. Llull code receives no ambient authority to invoke arbitrary
JavaScript. Messages may identify indexed services and carry reply tellers.
This is a capability-secure route to browser facilities such as widgets.

Sending a command need not block the bridge. JavaScript may start an entire
reactive chain in response and may run several such chains concurrently. Results
and failures return through explicit capabilities carried in messages. The
bridge will eventually need protocols for cancellation, error reporting,
backpressure, demand, and the classification of environmental observations as
oracle-consuming operations.

## Compile-time and runtime strata

Compilation constructs program artifacts; it is not ordinary Llull-02 runtime
code interpreted early. Runtime names denote flows and use asker/teller
capabilities. Artifact definitions do not use `!` merely because they bind a
name.

Declarative compile-time computation and programmatic artifact construction may
eventually be added as explicit facilities. They should not collapse the
distinction between compile-time composition and runtime execution.

## Open design work

Important unresolved subjects include:

- oracle syntax and sugar for affine oracle trees;
- the canonical reflected-call record and explicit reflection operations;
- field access, record extension, duplicate fields, and record ordering;
- safe remainder syntax for destructuring;
- optional procedure parameters;
- channel closure;
- the exact static type, multiplicity, capability, and effect systems;
- module qualification, artifact sealing, and hot updates;
- persistence and inferred transaction boundaries;
- demand transformation, fairness, and cancellation protocols;
- parser implementation technology;
- the foreign-language ABI and JavaScript bridge protocol.

Parser technology has deliberately not yet been selected. Traditional LR tools
such as Yacc are plausible, as are freely available JavaScript or TypeScript
parser libraries. When implementation begins, compatibility with Deno without a
mandatory Node runtime is preferred.

> Developed through design discussion between Jack Waugh and OpenAI Codex.
