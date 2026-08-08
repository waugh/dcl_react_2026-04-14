# Core Glossary

Glossary definitions establish local terminology but do not themselves impose design commitments. Normative commitments appear in named sections.

## Aggregate {#term.aggregate}

A first-class item composed of other first-class items. Records, tuples, closures, and—where a language supports them—objects are aggregates in this broad sense. Calling a closure an aggregate emphasizes that it contains code together with a captured environment; it does not require a surface language to expose that representation.

## Asker {#term.asker}

A reference to a flow carrying the capability to query or observe its outcome, but not to resolve it. An asker may also participate in propagating demand.

## Attenuation {#term.attenuation}

The derivation of a capability granting less authority from one granting more authority. Deriving an asker from a teller is attenuation.

## Capability {#term.capability}

A first-class item whose possession conveys authority to perform or request an operation. Askers, tellers, and oracle capabilities are examples.

## Closure {#term.closure}

Executable procedure code together with a captured environment containing the first-class items needed by that code.

## Copyable {#term.copyable}

Safe to duplicate without duplicating restricted authority or changing observable behavior. Copyability is distinct from being first-class and from sharing one runtime representation.

## Error {#term.error}

Information describing why an operation could not produce an ordinary result. The design distinguishes an ordinary first-class representation of error information from a flow's possible failed outcome; the exact protocols remain under exploration.

## First-class item {#term.first-class-item}

Anything that may be passed as an argument, returned from a call, carried by a flow, or included in an aggregate. First-class status does not imply copyability, comparability, printability, or observable allocation identity.

## Flow {#term.flow}

An initially unresolved, one-shot logical variable that can acquire one stable outcome. “Flow” emphasizes its role as an edge carrying information through a computation. Asking and telling references separately convey authority over it.

## Oracle {#term.oracle}

An explicitly supplied capability through which a program may obtain information or choices from outside its referentially transparent declarative core. Environmental input and deliberate races are possible uses.

## Procedure {#term.procedure}

Executable code. This collection distinguishes constant procedure code from a closure, which combines procedure code with a captured environment.

## Referential transparency {#term.referential-transparency}

The property that an expression can be replaced by its value without changing program behavior, subject to the same explicit inputs, including any oracle answers.

## Symbol {#term.symbol}

An atomic value supporting equality with symbols. A symbol may be written as a program constant or freshly supplied through an oracle. Symbol equality provides nominal distinction without exposing the allocation identity of general objects.

## Teller {#term.teller}

A reference to a flow carrying the capability to resolve it. A teller may be attenuated into an asker. Whether tellers are affine, linear, or copyable under restricted rules is an open design dimension.

## Value equality {#term.value-equality}

Comparison according to a value's defined content, as in `2 = 2`. Value equality is distinct from testing whether two references designate the same runtime allocation.

