# PGN files

The app loads PGN archives from this folder. Filenames are case-sensitive on most servers and must match the `file` paths in `PLAYERS` config (see `script.js`).

## Currently bundled players

Grouped roughly the way the dropdown displays them:

- **World Champions & Pre-Champions:** Morphy, Anderssen, Lasker, Capablanca, Alekhine, Euwe, Botvinnik, Smyslov, Tal, Petrosian, Spassky, Fischer, Karpov, Kasparov, Anand, Carlsen, Ding
- **Elite Contemporary:** Caruana, Nepomniachtchi, Aronian, VachierLagrave, Giri, Grischuk, So, Rapport, Topalov, Ivanchuk, Leko, Gelfand, Shirov, Kamsky, Adams, Short, DominguezPerez, Andreikin, Bacrot, WangH, Le, Korobov, Jobava
- **Rising Stars:** Gukesh, Praggnanandhaa, Abdusattorov, Wei, Yu, Keymer
- **Historical Legends:** Philidor, McDonnell, Chigorin, Blackburne, Tarrasch, Pillsbury, Marshall, Reti, Saemisch, Najdorf, Reshevsky, Korchnoi, Larsen, Andersson, Byrne, Benko, Evans, Nunn, Seirawan
- **Women's Greats:** PolgarJ (Judit), PolgarS (Susan), PolgarZ (Sofia), Hou, Kosteniuk, Muzychuk, Gaprindashvili, Krush
- **American GMs:** Ashley, Finegold, Shabalov, Onischuk, Dzindzichashvili

## Source

Most files come from PGN Mentor: https://www.pgnmentor.com/files.html#players

## Adding a new player

1. Drop the `.pgn` file into this folder.
2. Add an entry to the `PLAYERS` array in `script.js` with `id`, `label`, `file`, and `group`.

## Format expectations

Standard PGN: bracketed `[Tag "value"]` headers followed by movetext, multiple games per file OK. Comments in `{ }` are stripped before move counting; variations in `( )` are sent to Lichess on import as-is.
