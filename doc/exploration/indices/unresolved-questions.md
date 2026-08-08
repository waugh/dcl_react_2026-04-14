# Unresolved Design Questions

This is a navigational index, not a normative section. The authoritative context for each question remains the named section.

## Flows and Tellers

See `foundation.flows`.

- Must a teller be affine or linear, or can controlled copying be coherent?
- Is a repeated equal binding redundant, erroneous, or unification?
- What should a dynamic dialect do when conflicting tells occur?
- Are circular bindings forbidden by an occurs check or admitted as rational structures?

## Dynamic Checking and Failure

See `foundation.dynamic-failure`.

- Is failure a terminal flow state, first-class data, or both?
- How can failure be inspected and handled without hidden control effects?
- What deterministic rule combines failures from concurrent dependencies?
- Which declarative laws hold for executions that encounter errors?

## Equality

See `foundation.equality`.

- Which aggregates admit structural equality?
- What happens when equality reaches an unresolved flow or a capability?
- How does structural equality handle cycles?

## Closures and Usage Constraints

See `foundation.first-class-items`.

- Is structural propagation of copyable, affine, and linear usage through captured environments sufficient?
- Which closure details, if any, are visible to source programs?

## Oracles

See `foundation.oracles`.

- How are oracle capabilities split, delegated, recorded, and replayed?
- What fairness law governs race selection?
- Which external services belong behind oracle protocols?

## Later Design Dimensions

The following dimensions have been identified but do not yet have sections:

- primitive records versus message-interpreting objects;
- C-like versus Forth-like lexical rules;
- static, gradual, and fully dynamic checking;
- evaluation strategy and ordering;
- concrete syntax and elaboration;
- hot-code update and migration;
- persistence and inferred transaction boundaries;
- demand, cancellation, priority, and fairness.
