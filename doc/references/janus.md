# Janus Sources

This note records what could be established about the Janus concurrent-constraint programming language associated with Vijay A. Saraswat, Kenneth M. Kahn, and Jacob Levy. It was researched on 2026-08-08.

## Conclusion

Janus had an unpublished description, published extended treatments, implementations, and implementation documentation. No single surviving, authoritative, complete language definition was located during this search.

It would therefore be too strong to say that no fuller definition ever existed. The available evidence instead suggests that an unpublished document, *Programming in Janus*, served as a working specification for at least one implementation.

## Principal Descriptions

- Vijay A. Saraswat, Kenneth M. Kahn, and Jacob Levy, *Programming in Janus*, December 1989. [Saraswat's bibliography](https://www.saraswat.org/older-papers.html) explicitly labels this work “unpublished” and links an extended abstract.
- Vijay A. Saraswat, Kenneth M. Kahn, and Jacob Levy, *Janus: A Step Towards Distributed Constraint Programming*, *Proceedings of the 1990 North American Conference on Logic Programming*, pp. 431–446. Saraswat's bibliography identifies this as the published 1990 treatment and links an extended abstract.
- Kenneth M. Kahn and Vijay A. Saraswat, [“Actors as a Special Case of Concurrent Constraint Programming”](https://doi.org/10.1145/97946.97955), *OOPSLA/ECOOP 1990*, pp. 57–66. This paper presents Lucy as a deliberately restricted syntactic subset of Janus; it is not a complete Janus definition.

## Implementations and Operational Evidence

Janus was implemented, so the language existed operationally beyond the published descriptions.

- Saumya K. Debray, [“QD-Janus: A Sequential Implementation of Janus in Prolog”](https://www2.cs.arizona.edu/~debray/Publications/qdjanus.pdf), *Software: Practice and Experience* 23(12), 1993. QD-Janus translated Janus programs to SICStus Prolog and supplied a runtime library.
- David Gudeman, Koenraad De Bosschere, and Saumya K. Debray, [“jc: An Efficient and Portable Sequential Implementation of Janus”](https://www.researchgate.net/publication/2418290_jc_An_Efficient_and_Portable_Sequential_Implementation_of_Janus), *Joint International Conference and Symposium on Logic Programming*, 1992. The `jc` compiler translated Janus to C.
- A contemporary compiler catalog described QD-Janus as “mostly compliant” with *Programming in Janus*. This supports the inference that the unpublished work functioned as a language specification, though it does not establish that the document was complete or definitive.
- The `jc` paper describes Janus's important **two-occurrence restriction**. In a clause, a variable not known to be fixed or ground may occur at most twice: once as a readable occurrence and once as a writable occurrence. Only the writable occurrence may be assigned. The restriction makes such variables point-to-point communication channels and statically prevents conflicting tells. Other constructs provide one-to-many and many-to-one communication.

The two-occurrence restriction is especially relevant to this project's exploration of whether tellers should be affine, dynamically checked, or copyable under some other rule. Original Janus represents the strict, statically restricted branch of that design space; it need not determine the choice made by every language explored here.

## Search Ambiguity

“Janus” has been used for several unrelated systems, including a reversible imperative programming language, an older intermediate language associated with UNCOL, and newer software and programming-language projects. Searches should therefore include author names such as `Saraswat`, `Kahn`, or `Levy`, or terms such as `concurrent constraint`, `asker`, and `teller`.

## Remaining Leads

Potentially useful surviving material includes old QD-Janus and `jc` distributions, their user manuals, the PostScript extended abstracts linked from Saraswat's bibliography, and archived copies of former University of Arizona FTP holdings. Together they may permit a more complete reconstruction even if an authoritative full definition cannot be recovered.
