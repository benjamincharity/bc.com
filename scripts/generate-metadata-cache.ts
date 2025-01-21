import { generateMetadataCache } from '../app/utils/articles.server';

async function main() {
  console.log('Generating article metadata cache...');
  await generateMetadataCache();
  console.log('Article metadata cache generated successfully!');
}

main().catch(console.error);
