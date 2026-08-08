---
section: foundation.first-class-items
imports: []
status: accepted
---

# First-Class Items

## Commits

- An item is first-class if it may be passed as an argument, returned from a call, carried by a flow, or included in an aggregate.
- Constants, constant procedure code, askers, tellers, and aggregates are first-class items.
- Records, tuples, and closures are aggregates. Objects are aggregates in language branches that support objects.
- Being first-class does not imply that an item is copyable, comparable, printable, or possessed of observable allocation identity.
- Constants and procedure code without a captured environment are copyable.
- An aggregate is copyable exactly when all of its components are copyable.

## Consequences

A closure's copyability follows from the code and captured environment it contains. Capturing an affine or linear capability prevents the closure from being freely copied; capturing only copyable items permits copying.

Copying an immutable aggregate and sharing one representation of it should be observationally indistinguishable when the language exposes no allocation identity.

## Questions

- Does every dialect expose closures as a distinct source-level category?
- Are any constant categories intentionally non-copyable?
- Besides copyability, which aggregate usage classes—affine or linear—are fundamental?

