import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clean,
  goodreadsMetadata,
  naturalTitle,
  relationTitle,
} from './route.ts';

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

void test('reads Goodreads description and series metadata from stable attributes', () => {
  const html = `
    <div class="BookPageTitleSection_title">
      <h3 aria-label="Book 6 of The Dark Tower"></h3>
    </div>
    <div data-testid="description">
      <div class="TruncatedContent"><div data-testid="contentContainer">
        <span class="Formatted">${'La descrizione completa del romanzo continua con dettagli utili e coerenti. '.repeat(3)}</span>
      </div></div><div class=""></div>
    </div>`;
  const metadata = goodreadsMetadata(html);
  assert.equal(metadata.saga, 'The Dark Tower');
  assert.equal(metadata.sagaOrder, 6);
  assert.match(metadata.description, /descrizione completa/);
});

void test('removes inverted author names from adjacent book titles', () => {
  assert.equal(
    relationTitle(
      'Starcrossed Angelini, Josephine And Rossari, Marco',
      'Josephine Angelini',
    ),
    'Starcrossed',
  );
});

void test('keeps clean adjacent book titles unchanged', () => {
  assert.equal(
    relationTitle('I lupi del Calla', 'Stephen King'),
    'I lupi del Calla',
  );
});
