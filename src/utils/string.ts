/**
 * Return the position of line starting from passed point
 *
 * ┌───────────────┐
 * │1234\n         │
 * │2eda | dadd\n  │ <-- returns 5
 * └───────────────┘
 * @param string - string to process
 * @param position - search starting position
 * @returns
 */
export function getLineStartPosition(string: string, position: number): number {
  const charLength = 1;
  let char = '';

  /**
   * Iterate through all the chars before the position till the
   * - end of line (\n)
   * - or start of string (position === 0)
   */
  while (char !== '\n' && position > 0) {
    position = position - charLength;
    char = string.substr(position, charLength);
  }

  /**
   * Do not count the linebreak symbol because it is related to the previous line
   */
  if (char === '\n') {
    position += 1;
  }

  return position;
}
