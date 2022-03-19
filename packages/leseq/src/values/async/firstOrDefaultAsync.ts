import {AsyncSeq} from "../../asyncSeq";

/**
 * Returns the first element of the current sequence.
 * If the condition is set, the first element of the element that meets the condition is returned.
 * If the element is not found, such as when the sequence is empty, it returns the default value.
 *
 * ```typescript
 * // When the condition is not set
 * const result1 = await fromAsAsync([1,2,3,4]).valueAsync(
 *   firstOrDefaultAsync()
 * );
 *
 * //result1: 1
 *
 * // When the condition is set
 * const result2 = await fromAsAsync([1,2,3,4]).valueAsync(
 *   firstOrDefaultAsync(i => i % 2 == 0)
 * );
 *
 * //result2: 2
 *
 * // No conditions set and the sequence is empty
 * const result3 = await fromAsAsync([]).valueAsync(
 *   firstOrDefaultAsync(9999)
 * );
 *
 * //result3: 9999
 *
 * // If none of the elements of the sequence meet the criteria
 * const result4 = await fromAsAsync([1,2,3,4]).valueAsync(
 *   firstOrDefaultAsync(i => i >= 5, 9999)
 * );
 *
 * //result4: 9999
 * ```
 *
 * @param predicate Condition.
 * @param defaultValue Default value.
 * @typeParam T Source element type.
 * @returns The first element of the sequence, or the default value.
 * @category Values
 */
export const firstOrDefaultAsync = <T>(predicate: (arg: T, index: number) => Promise<boolean> = () => Promise.resolve(true), defaultValue: T | undefined = undefined) =>
  async function firstOrDefaultAsync(seq: AsyncSeq<T>): Promise<T | undefined> {
    let count = 0;
    for await (const i of seq) {
      if (await predicate(i, count)) {
        return i;
      }
      count++;
    }
    return defaultValue;
  };
