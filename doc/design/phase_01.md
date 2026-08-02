
# Design Phase 01

In this phase of the design, we will think about a dialect characterized by the following decisions:

- Declarative notation. Defer any work on "ergonomics" that might look superficially somewhat like imperative code.
- Dynamic typing.
- Lexical rules like those of FORTH: whitespace (and comments) delimits words.
- No reserved words; language marks can use words with punctuation, e. g. `-if`, `-then`, `-else`, `/if`.
- Dialects lacking in imperative-like ergonomics cannot be named as variants of "Imperatrix Mundi". Instead, perhaps they can be named after Ramon Llull in honor of his writings regarding elections. If a piece of music can be named after an architect, so a piece of computer science can be named after an innovator on social choice.
- This strictly-declarative dialect should be designed to be theoretically as usable as feasible for real reactive applications, subject to the absence of imperative-like ergonomics. Designing this dialect differs from the idea of designing an assembly language corresponding directly to the execution model.

Decisions about syntax apply only to the present phase of design. Decisions about the execution model apply to the project as a whole.

## Further ideas and questions

- Does the decision to defer any design for static typing overcomplicate the design of the runtime by requiring it to include a model of how to deal with runtime type errors? Does Erlang's "let it crash" philosophy in any way come to the rescue? That might not fit well with our concurrent-constraint model copied from the work of Saraswat and Kahn.
- Comments to end of line can be marked with `#` as a word. This is similar to shell syntax except with regard to the word requirement. Or should it be `//` instead (as in Ada), reserving `#` to indicate named symbols, like in Ruby?
- Comments delimited at start and end can be marked with `/*` and `*/` words. This is similar to PL/1 commenting, except possibly for the word requirement and except that these comments nest.
- One of the first syntaxes to be laid out should be that for sending a message to a process.
- Should the easier syntax be designed to deal with a channel that carries oracular capability internally and implements a bag channel (is this even mathematically possible)? Or should the easier syntax be for oracle-free communication? Which should be the "norm" in a language intended to be used for building reactive programs? Maintaining order of the messages could amount to an overspecification in some cases, maybe? Or maybe maintaining order should be routine, since a process is conceptually different from a value, and programmers should understand that order might matter to a process. Absence of oracular capability is conceptually simpler than its presence.
- Conventional programming languages have expressions for values, similar to mathematical notation in that regard. However, it is possible to design expressions whose meaning as understood statically differs from what could be expressed as a single value in the execution model. We could for example allow multiple components of value as the elaboration of expressions. Statically we can say what we are doing with the components. A name could be defined with <identifier> `:=` <expression> `.` (if we end sentences with a period, like in Smalltalk). The code could then repeat the identifier for purposes of talking about its components. But doing this would not mean that the runtime model is referring to one data flow more than once. The data flows can all be linear or affine, consistent with such notation, on account of the divide between static and dynamic semantics, even though the dynamic interpretation of the program results from evaluating the static semantics. Should we apply such concepts to the syntax for sending a message along an ordered channel to a process? One of the results of sending the message is the reference to the next channel for sending the next message. But we might want another result, being a reply value sent back to us by the target process as it interprets our message.
- What do juxtaposed identifiers mean?
  * In C `a b` is illegal.
  * In Smalltalk, `a b` means `a.b()`, i. e. send a message whose verb is "b" to an object referenced by `a`, and the value of the expression is the value returned by the called method.
  * In Haskell, `a b` means `a(b)`, i. e. call what `a` refers to as a function applied to an argument given by the value of `b`.

I lean toward the Smalltalk model for juxtaposition, but I don't know how it fits with the idea of capturing both, the next channel and a returned value. One way is to say that process calls don't have a returned value and if we want a value back, we pass a teller.

Recall that the main reason to have expressions in a programming language is for the abbreviating power that comes from being able to nest them and avoid naming every subexpression. What syntax for messaging processes can be most usefully nested? Should we more or less copy the semicolon syntax that Smalltalk uses for sending multiple messages to the "same" receiver (in our case, successive receiver process states)?

> Written with [StackEdit](https://stackedit.io/).
