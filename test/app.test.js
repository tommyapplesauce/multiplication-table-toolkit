import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateRows, getChallenge, isCorrectPrediction } from '../app.js';

describe('multiplication table pattern logic', () => {
  it('generates mathematically correct rows for tables 1 through 10', () => {
    for (let table = 1; table <= 10; table += 1) {
      const rows = generateRows(table);
      assert.equal(rows.length, 10);

      rows.forEach((row) => {
        assert.equal(row.product, table * row.multiplier);
        assert.equal(row.onesDigit, row.product % 10);
        assert.equal(row.tensPart, Math.floor(row.product / 10));
      });
    }
  });

  it('marks wraps when the ones digit loops back down', () => {
    const twos = generateRows(2);
    assert.deepEqual(
      twos.map((row) => row.wrapped),
      [false, false, false, false, true, false, false, false, false, true],
    );
  });

  it('uses the 24680 anchor cycle for the 2s challenges', () => {
    assert.equal(getChallenge(2, 5).expectedDigit, 0);
    assert.equal(getChallenge(2, 5).expectedWrap, true);
    assert.equal(isCorrectPrediction(2, 5, 0, true), true);
    assert.equal(isCorrectPrediction(2, 5, 2, false), false);
  });

  it('shows the 9s countdown pattern accurately', () => {
    assert.deepEqual(
      generateRows(9).map((row) => row.onesDigit),
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    );
    assert.equal(getChallenge(9, 10).product, 90);
  });
});
