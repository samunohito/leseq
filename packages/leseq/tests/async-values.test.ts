import {
  everyAsync,
  findAsync,
  findOrDefaultAsync,
  firstAsync,
  firstOrDefaultAsync,
  fromAsAsync, lastAsync, lastOrDefaultAsync,
  reduceAsync,
  someAsync
} from '../src';

test('operator: everyAsync true case', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(everyAsync(async i => i < 6));
  expect(output).toBe(true);
});

test('operator: everyAsync false case', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(everyAsync(async i => i < 5));
  expect(output).toBe(false);
});

test('operator: simple findAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(findAsync(async i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: findAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    findAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: findAsync throw error', async () => {
  await expect(async () => await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(findAsync(async i => i > 10)))
    .rejects
    .toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple findOrDefaultAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(findOrDefaultAsync(async i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: findOrDefaultAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    findOrDefaultAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: findOrDefaultAsync default case1', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(findOrDefaultAsync(async i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: findOrDefaultAsync default case2', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(findOrDefaultAsync(async i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple firstAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstAsync());
  expect(output).toBe(1);
});

test('operator: firstAsync condition', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstAsync(async i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: firstAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    firstAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: firstAsync throw error case 1', async () => {
  await expect(async () => await fromAsAsync([]).valueAsync(firstAsync()))
    .rejects
    .toThrowError(`No elements matching the condition were found.`)
});

test('operator: firstAsync throw error case 2', async () => {
  await expect(async () => await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstAsync(async i => i > 10)))
    .rejects
    .toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple firstOrDefaultAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstOrDefaultAsync());
  expect(output).toBe(1);
});

test('operator: firstOrDefaultAsync condition', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstOrDefaultAsync(async i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: firstOrDefaultAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    firstOrDefaultAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: firstOrDefaultAsync default case1', async () => {
  const output = await fromAsAsync([]).valueAsync(firstOrDefaultAsync(async _ => true));
  expect(output).toBe(undefined);
});

test('operator: firstOrDefaultAsync default case2', async () => {
  const output = await fromAsAsync([]).valueAsync(firstOrDefaultAsync(async _ => true, 9999));
  expect(output).toBe(9999);
});

test('operator: firstOrDefaultAsync default case3', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstOrDefaultAsync(async i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: firstOrDefaultAsync default case4', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(firstOrDefaultAsync(async i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple lastAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastAsync());
  expect(output).toBe(5);
});

test('operator: lastAsync condition', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastAsync(async i => i % 2 == 0));
  expect(output).toBe(4);
});

test('operator: lastAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    lastAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(4);
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
});

test('operator: lastAsync throw error case 1', async () => {
  await expect(async () => await fromAsAsync([]).valueAsync(lastAsync()))
    .rejects
    .toThrowError(`No elements matching the condition were found.`)
});

test('operator: lastAsync throw error case 2', async () => {
  await expect(async () => await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastAsync(async i => i > 10)))
    .rejects
    .toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple lastOrDefaultAsync', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastOrDefaultAsync());
  expect(output).toBe(5);
});

test('operator: lastOrDefaultAsync condition', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastOrDefaultAsync(async i => i % 2 == 0));
  expect(output).toBe(4);
});

test('operator: lastOrDefaultAsync index', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    lastOrDefaultAsync(async (i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(4);
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
});

test('operator: lastOrDefaultAsync default case1', async () => {
  const output = await fromAsAsync([]).valueAsync(lastOrDefaultAsync(async _ => true));
  expect(output).toBe(undefined);
});

test('operator: lastOrDefaultAsync default case2', async () => {
  const output = await fromAsAsync([]).valueAsync(lastOrDefaultAsync(async _ => true, 9999));
  expect(output).toBe(9999);
});

test('operator: lastOrDefaultAsync default case3', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastOrDefaultAsync(async i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: lastOrDefaultAsync default case4', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(lastOrDefaultAsync(async i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple reduceAsync', async () => {
  const indexes: number[] = [];
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(
    reduceAsync(100, async (acc, i, index) => {
      indexes.push(index);
      return acc + i;
    })
  );
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
  expect(output).toBe(115);
});

test('operator: someAsync true case', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(someAsync(async i => i == 5));
  expect(output).toBe(true);
});

test('operator: someAsync false case', async () => {
  const output = await fromAsAsync([1, 2, 3, 4, 5]).valueAsync(someAsync(async i => i > 10));
  expect(output).toBe(false);
});
