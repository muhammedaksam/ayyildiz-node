#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

interface VersionObject {
  major: number;
  minor: number;
  patch: number;
}

interface FileToUpdate {
  path: string;
  type: 'package.json' | 'version-info' | 'version-test';
}

// Get command line arguments
const command = process.argv[2];
const newVersion = process.argv[3];

// Get the project root directory (parent of scripts folder)
const projectRoot = path.join(__dirname, '..');

// Function to get current version from package.json
function getCurrentVersion(): string {
  const packagePath = path.join(projectRoot, 'package.json');

  try {
    if (!fs.existsSync(packagePath)) {
      console.error('❌ Cannot find package.json');
      process.exit(1);
    }

    const content = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(content);
    return packageJson.version;
  } catch (error) {
    console.error('❌ Error reading current version:', (error as Error).message);
    process.exit(1);
  }
}

// Function to parse version string into object
function parseVersion(version: string): VersionObject {
  const versionParts = version.split('.');
  if (versionParts.length !== 3) {
    throw new Error('Invalid version format');
  }

  return {
    major: parseInt(versionParts[0]),
    minor: parseInt(versionParts[1]),
    patch: parseInt(versionParts[2])
  };
}

// Function to increment patch version (e.g., 1.0.1 -> 1.0.2)
function incrementPatchVersion(version: string): string {
  const versionObj = parseVersion(version);
  return `${versionObj.major}.${versionObj.minor}.${versionObj.patch + 1}`;
}

// Function to execute git operations
function executeGitOperations(version: string, updatedFiles: number): void {
  console.log('\n🔄 Committing changes to git...');

  try {
    // Check if we're in a git repository and change to project root
    process.chdir(projectRoot);
    execSync('git status', { stdio: 'ignore' });

    // Add all updated files
    const filePaths = [
      'package.json',
      'src/VersionInfo.ts',
      'src/__tests__/VersionInfo.test.ts'
    ].filter(filePath => {
      // Only add files that actually exist and were updated
      return fs.existsSync(path.join(projectRoot, filePath));
    });

    if (filePaths.length === 0) {
      console.log('⚠️  No files to commit');
      return;
    }

    // Add files to git
    filePaths.forEach(filePath => {
      execSync(`git add "${filePath}"`, { stdio: 'ignore' });
      console.log(`📝 Added to git: ${filePath}`);
    });

    // Generate commit message
    const commitMessage = `chore: bump version to v${version}

Updated version across the following files:
${filePaths.map(file => `- ${file}`).join('\n')}`;

    // Commit the changes
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    console.log('✅ Successfully committed version changes');
    console.log(`📝 Commit message: "chore: bump version to v${version}"`);

    // Show the commit hash
    const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    console.log(`🔗 Commit hash: ${commitHash}`);
  } catch (error) {
    const err = error as Error;
    if (err.message.includes('not a git repository')) {
      console.log('⚠️  Not in a git repository - skipping git operations');
    } else if (err.message.includes('nothing to commit')) {
      console.log('ℹ️  No changes to commit (files may already be up to date)');
    } else {
      console.error('❌ Git operation failed:', err.message);
      console.log('💡 You may need to manually commit the changes');
    }
  }
}

// Function to show current versions
function showVersions(): void {
  console.log('📋 Current Versions:');

  const filesToCheck = [
    {
      path: 'package.json',
      name: 'Package.json',
      type: 'package.json' as const
    },
    {
      path: 'src/VersionInfo.ts',
      name: 'VersionInfo.ts',
      type: 'version-info' as const
    },
    {
      path: 'src/__tests__/VersionInfo.test.ts',
      name: 'VersionInfo Test',
      type: 'version-test' as const
    }
  ];

  filesToCheck.forEach(({ path: filePath, name, type }) => {
    const fullPath = path.join(projectRoot, filePath);

    try {
      if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  ${name}: File not found (${filePath})`);
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      let version = 'unknown';

      if (type === 'package.json') {
        const packageJson = JSON.parse(content);
        version = packageJson.version;
      } else if (type === 'version-info') {
        const majorMatch = content.match(/private static readonly MAJOR = (\d+);/);
        const minorMatch = content.match(/private static readonly MINOR = (\d+);/);
        const patchMatch = content.match(/private static readonly PATCH = (\d+);/);
        if (majorMatch && minorMatch && patchMatch) {
          version = `${majorMatch[1]}.${minorMatch[1]}.${patchMatch[1]}`;
        }
      } else if (type === 'version-test') {
        const versionMatch = content.match(/expect\(versionString\)\.toBe\(['"](.+?)['"]\);/);
        version = versionMatch ? versionMatch[1] : 'unknown';
      }

      console.log(`📦 ${name}: ${version}`);
    } catch (error) {
      console.log(`❌ ${name}: Error reading version (${(error as Error).message})`);
    }
  });
}

// Function to update all version-related files
function updateVersions(version: string): void {
  // Validate version format (basic semver check)
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (!versionPattern.test(version)) {
    console.error('❌ Invalid version format. Please use semantic versioning (e.g., 1.0.0)');
    process.exit(1);
  }

  console.log(`🚀 Updating version to ${version}...`);

  const versionObj = parseVersion(version);

  // Files to update
  const filesToUpdate: FileToUpdate[] = [
    {
      path: 'package.json',
      type: 'package.json'
    },
    {
      path: 'src/VersionInfo.ts',
      type: 'version-info'
    },
    {
      path: 'src/__tests__/VersionInfo.test.ts',
      type: 'version-test'
    }
  ];

  let updatedFiles = 0;
  let errors = 0;

  filesToUpdate.forEach(({ path: filePath, type }) => {
    const fullPath = path.join(projectRoot, filePath);

    try {
      if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  File not found: ${filePath}`);
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      let updatedContent: string;

      if (type === 'package.json') {
        // Update package.json
        const packageJson = JSON.parse(content);
        const oldVersion = packageJson.version;
        packageJson.version = version;
        updatedContent = JSON.stringify(packageJson, null, 2) + '\n';

        console.log(`✅ Updated ${filePath}: ${oldVersion} → ${version}`);
      } else if (type === 'version-info') {
        // Update VersionInfo.ts
        const oldMajorMatch = content.match(/private static readonly MAJOR = (\d+);/);
        const oldMinorMatch = content.match(/private static readonly MINOR = (\d+);/);
        const oldPatchMatch = content.match(/private static readonly PATCH = (\d+);/);

        const oldVersion =
          oldMajorMatch && oldMinorMatch && oldPatchMatch
            ? `${oldMajorMatch[1]}.${oldMinorMatch[1]}.${oldPatchMatch[1]}`
            : 'unknown';

        updatedContent = content
          .replace(
            /private static readonly MAJOR = \d+;/,
            `private static readonly MAJOR = ${versionObj.major};`
          )
          .replace(
            /private static readonly MINOR = \d+;/,
            `private static readonly MINOR = ${versionObj.minor};`
          )
          .replace(
            /private static readonly PATCH = \d+;/,
            `private static readonly PATCH = ${versionObj.patch};`
          );

        console.log(`✅ Updated ${filePath}: ${oldVersion} → ${version}`);
      } else if (type === 'version-test') {
        // Update VersionInfo.test.ts
        const oldVersionMatch = content.match(/expect\(versionString\)\.toBe\(['"](.+?)['"]\);/);
        const oldVersion = oldVersionMatch ? oldVersionMatch[1] : 'unknown';

        updatedContent = content
          .replace(
            /expect\(versionString\)\.toBe\(['"](.+?)['"]\);/,
            `expect(versionString).toBe('${version}');`
          )
          .replace(
            /expect\(versionObj\)\.toEqual\(\s*\{[\s\S]*?\}\s*\);/,
            `expect(versionObj).toEqual({
        major: ${versionObj.major},
        minor: ${versionObj.minor},
        patch: ${versionObj.patch}
      });`
          );

        console.log(`✅ Updated ${filePath}: ${oldVersion} → ${version}`);
      } else {
        throw new Error(`Unknown file type: ${type}`);
      }

      fs.writeFileSync(fullPath, updatedContent);
      updatedFiles++;
    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, (error as Error).message);
      errors++;
    }
  });

  // Summary
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${updatedFiles} files`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} files`);
    process.exit(1);
  } else {
    console.log('🎉 All files updated successfully!');

    // Execute git operations if files were successfully updated
    if (updatedFiles > 0) {
      executeGitOperations(version, updatedFiles);
    }

    console.log('\n💡 Note: All version references have been updated across:');
    console.log('   • package.json version field');
    console.log('   • VersionInfo.ts static constants');
    console.log('   • VersionInfo.test.ts expected values');
  }
}

// Handle different commands
if (!command || command === 'show' || command === 'version') {
  showVersions();
  process.exit(0);
}

if (command === 'update') {
  if (!newVersion) {
    // Auto-increment patch version if no version provided
    const currentVersion = getCurrentVersion();
    const nextVersion = incrementPatchVersion(currentVersion);
    console.log(`🔄 Auto-incrementing version: ${currentVersion} → ${nextVersion}`);
    updateVersions(nextVersion);
  } else {
    updateVersions(newVersion);
  }
  process.exit(0);
} else {
  // Backward compatibility: if first arg is a version number, treat it as update
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (versionPattern.test(command)) {
    // First argument is a version, use it for update
    const version = command;
    updateVersions(version);
    process.exit(0);
  } else {
    console.error('❌ Invalid command');
    console.log('Usage:');
    console.log('  npx tsx scripts/version-helper.ts show              # Show current versions');
    console.log('  npx tsx scripts/version-helper.ts version           # Show current versions');
    console.log(
      '  npx tsx scripts/version-helper.ts update            # Auto-increment patch version & commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts update <version>  # Update to specific version & commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts <version>         # Update to specific version & commit (legacy)'
    );
    console.log('');
    console.log('Examples:');
    console.log('  npx tsx scripts/version-helper.ts show');
    console.log(
      '  npx tsx scripts/version-helper.ts update            # 1.0.1 → 1.0.2 & git commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts update 1.1.0      # Update to 1.1.0 & git commit'
    );
    console.log(
      '  npx tsx scripts/version-helper.ts 1.1.0             # Update to 1.1.0 & git commit'
    );
    console.log('');
    console.log('Git Integration:');
    console.log('  • Automatically stages updated files (git add)');
    console.log('  • Creates a commit with descriptive message');
    console.log('  • Handles cases where not in a git repository gracefully');
    process.exit(1);
  }
}
