import {
  concatAsync,
  fromAsAsync,
  tapAsync,
  concatValueAsync,
  skipAsync,
  skipWhileAsync,
  filterAsync,
  filterNotNullAsync,
  flattenAsync,
  mapAsync,
  mapNotNullAsync,
  orderByAsync,
  takeAsync,
  takeWhileAsync,
  uniqAsync,
  chunkAsync,
  scanAsync,
  groupByAsync,
  unionAsync,
  differenceAsync,
  intersectAsync,
  reverseAsync
} from '../src';
import { abortableSleep } from './testUtil';

test('operator: simple concatAsync', async () => {

  const asyncSource = fromAsAsync([6,7]).pipe(tapAsync(async () => abortableSleep(20)))

  const output = await fromAsAsync([1, 2, 3, 4, 5])
    .pipe(concatAsync(asyncSource))
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test('operator: simple concatValueAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).pipe(concatValueAsync(6)).toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6]);
});

test('operator: simple skipAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).pipe(skipAsync(2)).toArrayAsync();
  expect(output).toEqual([3, 4, 5]);
});

test('operator: skipAsync over count', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).pipe(skipAsync(10)).toArrayAsync();
  expect(output).toEqual([]);
});

test('operator: simple skipWhileAsync', async () => {
  const output = await fromAsAsync([2, 4, 5, 6, 7, 8])
    .pipe(skipWhileAsync(async i => {
      await abortableSleep(20);
      return i % 2 == 0
    }))
    .toArrayAsync();
  expect(output).toEqual([5, 6, 7, 8]);
});

test('operator: simple filterAsync', async () => {
  const output = await fromAsAsync([2, 4, 5, 6, 7, 8])
    .pipe(filterAsync(async i => i % 2 == 0))
    .toArrayAsync();
  expect(output).toEqual([2, 4, 6, 8]);
});

test('operator: filterAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([2, 4, 5, 6, 7, 8])
    .pipe(
      filterAsync(async (i, index) => {
        await abortableSleep(20);
        indexes.push(index);
        return i % 2 == 0;
      })
    )
    .toArrayAsync();
  expect(output).toEqual([2, 4, 6, 8]);
  expect(indexes).toEqual([0, 1, 2, 3, 4, 5]);
});

test('operator: simple filterNotNullAsync', async () => {
  const output = await fromAsAsync([2, 4, null, 5, null, undefined, 6, 7, 8])
    .pipe(filterNotNullAsync())
    .toArrayAsync();
  expect(output).toEqual([2, 4, 5, 6, 7, 8]);
});

test('operator: simple flattenAsync', async () => {
  const output = await fromAsAsync([
    [1, 2],
    [3, 4],
    [5, 6],
  ])
  .pipe(flattenAsync(async i => i))
  .toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6]);
});

test('operator: flattenAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([
    [1, 2],
    [3, 4],
    [5, 6],
  ])
  .pipe(
    flattenAsync(async(i, index) => {
      abortableSleep(20);
      indexes.push(index);
      return i;
    })
  )
  .toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6]);
  expect(indexes).toEqual([0, 1, 2]);
});

test('operator: simple mapAsync', async () => {
  const output = await fromAsAsync([1, 2, 3])
    .pipe(mapAsync(async i => i * i))
    .toArrayAsync();
  expect(output).toEqual([1, 4, 9]);
});

test('operator: mapAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3])
    .pipe(
      mapAsync(async (i, index) => {
        abortableSleep(20);
        indexes.push(index);
        return i * i;
      })
    )
    .toArrayAsync();
  expect(output).toEqual([1, 4, 9]);
  expect(indexes).toEqual([0, 1, 2]);
});

test('operator: simple mapNotNullAsync', async () => {
  const output = await fromAsAsync([1, 2, null, 3, null, null, 4, undefined, 5])
    .pipe(mapNotNullAsync(async i => i?.toString()))
    .toArrayAsync();
  expect(output).toEqual(["1", "2", "3", "4", "5"]);
});

test('operator: mapNotNullAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, null, 3, null, null, 4, undefined, 5])
    .pipe(
      mapNotNullAsync(async (i, index) => {
        await abortableSleep(20);
        indexes.push(index);
        return i?.toString();
      })
    )
    .toArrayAsync();
  expect(output).toEqual(["1", "2", "3", "4", "5"]);
  expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test('operator: orderByAsync asc', async () => {
  const output = await fromAsAsync([6, 3, 2, 1, 4, 5])
    .pipe(orderByAsync(i => i))
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6]);
});

test('operator: orderByAsync desc', async () => {
  const output = await fromAsAsync([6, 3, 2, 1, 4, 5])
    .pipe(orderByAsync(i => i, 'desc'))
    .toArrayAsync();
  expect(output).toEqual([6, 5, 4, 3, 2, 1]);
});

test('operator: orderByAsync keySelector', async () => {
  const output = await fromAsAsync([
    [3, 9],
    [2, 1],
    [4, 0],
  ])
  .pipe(orderByAsync(i => Math.max(...i)))
  .toArrayAsync();

  expect(output).toEqual([
    [2, 1],
    [4, 0],
    [3, 9],
  ]);
});

test('operator: orderByAsync compareFunction1', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5, 6])
    .pipe(
      orderByAsync(
        i => i,
        'asc',
        (a, b) => {
          if (a < b) return 1;
          if (a > b) return -1;
          return 0;
        }
      )
    )
    .toArrayAsync();
  expect(output).toEqual([6, 5, 4, 3, 2, 1]);
});

test('operator: orderByAsync compareFunction2', async () => {
  const originalCompareFunction = (a: number, b:number) => {
    if(a % 2 < b % 2) return - 1;
    if(a % 2 > b % 2) return 1;
    return 0;
  }
  
  const output = await fromAsAsync([4,1,5,3,2]).pipe(
    orderByAsync(i => i, 'asc', originalCompareFunction)
  ).toArrayAsync();
  expect(output).toEqual([4,2,1,5,3]);
});

test('operator: simple takeAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5, 6]).pipe(takeAsync(2)).toArrayAsync();
  expect(output).toEqual([1, 2]);
});

test('operator: takeAsync over count', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5, 6]).pipe(takeAsync(10)).toArrayAsync();
  expect(output).toEqual([1, 2, 3, 4, 5, 6]);
});

test('operator: simple takeWhileAsync', async () => {
  const output = await fromAsAsync([2, 4, 5, 6, 7, 8])
    .pipe(takeWhileAsync(async i => {
      abortableSleep(20); 
      return i % 2 == 0;
    }))
    .toArrayAsync();
  expect(output).toEqual([2, 4]);
});

test('operator: simple tapAsync', async () => {
  const sideEffects: number[] = [];
  const output = await fromAsAsync([1, 2, 3])
    .pipe(tapAsync(async i => {
      await abortableSleep(20);
      sideEffects.push(i * i);
    }))
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3]);
  expect(sideEffects).toEqual([1, 4, 9]);
});

test('operator: tapAsync index', async () => {
  const indexes: number[] = [];
  const sideEffects: number[] = [];
  const output = await fromAsAsync([1, 2, 3])
    .pipe(
      tapAsync(async (i, index) => {
        indexes.push(index);
        sideEffects.push(i * i);
      })
    )
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3]);
  expect(indexes).toEqual([0, 1, 2]);
  expect(sideEffects).toEqual([1, 4, 9]);
});

test('operator: simple uniqAsync 1', async () => {
  const output = await fromAsAsync([1, 1, 2, 3, 2, 1, 3])
    .pipe(uniqAsync())
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3]);
});

test('operator: simple uniqAsync 2', async () => {
  const output = await fromAsAsync([1, 1, 2, 3, 2, 1, 3])
    .pipe(uniqAsync(async i => {
      await abortableSleep(20);
      return i;
    }))
    .toArrayAsync();
  expect(output).toEqual([1, 2, 3]);
});

test('operator: uniqAsync value equality 1',async () => {
  const source = [
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test1"},
    {groupKey: {mainKey: 2, subKey: 'b'}, value: "test2"},
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test3"},
    {groupKey: {mainKey: 1, subKey: 'c'}, value: "test4"},
  ]

  const output = await fromAsAsync(source).pipe(
    uniqAsync(
      async one => {
        await abortableSleep(20);
        return one.groupKey;
      }
    )).toArrayAsync();

  expect(output).toEqual([
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test1"},
    {groupKey: {mainKey: 2, subKey: 'b'}, value: "test2"},
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test3"},
    {groupKey: {mainKey: 1, subKey: 'c'}, value: "test4"},
  ]);
});

test('operator: simple uniqAsync value equality 2',async () => {

  const source = [
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test1"},
    {groupKey: {mainKey: 2, subKey: 'b'}, value: "test2"},
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test3"},
    {groupKey: {mainKey: 1, subKey: 'c'}, value: "test4"},
  ]

  const comparableValueForKey = async (key: {mainKey: number, subKey: string}) => {
    await abortableSleep(20);
    return key.mainKey + key.subKey;
  }

  const output = await fromAsAsync(source).pipe(
    uniqAsync(async one => {
      await abortableSleep(20);
      return one.groupKey;
    },comparableValueForKey)
  ).toArrayAsync();

  expect(output).toEqual([
    {groupKey: {mainKey: 1, subKey: 'a'}, value: "test1"},
    {groupKey: {mainKey: 2, subKey: 'b'}, value: "test2"},
    {groupKey: {mainKey: 1, subKey: 'c'}, value: "test4"},
  ]);
});

test('operator: simple chunkAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5, 6, 7]).pipe(chunkAsync(2)).toArrayAsync();
  expect(output).toEqual([[1, 2],[3,4],[5,6],[7]]);
});

test('operator: simple scanAsync', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).pipe(
    scanAsync(100, async (acc, i, index) => {
      await abortableSleep(20);
      indexes.push(index);
      return acc + i;
    })
  ).toArrayAsync();
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
  expect(output).toEqual([101, 103, 106, 110, 115]);
});

test('operator: simple groupByAsync',async () => {
  const source = [
    {groupKey: 1, value: "test1"},
    {groupKey: 3, value: "test2"},
    {groupKey: 1, value: "test3"},
    {groupKey: 1, value: "test4"},
    {groupKey: 3, value: "test5"},
    {groupKey: 2, value: "test6"}
  ]

  const output = await fromAsAsync(source).pipe(groupByAsync(async one => {
    await abortableSleep(20);
    return one.groupKey;
  })).toArrayAsync();

  expect(output).toEqual([
    {key: 1, values: [{groupKey: 1, value: "test1"}, {groupKey: 1, value: "test3"}, {groupKey: 1, value: "test4"}]},
    {key: 3, values: [{groupKey: 3, value: "test2"}, {groupKey: 3, value: "test5"}]},
    {key: 2, values: [{groupKey: 2, value: "test6"}]}
  ]);
});

test('operator: groupByAsync value equality 1',async() => {

  const source = [
    {groupKey: {groupKey: 1}, value: "test1"},
    {groupKey: {groupKey: 2}, value: "test2"},
    {groupKey: {groupKey: 1}, value: "test3"},
    {groupKey: {groupKey: 1}, value: "test4"},
  ]

  const output = await fromAsAsync(source).pipe(groupByAsync(
    async one => {await abortableSleep(20); return one.groupKey},
    async i => {await abortableSleep(20); return i},
    async k => {await abortableSleep(20); return k.groupKey}),).toArrayAsync();

  expect(output).toEqual([
    {key: {groupKey: 1}, values: [{groupKey: {groupKey: 1}, value: "test1"}, {groupKey: {groupKey: 1}, value: "test3"},{groupKey: {groupKey: 1}, value: "test4"}]},
    {key: {groupKey: 2}, values: [{groupKey: {groupKey: 2}, value: "test2"}]}
  ]);
});

test('operator: simple unionAsync', async () => {
  const output = await fromAsAsync([1, 2, 3]).pipe(unionAsync([2,3,4,5])).toArrayAsync();
  expect(output).toEqual([1,2,3,4,5]);
});

test('operator: simple differenceAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 6]).pipe(differenceAsync([2,3,4,5])).toArrayAsync();
  expect(output).toEqual([1,6]);
});

test('operator: differenceAsync removeDuplicate', async () => {
  const output = await fromAsAsync([1, 2, 3, 6, 6]).pipe(
    differenceAsync([2,3,4,5],async i => {await abortableSleep(20); return i;}, false)
  ).toArrayAsync();
  expect(output).toEqual([1,6,6]);
});

test('operator: simple intersectAsync', async () => {
  const output = await fromAsAsync([1, 2, 3]).pipe(intersectAsync([2,3,4,5])).toArrayAsync();
  expect(output).toEqual([2,3]);
});

test('operator: simple reverseAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).pipe(reverseAsync()).toArrayAsync();
  expect(output).toEqual([5,4,3,2,1]);
});
