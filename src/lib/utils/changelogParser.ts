export interface ChangelogEntry {
    version: string
    date?: string
    type: 'major' | 'minor' | 'patch'
    changes: string[]
    commitHash?: string
}

export interface ParsedChangelog {
    packageName: string
    versions: ChangelogEntry[]
}

export function parseChangelog(changelogContent: string): ParsedChangelog {
    const lines = changelogContent.split('\n')
    const packageName = lines[0].replace('# ', '').trim()
    
    const versions: ChangelogEntry[] = []
    let currentVersion: ChangelogEntry | null = null
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        
        // Check for version headers (## X.Y.Z)
        if (line.startsWith('## ') && /^\d+\.\d+\.\d+$/.test(line.replace('## ', ''))) {
            if (currentVersion) {
                versions.push(currentVersion)
            }
            
            const version = line.replace('## ', '')
            currentVersion = {
                version,
                type: getVersionType(version),
                changes: []
            }
        }
        
        // Check for change entries
        if (line.startsWith('- ') && currentVersion) {
            const change = line.replace('- ', '')
            currentVersion.changes.push(change)
            
            // Extract commit hash if present
            const hashMatch = change.match(/([a-f0-9]{7,}):\s*(.+)/)
            if (hashMatch) {
                currentVersion.commitHash = hashMatch[1]
                // Replace the change text to remove hash
                const lastIndex = currentVersion.changes.length - 1
                currentVersion.changes[lastIndex] = hashMatch[2]
            }
        }
    }
    
    // Add the last version
    if (currentVersion) {
        versions.push(currentVersion)
    }
    
    return {
        packageName,
        versions: versions.reverse() // Show latest first
    }
}

function getVersionType(version: string): 'major' | 'minor' | 'patch' {
    const [major, minor, patch] = version.split('.').map(Number)
    
    if (major > 0) return 'major'
    if (minor > 0) return 'patch'
    return 'patch'
}

export function getTypeIcon(type: string) {
    switch (type) {
        case 'major':
            return '💥'
        case 'minor':
            return '✨'
        case 'patch':
            return '🐛'
        default:
            return '📝'
    }
}

export function getTypeColor(type: string) {
    switch (type) {
        case 'major':
            return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800'
        case 'minor':
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800'
        case 'patch':
            return 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800'
        default:
            return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-800'
    }
}

export function getTypeLabel(type: string) {
    switch (type) {
        case 'major':
            return 'Breaking Change'
        case 'minor':
            return 'New Feature'
        case 'patch':
            return 'Bug Fix'
        default:
            return 'Update'
    }
}
