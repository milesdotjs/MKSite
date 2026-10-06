/**
 * One line of the repertoire, in plain SAN from the starting position.
 *
 * `weight` is how often Miles reaches for this line when several lines fork
 * at the same position (the Ruy Lopez vs the Scotch, the Najdorf vs the
 * Dragon). It only matters at the fork; once a line is chosen the bot follows
 * it as long as the opponent stays in it.
 *
 * `name` is what the bot calls the opening while it is in this line. When
 * several lines pass through a position the displayed name is their longest
 * common prefix, so "Sicilian Defense" narrows to "Sicilian Defense: Najdorf
 * Variation" on its own once 5...a6 is on the board.
 */
export type Line = {
  moves: string;
  name: string;
  weight?: number;
};
