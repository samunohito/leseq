import {every, find, findOrDefault, first, firstOrDefault, from, last, lastOrDefault, reduce, some} from '../src';

test('operator: every true case', () => {
  const output = from([1, 2, 3, 4, 5]).value(every(i => i < 6));
  expect(output).toBe(true);
});

test('operator: every false case', () => {
  const output = from([1, 2, 3, 4, 5]).value(every(i => i < 5));
  expect(output).toBe(false);
});

test('operator: simple find', () => {
  const output = from([1, 2, 3, 4, 5]).value(find(i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: find index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    find((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: find throw error', () => {
  expect(() => from([1, 2, 3, 4, 5]).value(find(i => i > 10))).toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple findOrDefault', () => {
  const output = from([1, 2, 3, 4, 5]).value(findOrDefault(i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: findOrDefault index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    findOrDefault((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: findOrDefault default case1', () => {
  const output = from([1, 2, 3, 4, 5]).value(findOrDefault(i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: findOrDefault default case2', () => {
  const output = from([1, 2, 3, 4, 5]).value(findOrDefault(i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple first', () => {
  const output = from([1, 2, 3, 4, 5]).value(first());
  expect(output).toBe(1);
});

test('operator: first condition', () => {
  const output = from([1, 2, 3, 4, 5]).value(first(i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: first index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    first((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: first throw error case 1', () => {
  expect(() => from([]).value(first())).toThrowError(`No elements matching the condition were found.`);
});

test('operator: first throw error case 2', () => {
  expect(() => from([1, 2, 3, 4, 5]).value(first(i => i > 10))).toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple firstOrDefault', () => {
  const output = from([1, 2, 3, 4, 5]).value(firstOrDefault());
  expect(output).toBe(1);
});

test('operator: firstOrDefault condition', () => {
  const output = from([1, 2, 3, 4, 5]).value(firstOrDefault(i => i % 2 == 0));
  expect(output).toBe(2);
});

test('operator: firstOrDefault index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    firstOrDefault((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(2);
  expect(indexes).toEqual([0, 1]);
});

test('operator: firstOrDefault default case1', () => {
  const output = from([]).value(firstOrDefault(_ => true));
  expect(output).toBe(undefined);
});

test('operator: firstOrDefault default case2', () => {
  const output = from([]).value(firstOrDefault(_ => true, 9999));
  expect(output).toBe(9999);
});

test('operator: firstOrDefault default case3', () => {
  const output = from([1, 2, 3, 4, 5]).value(firstOrDefault(i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: firstOrDefault default case4', () => {
  const output = from([1, 2, 3, 4, 5]).value(firstOrDefault(i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple last', () => {
  const output = from([1, 2, 3, 4, 5]).value(last());
  expect(output).toBe(5);
});

test('operator: last condition', () => {
  const output = from([1, 2, 3, 4, 5]).value(last(i => i % 2 == 0));
  expect(output).toBe(4);
});

test('operator: last index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    last((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(4);
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
});

test('operator: last throw error case 1', () => {
  expect(() => from([]).value(last())).toThrowError(`No elements matching the condition were found.`);
});

test('operator: last throw error case 2', () => {
  expect(() => from([1, 2, 3, 4, 5]).value(last(i => i > 10))).toThrowError(`No elements matching the condition were found.`);
});

test('operator: simple lastOrDefault', () => {
  const output = from([1, 2, 3, 4, 5]).value(lastOrDefault());
  expect(output).toBe(5);
});

test('operator: lastOrDefault condition', () => {
  const output = from([1, 2, 3, 4, 5]).value(lastOrDefault(i => i % 2 == 0));
  expect(output).toBe(4);
});

test('operator: lastOrDefault index', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    lastOrDefault((i, index) => {
      indexes.push(index);
      return i % 2 == 0;
    })
  );
  expect(output).toBe(4);
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
});

test('operator: lastOrDefault default case1', () => {
  const output = from([]).value(lastOrDefault(_ => true));
  expect(output).toBe(undefined);
});

test('operator: lastOrDefault default case2', () => {
  const output = from([]).value(lastOrDefault(_ => true, 9999));
  expect(output).toBe(9999);
});

test('operator: lastOrDefault default case3', () => {
  const output = from([1, 2, 3, 4, 5]).value(lastOrDefault(i => i > 10));
  expect(output).toBe(undefined);
});

test('operator: lastOrDefault default case4', () => {
  const output = from([1, 2, 3, 4, 5]).value(lastOrDefault(i => i > 10, 9999));
  expect(output).toBe(9999);
});

test('operator: simple reduce', () => {
  const indexes: number[] = [];
  const output = from([1, 2, 3, 4, 5]).value(
    reduce(100, (acc, i, index) => {
      indexes.push(index);
      return acc + i;
    })
  );
  expect(indexes).toEqual([0, 1, 2, 3, 4]);
  expect(output).toBe(115);
});

test('operator: some true case', () => {
  const output = from([1, 2, 3, 4, 5]).value(some(i => i == 5));
  expect(output).toBe(true);
});

test('operator: some false case', () => {
  const output = from([1, 2, 3, 4, 5]).value(some(i => i > 10));
  expect(output).toBe(false);
});
