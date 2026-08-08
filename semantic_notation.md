# Syntax-Neutral Semantic Notation

Yes. This is not only feasible; it is a well-established way to design languages.

Define constructs using an **abstract syntax**—trees, algebraic data types, judgments, or semantic combinators—rather than textual grammar. For example:

```text
Expr :=
    Literal(Value)
  | Variable(Name)
  | Apply(Expr, Expr)
  | Bind(Name, Expr, Expr)
```

Then give semantics over these constructors:

```text
eval(Apply(f, x), env) =
    apply(eval(f, env), eval(x, env))
```

Nothing here determines whether application eventually looks like `f(x)`, `(f x)`, `x |> f`, a diagram, or structured editor nodes.

Useful semantic notations include:

- Operational semantics: transition or evaluation judgments
- Denotational semantics: mappings into mathematical domains
- Algebraic/effect-handler semantics
- Type-system judgments
- Abstract machines
- Interpreter code over an AST
- Graphical or tabular semantic descriptions

This separation supports a family of concrete languages sharing one semantic core. Each surface language merely supplies a parser from its concrete syntax into the common abstract representation—and perhaps a printer in the other direction.

Complete syntax neutrality has limits, however. Some apparently syntactic choices carry semantic commitments:

- Name binding and scope
- Evaluation order
- Precedence where sequencing matters
- Source locations and error behavior
- Macros, quotation, and reflection
- Layout or token-sensitive constructs
- Distinctions erased during translation into an overly coarse AST

A good design therefore separates at least three layers:

```text
surface syntax → elaborated/core language → semantic model
```

Design the small core language semantically, then let one or more surface languages elaborate into it. The key is to avoid presenting the abstract constructors in notation so polished and convenient that they quietly become the presumed concrete syntax. S-expressions often suffer this fate: intended as neutral tree notation, they are readily mistaken for the language itself.

So the practical answer is: **defer concrete syntax, but specify abstract structure precisely**. Semantics needs something to attach to; that something need not be textual syntax.
