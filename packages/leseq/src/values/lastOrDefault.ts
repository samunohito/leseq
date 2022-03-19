import {Seq} from '../seq';

/**
 * Returns the last element of the current sequence.
 * If the condition is set, the last element of the element that meets the condition is returned.
 * If the element is not found, such as when the sequence is empty, it returns the default value.
 *
 * ```typescript
 * // When the condition is not set
 * const result1 = from([1,2,3,4]).value(lastOrDefault());
 *
 * //result1: 4
 *
 * // When the condition is set
 * const result2 = from([1,2,3,4]).value(lastOrDefault(i => i % 2 == 0));
 *
 * //result2: 4
 *
 * // No conditions set and the sequence is empty
 * const result3 = from([]).value(lastOrDefault(9999));
 *
 * //result3: 9999
 *
 * // If none of the elements of the sequence meet the criteria
 * const result4 = from([1,2,3,4]).value(lastOrDefault(i => i >= 5, 9999));
 *
 * //result4: 9999
 * ```
 *
 * @param predicate Condition.
 * @param defaultValue Default value.
 * @typeParam T Source element type.
 * @returns The last element of the sequence, or the default value.
 * @category Values
 */
export const lastOrDefault = <T>(predicate: (arg: T, index: number) => boolean = () => true, defaultValue: T | undefined = undefined) =>
  function lastOrDefault(seq: Seq<T>): T | undefined {
    const meetTheConditions = []
    let count = 0;

    for (const i of seq) {
      if (predicate(i, count)) {
        meetTheConditions.push(i);
      }
      count++;
    }

    if (meetTheConditions.length >= 1) {
      return meetTheConditions[meetTheConditions.length - 1]
    }

    return defaultValue;
  };
