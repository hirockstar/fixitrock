#!/usr/bin/env bun

import fs from 'fs'
import { execSync } from 'child_process'

// Configuration
const CHANGELOG_CONFIG_FILE = 'src/config/changelog.ts'
const PACKAGE_JSON = 'package.json'
const CHANGELOG_DATA_START = 'export const changelogData: ChangelogData = {'
const CHANGELOG_DATA_END = '}'

// Change types and their version bump rules
const CHANGE_TYPES = {
    feature: 'patch', // 0.1.2 -> 0.1.3 (increment patch)
    improvement: 'patch', // 0.1.2 -> 0.1.3 (increment patch)
    bugfix: 'patch', // 0.1.2 -> 0.1.3 (increment patch)
    security: 'patch', // 0.1.2 -> 0.1.3 (increment patch)
    breaking: 'major', // 0.1.2 -> 1.0.0 (major bump)
    documentation: 'patch', // 0.1.2 -> 0.1.3 (increment patch)
}

// Get current version from package.json
function getCurrentVersion() {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'))

    return packageJson.version
}

// Bump version based on change type
function bumpVersion(version, changeType) {
    const [major, minor, patch] = version.split('.').map(Number)

    switch (CHANGE_TYPES[changeType] || 'patch') {
        case 'major':
            return `${major + 1}.0.0`
        case 'minor':
            return `${major}.${minor + 1}.0`
        case 'patch':
        default:
            return `${major}.${minor}.${patch + 1}` // This will be 0.1.2 -> 0.1.3
    }
}

// Get git changes since last commit
function getGitChanges() {
    try {
        const changes = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' })

        return changes.trim().split('\n').filter(Boolean)
    } catch {
        // No previous commits found, checking all files...
        return []
    }
}

// Analyze changes and determine change type
function analyzeChanges(_changes) {
    const changeType = 'feature' // Default to feature

    // You can add logic here to analyze file changes and determine type
    // For example: if changes include 'fix' in filename -> bugfix
    // if changes include 'docs' -> documentation, etc.

    return changeType
}

// Generate changelog entry
function generateChangelogEntry(changeType, _changes) {
    const currentDate = new Date().toISOString().split('T')[0]
    const currentVersion = getCurrentVersion()
    const newVersion = bumpVersion(currentVersion, changeType)

    const entry = {
        id: `auto-${Date.now()}`,
        version: newVersion,
        date: currentDate,
        title: `Auto-generated update for ${newVersion}`,
        description: `Automatically generated changelog entry based on recent changes`,
        type: changeType,
        author: {
            name: 'Rock ❤️ Star',
            avatar: '/icons/fixitrock.png',
            role: 'Lead Developer',
        },
        changes: [
            'Automatically detected and documented changes',
            'Updated version and changelog',
            'Maintained project consistency',
        ],
        tags: ['Auto-generated', 'Update', 'Maintenance'],
        pullRequest: `#${Math.floor(Math.random() * 1000)}`,
    }

    return { entry, newVersion }
}

// Generate commit message with PR hashtag
function generateCommitMessage(newVersion, changeType) {
    const prNumber = Math.floor(Math.random() * 1000)

    return `chore: bump version to ${newVersion} and update changelog

- Version bumped from ${getCurrentVersion()} to ${newVersion}
- Change type: ${changeType}
- Auto-generated changelog entry
- Updated package.json version

Closes #${prNumber}`
}

// Update changelog file
function updateChangelogFile(entry) {
    const changelogContent = fs.readFileSync(CHANGELOG_CONFIG_FILE, 'utf8')

    // Find the changelog data section
    const startIndex = changelogContent.indexOf(CHANGELOG_DATA_START)

    if (startIndex === -1) {
        // eslint-disable-next-line no-console
        console.error('Could not find changelog data section')

        return false
    }

    // Find the end of the changelog data
    const endIndex = changelogContent.indexOf(CHANGELOG_DATA_END, startIndex)

    if (endIndex === -1) {
        // eslint-disable-next-line no-console
        console.error('Could not find end of changelog data')

        return false
    }

    // Extract the current changelog data
    const currentData = changelogContent.substring(startIndex, endIndex + CHANGELOG_DATA_END.length)

    // Parse the current data to add new entry
    const newEntryString = `
        {
            version: '${entry.version}',
            date: '${entry.date}',
            summary: '${entry.title}',
            entries: [
                {
                    id: '${entry.id}',
                    version: '${entry.version}',
                    date: '${entry.date}',
                    title: '${entry.title}',
                    description: '${entry.description}',
                    type: '${entry.type}',
                    author: {
                        name: '${entry.author.name}',
                        avatar: '${entry.author.avatar}',
                        role: '${entry.author.role}',
                    },
                    changes: [
                        ${entry.changes.map((change) => `'${change}'`).join(',\n                        ')}
                    ],
                    tags: [${entry.tags.map((tag) => `'${tag}'`).join(', ')}],
                    pullRequest: '${entry.pullRequest}',
                },
            ],
        },`

    // Insert new entry after the first version
    const updatedData = currentData.replace(/versions: \[([\s\S]*?)\],/, (match, versions) => {
        const firstVersion = versions.match(/{[\s\S]*?}/)[0]

        return `versions: [${firstVersion}${newEntryString}${versions.replace(firstVersion, '')}],`
    })

    // Replace the content
    const newContent = changelogContent.replace(currentData, updatedData)

    fs.writeFileSync(CHANGELOG_CONFIG_FILE, newContent)

    return true
}

// Update package.json version
function updatePackageVersion(newVersion) {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'))

    packageJson.version = newVersion
    fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2))
}

// Main function
function main() {
    // eslint-disable-next-line no-console
    console.log('🚀 Auto-Changelog Generator')
    // eslint-disable-next-line no-console
    console.log('============================')

    try {
        // Get current version
        const currentVersion = getCurrentVersion()

        // eslint-disable-next-line no-console
        console.log(`📦 Current version: ${currentVersion}`)

        // Get git changes
        const changes = getGitChanges()

        // eslint-disable-next-line no-console
        console.log(`📝 Detected ${changes.length} changed files`)

        if (changes.length === 0) {
            // eslint-disable-next-line no-console
            console.log('✨ No changes detected, nothing to update')

            return
        }

        // Analyze changes
        const changeType = analyzeChanges(changes)

        // eslint-disable-next-line no-console
        console.log(`🔍 Change type: ${changeType}`)

        // Generate changelog entry
        const { entry, newVersion } = generateChangelogEntry(changeType, changes)

        // eslint-disable-next-line no-console
        console.log(`🆕 New version: ${newVersion}`)

        // Update changelog file
        if (updateChangelogFile(entry)) {
            // eslint-disable-next-line no-console
            console.log('✅ Changelog file updated successfully')
        } else {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to update changelog file')

            return
        }

        // Update package.json version
        updatePackageVersion(newVersion)
        // eslint-disable-next-line no-console
        console.log('✅ Package version updated successfully')

        // Generate commit message
        const commitMessage = generateCommitMessage(newVersion, changeType)

        // eslint-disable-next-line no-console
        console.log('\n📝 Generated Commit Message:')
        // eslint-disable-next-line no-console
        console.log('============================')
        // eslint-disable-next-line no-console
        console.log(commitMessage)
        // eslint-disable-next-line no-console
        console.log('\n💡 To commit these changes, run:')
        // eslint-disable-next-line no-console
        console.log('git add .')
        // eslint-disable-next-line no-console
        console.log(`git commit -m "${commitMessage.split('\n')[0]}"`)
        // eslint-disable-next-line no-console
        console.log('git push origin main')

        // eslint-disable-next-line no-console
        console.log('\n🎉 Auto-changelog generation complete!')
        // eslint-disable-next-line no-console
        console.log(`📋 New entry added for version ${newVersion}`)
        // eslint-disable-next-line no-console
        console.log(`🔗 Check ${CHANGELOG_CONFIG_FILE} to see the changes`)
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

// Run if called directly
if (import.meta.main) {
    main()
}

export { main, generateChangelogEntry, updateChangelogFile, generateCommitMessage }
