import { Metadata } from 'next'
import { Github } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'


export const metadata: Metadata = {
    title: 'Changelog - Fix iT Rock',
    description: 'Track all changes, new features, and improvements made to Fix iT Rock',
}

// This will be populated by @changesets when releases are created
export default function ChangelogPage() {
    // For now, we'll show the getting started message
    // In the future, this will read from CHANGELOG.md automatically
    const hasChangelog = false

    if (!hasChangelog) {
        return (
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-12 text-center'>
                    <h1 className='mb-4 text-4xl font-bold tracking-tight'>Changelog</h1>
                    <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                        Track all changes, new features, and improvements made to Fix iT Rock. Our
                        changelog is automatically generated using @changesets.
                    </p>
                </div>

                {/* Changesets Info */}
                <div className='mx-auto mb-12 max-w-4xl'>
                    <Card className='border-l-4 border-l-blue-500'>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Github className='h-5 w-5 text-blue-500' />
                                How to Add Changes
                            </CardTitle>
                            <CardDescription>
                                Use @changesets to automatically generate changelog entries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='bg-muted rounded-lg p-4'>
                                    <h4 className='mb-2 font-semibold'>1. Create a Changeset</h4>
                                    <code className='bg-background rounded px-2 py-1 text-sm'>
                                        bun run changeset
                                    </code>
                                    <p className='text-muted-foreground mt-2 text-sm'>
                                        This will ask for change type and description, then create a
                                        markdown file.
                                    </p>
                                </div>

                                <div className='bg-muted rounded-lg p-4'>
                                    <h4 className='mb-2 font-semibold'>2. Commit and Push</h4>
                                    <code className='bg-background rounded px-2 py-1 text-sm'>
                                        git add .changeset/ && git commit -m "add changeset" && git push
                                    </code>
                                    <p className='text-muted-foreground mt-2 text-sm'>
                                        Include the changeset file in your PR.
                                    </p>
                                </div>

                                <div className='bg-muted rounded-lg p-4'>
                                    <h4 className='mb-2 font-semibold'>3. Automatic Release</h4>
                                    <p className='text-muted-foreground text-sm'>
                                        When merged to main, GitHub Actions will automatically:
                                    </p>
                                    <ul className='text-muted-foreground mt-2 list-inside list-disc text-sm'>
                                        <li>Bump version numbers</li>
                                        <li>Generate changelog entries</li>
                                        <li>Create release notes</li>
                                        <li>Update this page</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Status */}
                <div className='mx-auto max-w-4xl text-center'>
                    <div className='bg-muted/50 rounded-lg border p-8'>
                        <h3 className='mb-4 text-xl font-semibold'>🚀 Getting Started</h3>
                        <p className='text-muted-foreground mb-6'>
                            No changelog entries yet! Create your first changeset to see it appear here.
                        </p>
                        <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
                            <a
                                className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'
                                href='https://github.com/fixitrock/web'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                <Github className='h-4 w-4' />
                                View on GitHub
                            </a>
                            <a
                                className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
                                href='https://wa.me/919927242828'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                                </svg>
                                Contact on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='mb-12 text-center'>
                <h1 className='mb-4 text-4xl font-bold tracking-tight'>Changelog</h1>
                <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                    Track all changes, new features, and improvements made to Fix iT Rock
                </p>
            </div>

            {/* Current Status */}
            <div className='mx-auto max-w-4xl text-center'>
                <div className='bg-muted/50 rounded-lg border p-8'>
                    <h3 className='mb-4 text-xl font-semibold'>🚀 Getting Started</h3>
                    <p className='text-muted-foreground mb-6'>
                        Your changelog is being generated! The @changesets system is working and will automatically populate this page.
                    </p>
                    <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
                        <a
                            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'
                            href='https://github.com/fixitrock/web'
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <Github className='h-4 w-4' />
                            View on GitHub
                        </a>
                        <a
                            className='inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'
                            href='https://wa.me/919927242828'
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                            </svg>
                            Contact on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
