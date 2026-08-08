---
section: foundation.equality
imports:
  - foundation.first-class-items
status: accepted
---

# Equality Without Allocation Identity

## Commits

- Constants may support value equality; for example, `2 = 2`.
- Symbols support equality. Oracle-supplied fresh symbols can therefore provide controlled nominal distinction.
- The language does not expose a general operation analogous to Smalltalk object identity.
- Identity of records, tuples, closures, objects, flows, askers, and tellers is not observable as runtime allocation identity.
- Equality tests on procedures and closures are forbidden. Attempting such a test is invalid rather than producing `false` merely because two runtime representations differ.

## Consequences

Implementations may copy, share, intern, relocate, or reconstruct ordinary immutable values when doing so preserves their defined observations.

Fresh symbols provide names that can be compared without turning every allocated object into an identity-bearing entity.

## Questions

- Which aggregates support structural equality?
- How does structural equality interact with unresolved flows, capabilities, and potentially circular structures?
- Is an invalid equality comparison always rejected statically where possible and reported as stable failure otherwise?
- Are numeric equality and equivalence across numeric representations language-wide or dialect-specific?

