import { execSync } from 'child_process';
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ALERT_EMAIL = process.env.ALERT_EMAIL;

async function sendAlert(subject, text) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ALERT_EMAIL) {
    console.warn('Missing SMTP credentials. Skipping email alert. Details:', text);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Health Bot" <${SMTP_USER}>`,
      to: ALERT_EMAIL,
      subject,
      text,
    });
    console.log(`Alert email sent: ${subject}`);
  } catch (error) {
    console.error('Failed to send alert email:', error);
  }
}

async function run() {
  console.log('--- Starting Health Check & Healer ---');

  let typecheckPassed = false;
  let buildPassed = false;
  let logs = '';

  try {
    console.log('Running typecheck...');
    const typecheckOut = execSync('npm run typecheck', { encoding: 'utf8' });
    logs += typecheckOut + '\n';
    typecheckPassed = true;

    console.log('Running build...');
    const buildOut = execSync('npm run build', { encoding: 'utf8' });
    logs += buildOut + '\n';
    buildPassed = true;

    console.log('Health check passed. Site is stable.');
    
    // Optionally alert on success
    // await sendAlert('✅ Site Health Check Passed', 'The daily publishing job succeeded. No issues found.');

  } catch (error) {
    logs += error.stdout + '\n' + error.stderr + '\n' + error.message;
    console.error('Health check failed! Error logs:', logs);

    // Attempt Auto-Healing
    console.log('Attempting Auto-Healing: Rolling back changes...');
    let healed = false;
    try {
      execSync('git reset --hard HEAD');
      execSync('git clean -fd'); // Clean any untracked files moved during the publish
      console.log('Rollback successful. Site healed.');
      healed = true;
    } catch (healError) {
      console.error('Auto-healing rollback failed:', healError);
    }

    if (healed) {
      await sendAlert(
        '⚠️ Site Auto-Healed (Publishing Failed)',
        `The site build failed after publishing a draft. An automatic rollback was performed. The site is stable, but the content was NOT published.\n\nLogs:\n${logs}`
      );
    } else {
      await sendAlert(
        '🚨 CRITICAL ISSUE: Site Build & Heal Failed',
        `The site build failed and the auto-healing mechanism also failed. Manual intervention required.\n\nLogs:\n${logs}`
      );
    }
    
    // Exit with code 1 so the GitHub Action knows it failed
    process.exit(1);
  }
}

run();
