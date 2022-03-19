import {AsyncSeq, AsyncSeqToValue} from "../../asyncSeq";

/**
 * Returns the last element of the current sequence.
 * If the condition is set, the last element of the element that meets the condition is returned.
 * If the element is not found, such as when the sequence is empty, an error is thrown.
 *
 * ```typescript
 * // When the condition is not set
 * const result1 = from([1,2,3,4]).value(last());
 *
 * //result1: 4
 *
 * // When the condition is set
 * const result2 = from([1,2,3,4]).value(last(i => i % 2 == 0));
 *
 * //result2: 4
 * ```
 *
 * @param predicate Condition.
 * @typeParam T Source element type.
 * @returns The last element of the sequence.
 * @category Values
 */
export const lastAsync = <T>(predicate: (arg: T, index: number) => Promise<boolean> = () => Promise.resolve(true)): AsyncSeqToValue<T, T> =>
  async function lastAsync(seq: AsyncSeq<T>): Promise<T> {
    const meetTheConditions = []
    let count = 0;
    for await (const i of seq) {
      if (await predicate(i, count)) {
        meetTheConditions.push(i);
      }
      count++;
    }

    if (meetTheConditions.length >= 1) {
      return meetTheConditions[meetTheConditions.length - 1]
    }

    throw RangeError(`No elements matching the condition were found.`);
  };
