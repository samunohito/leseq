import {Seq, SeqToValue} from '../seq';

/**
 * Returns the first element of the current sequence.
 * If the condition is set, the first element of the element that meets the condition is returned.
 * If the element is not found, such as when the sequence is empty, an error is thrown.
 *
 * ```typescript
 * // When the condition is not set
 * const result1 = from([1,2,3,4]).value(first());
 *
 * //result1: 1
 *
 * // When the condition is set
 * const result2 = from([1,2,3,4]).value(first(i => i % 2 == 0));
 *
 * //result2: 2
 * ```
 *
 * @param predicate Condition.
 * @typeParam T Source element type.
 * @returns The first element of the sequence.
 * @category Values
 */
export const first = <T>(predicate: (arg: T, index: number) => boolean = () => true): SeqToValue<T, T> =>
  function first(seq: Seq<T>): T {
    let count = 0;
    for (const i of seq) {
      if (predicate(i, count)) {
        return i;
      }
      count++;
    }
    throw RangeError(`No elements matching the condition were found.`);
  };
