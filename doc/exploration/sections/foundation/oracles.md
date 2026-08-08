---
section: foundation.oracles
imports:
  - foundation.first-class-items
  - foundation.equality
status: provisional
---

# Oracles and Deliberate Nondeterminism

## Commits

- An oracle is an explicitly supplied capability connecting a declarative computation to information or choices from its external environment.
- Oracle capabilities are first-class items.
- Deliberate races and other observably nondeterministic choices require suitable oracle authority.
- Differences in machine scheduling alone must not change an observable program result when no oracle authorizes the choice.
- A fresh symbol may be obtained through an oracle and compared using symbol equality.
- Referential transparency is considered relative to explicit program inputs and the oracle answers supplied during an execution.

This relationship may be summarized as:

```text
observable result = program(program input, oracle answers)
```

## Consequences

Recording oracle answers may permit deterministic replay. Dividing oracle capabilities may delimit which components are authorized to observe or stage nondeterministic choices.

## Questions

- What operations do the fundamental oracle protocols provide?
- Can an oracle capability be copied, split, attenuated, or delegated, and with what usage constraints?
- How are answers recorded and replayed?
- What fairness laws apply to an oracle used to choose among ready computations?
- Which services besides fresh symbols and race selection belong at this boundary?
- How are external errors represented?

