import assert from 'node:assert/strict';
import test from 'node:test';
import { clean, naturalTitle } from './route.ts';

void test('decodes named, decimal and hexadecimal HTML entities', () => {
  assert.equal(
    clean('L&apos;amore e l&#39;odio &amp; l&#x2019;amicizia'),
    "L'amore e l'odio & l’amicizia",
  );
});

void test('preserves natural title casing while normalizing all-caps titles', () => {
  assert.equal(naturalTitle("l'amore e l'odio"), "l'amore e l'odio");
  assert.equal(naturalTitle('DOCTOR SLEEP'), 'Doctor Sleep');
});

void test('removes markup only after decoding escaped markup', () => {
  assert.equal(
    clean('La &lt;b&gt;voce&lt;/b&gt; dei morti'),
    'La voce dei morti',
  );
});
