import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DRAFTS_DIR = path.join(process.cwd(), 'content', 'drafts');
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function run() {
  console.log('--- Starting Daily Publisher ---');

  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DRAFTS_DIR).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

  if (files.length === 0) {
    console.log('No drafts found to publish.');
    return;
  }

  // Pick the first draft
  const draftFile = files[0];
  const draftPath = path.join(DRAFTS_DIR, draftFile);
  const publishPath = path.join(BLOG_DIR, draftFile);

  console.log(`Publishing draft: ${draftFile}`);

  // Read content to update the date (assuming standard frontmatter)
  let content = fs.readFileSync(draftPath, 'utf8');
  const today = new Date().toISOString().split('T')[0];
  
  // If there's a date field in frontmatter, update it
  if (content.includes('date:')) {
    content = content.replace(/date:\s*['"]?[0-9]{4}-[0-9]{2}-[0-9]{2}['"]?/, `date: "${today}"`);
  } else if (content.includes('pubDate:')) {
    content = content.replace(/pubDate:\s*['"]?[0-9]{4}-[0-9]{2}-[0-9]{2}['"]?/, `pubDate: "${today}"`);
  }

  // Move the file and update content
  fs.writeFileSync(publishPath, content);
  fs.unlinkSync(draftPath);

  console.log(`Moved ${draftFile} to ${BLOG_DIR} and updated publication date.`);

  // Stage the files in git
  try {
    execSync(`git add ${DRAFTS_DIR} ${BLOG_DIR}`);
    console.log('Files staged for commit.');
  } catch (error) {
    console.error('Error staging files:', error.message);
  }
}

run();
