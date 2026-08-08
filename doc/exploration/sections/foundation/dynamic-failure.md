---
section: foundation.dynamic-failure
imports:
  - foundation.flows
  - foundation.equality
status: provisional
---

# Dynamic Checking and Stable Failure

Some language branches will perform all type checking dynamically even though the project is expected eventually to support source type annotations.

## Commits

- A dynamically detected invalid operation must not silently produce an ordinary value.
- Stable failure information may resolve a flow instead of an ordinary item.
- A failed outcome is permanent: it cannot later become a successful binding or a different failure.
- Failure propagation must not depend upon unobservable machine scheduling.
- No exception-like, invisible transfer of control is assumed by this section.

## Provisional Model

A dynamic operation produces either its ordinary result or stable failure information. A dependent operation that requires a failed input ordinarily produces a related failed outcome. This treats failure as monotonic information in the computation graph rather than as mutation of unrelated state.

Subject to the same explicit inputs and oracle answers, an error-free execution should retain the laws of the declarative core. The intended stronger goal is that executions containing failure also have deterministic, compositional meanings; the exact laws and recovery protocol have not yet been selected.

## Questions

- Is failure a distinct flow state, an ordinary first-class result, or are both representations needed at different boundaries?
- Does every use of a failed flow propagate failure, or can selected operators inspect it explicitly?
- What is the declarative form of attempting a computation and handling its failure?
- When several inputs have failed, which failure information becomes observable, and can that choice depend on scheduling?
- Does a dynamic attempt to compare procedures fail its result flow?
- How are errors scoped to computations so that unrelated outputs can continue?
- Can a failure itself contain capabilities or references to failed inputs?
- What guarantees can be made about partial output before a failure becomes known?

