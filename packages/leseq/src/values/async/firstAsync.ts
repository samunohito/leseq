import {AsyncSeq, AsyncSeqToValue} from "../../asyncSeq";

/**
 * Returns the first element of the current sequence.
 * If the condition is set, the first element of the element that meets the condition is returned.
 * If the element is not found, such as when the sequence is empty, an error is thrown.
 *
 * ```typescript
 * // When the condition is not set
 * const result1 = await fromAsAsync([1,2,3,4]).valueAsync(
 *   firstAsync()
 * );
 *
 * //result1: 1
 *
 * // When the condition is set
 * const result2 = await fromAsAsync([1,2,3,4]).valueAsync(
 *   firstAsync(i => i % 2 == 0)
 * );
 *
 * //result2: 2
 * ```
 *
 * @param predicate Condition.
 * @typeParam T Source element type.
 * @returns The first element of the sequence.
 * @category Values
 */
export const firstAsync = <T>(predicate: (arg: T, index: number) => Promise<boolean> = () => Promise.resolve(true)): AsyncSeqToValue<T, T> =>
  async function firstAsync(seq: AsyncSeq<T>): Promise<T> {
    let count = 0;
    for await (const i of seq) {
      if (await predicate(i, count)) {
        return i;
      }
      count++;
    }
    throw RangeError(`No elements matching the condition were found.`);
  };
