import { Term } from '../models/Term';

// Idempotent seed: only inserts sample records if collection is empty
export async function seedTermsIfEmpty(): Promise<void> {
  const count = await Term.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: terms collection already has ${count} record(s).`);
    return;
  }
  const docs = [
    { term: 'auto', synonyms: ['macchina', 'autovettura', 'vettura'] },
    { term: 'felice', synonyms: ['contento', 'allegro', 'gioioso'] },
    { term: 'grande', synonyms: ['ampio', 'vast', 'enorme'] },
  ];
  await Term.insertMany(docs);
  console.log(`Seed completed: inserted ${docs.length} sample terms.`);
}
