# Design Exploration

This directory holds a modular exploration of a family of programming-language designs. A document section describes a reusable partial design, not necessarily a complete language. Candidate languages select and combine partial designs by importing them.

The organization is:

```text
glossary/   shared technical vocabulary
sections/   reusable design commitments and alternatives
candidates/ assembled language proposals, when any exist
indices/    dimensions, questions, and other cross-cutting views
```

Directories and files exist for readers and may be rearranged. Logical section names are stable and do not depend on paths.

## Section Format

A design section begins with YAML front matter:

```yaml
---
section: foundation.flows
imports:
  - foundation.first-class-items
status: accepted
---
```

`section` is a globally unique logical name. `imports` is an explicit list of logical names; it may be empty. `status` is one of:

- `accepted`: part of the current common foundation;
- `provisional`: a working design that remains open to revision;
- `alternative`: one branch of the design space;
- `candidate`: an assembly intended to describe a language.

A hierarchical name does not imply an import. For example, `foundation.flows.failures` does not import `foundation.flows` unless its metadata says so.

Several sections may reside in one file if each has its own front matter and heading. One section per file is preferred when a section is substantial or independently reusable.

## Imports

Importing sections means accepting their commitments together. Imports form a directed acyclic graph; import cycles are invalid. An importing section may add commitments or refine an imported design, but it must not silently contradict it.

If replacement is useful while exploring an alternative, it must be explicit:

```markdown
Replaces:

- The imported commitment being replaced.

With:

- The alternative commitment.
```

Incompatible imports expose a real design conflict. They do not acquire a meaning merely by being listed together.

## Section Contents

A section uses only the headings it needs:

- **Commits** records normative design decisions.
- **Requires** records conditions that another design or implementation must provide.
- **Forbids** records excluded behavior.
- **Adds**, **Replaces**, and **With** describe refinements and explicit alternatives.
- **Consequences** records deductions and expected implications rather than independent commitments.
- **Questions** records matters deliberately left unresolved.
- **Notes** supplies examples and non-normative explanation.

The words **must**, **must not**, **may**, and **should** are normative only under a normative heading such as **Commits**, **Requires**, or **Forbids**. Prose under **Questions** and **Notes** does not settle a design decision.

## Glossary

Glossary entries define the vocabulary used to discuss designs. A glossary reference is not an import and introduces no design commitment by itself. Definitions should avoid silently resolving disputed questions; when traditions disagree, an entry should state the local usage and mention important alternatives.

Glossary terms have stable identifiers such as `term.flow` and `term.referential-transparency`. The identifiers need not reproduce the physical file hierarchy.

## Notation and Concrete Syntax

Sections may use prose, abstract syntax, semantic equations, judgments, tables, or diagrams. Such notation describes abstract structure and behavior unless a section explicitly commits to concrete syntax.

The preferred separation is:

```text
surface syntax → elaborated/core language → semantic model
```

This permits C-like, Forth-like, graphical, and other surface languages to share a semantic foundation. Names such as `Apply(f, x)` are abstract constructors, not proposed source spelling.

