---
section: foundation.flows
imports:
  - foundation.first-class-items
status: accepted
---

# Flows and Directional Capabilities

## Commits

- A flow is an initially unresolved, one-shot logical variable.
- A flow may acquire one stable outcome carrying any first-class item. Stable failure is also admitted as a possible outcome; its detailed semantics are provisional.
- An asker permits observation of a flow's outcome but not resolution of the flow.
- A teller permits resolution of a flow.
- Askers and tellers are first-class items.
- A teller can be attenuated into an asker. Attenuation neither consumes nor otherwise weakens the teller.
- An asker cannot be used to derive telling authority.
- An operation requiring an unresolved input may suspend until the required information becomes available.
- Once a flow is successfully bound to an item, ordinary use through an asker is observationally equivalent to use of that item, apart from the waiting that may precede resolution.

One provisional representation of the state is:

```text
FlowState α :=
    Unresolved
  | Bound α
  | Failed Error
```

This notation is semantic notation, not concrete source syntax.

## Forbids

- A flow outcome must not be replaced after the flow has resolved.
- Possession of an asker alone must not confer authority to bind the flow.

## Questions

- Are tellers affine, linear, dynamically single-use, or copyable with a rule governing repeated binding attempts?
- If two attempts propose equal values, is the second attempt erroneous, redundant, or a form of unification?
- How can agreement be defined when values include procedures or structures for which equality is unavailable?
- Can flows be bound circularly or to aggregates that contain askers for themselves?
- Is asker identity observable in any circumstance? The current direction says no.
- How are suspension, failure propagation, cancellation, and abandoned demand reflected in the semantic model?

## Notes

Original Janus represents one strict branch of the teller design: its two-occurrence restriction statically limited a non-ground variable to one readable and one writable occurrence in a clause. See `doc/references/janus.md`.

