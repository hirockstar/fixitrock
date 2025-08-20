import { Metadata } from 'next'
import { CalendarDays, GitBranch, Zap, Bug, Star, ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

import { Badge } from '@/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { changelogData } from '@/config/changelog'

export const metadata: Metadata = {
    title: 'Changelog - Fix iT Rock',
    description: 'Track all changes, new features, and improvements made to Fix iT Rock',
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'feature':
            return <Star className='h-4 w-4' />
        case 'bugfix':
            return <Bug className='h-4 w-4' />
        case 'improvement':
            return <Zap className='h-4 w-4' />
        case 'breaking':
            return <GitBranch className='h-4 w-4' />
        default:
            return <CalendarDays className='h-4 w-4' />
    }
}

const getTypeColor = (type: string) => {
    switch (type) {
        case 'feature':
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800'
        case 'bugfix':
            return 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800'
        case 'improvement':
            return 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800'
        case 'breaking':
            return 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800'
        default:
            return 'bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-800'
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export default function ChangelogPage() {
    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='mb-12 text-center'>
                <h1 className='mb-4 text-4xl font-bold tracking-tight'>Changelog</h1>
                <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
                    Track all changes, new features, and improvements made to Fix iT Rock
                </p>
            </div>

            {/* Roadmap Timeline */}
            <div className='relative'>
                {/* Vertical connecting line */}
                <div className='from-accent via-primary to-accent absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b opacity-30 sm:left-8' />

                {changelogData.versions.map((version, versionIndex) =>
                    version.entries.map((entry) => (
                        <div
                            key={`${version.version}-${entry.id}`}
                            className='relative mb-8 last:mb-0 sm:mb-12'
                        >
                            {/* Timeline dot */}
                            <div className='bg-background border-accent absolute left-2 z-10 h-4 w-4 rounded-full border-2 shadow-lg sm:left-6'>
                                <div className='bg-accent absolute inset-1 animate-pulse rounded-full' />
                            </div>

                            {/* Connecting line to card */}
                            <div className='bg-border absolute top-2 left-6 h-0.5 w-4 sm:left-10 sm:w-8' />

                            <div className='ml-12 sm:ml-20'>
                                <Card className='border-l-primary group border-l-4 shadow-none transition-all duration-300'>
                                    <CardHeader className='pb-4'>
                                        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-2'>
                                            <div className='flex flex-wrap items-center gap-3'>
                                                <Badge
                                                    className={`${getTypeColor(entry.type)} font-medium`}
                                                    variant='outline'
                                                >
                                                    {getTypeIcon(entry.type)}
                                                    <span className='ml-1 capitalize'>
                                                        {entry.type}
                                                    </span>
                                                </Badge>
                                                <Badge
                                                    className='font-mono text-xs'
                                                    variant='secondary'
                                                >
                                                    {entry.version}
                                                </Badge>
                                                {entry.pullRequest && (
                                                    <Badge className='text-xs' variant='outline'>
                                                        <SiGithub className='mr-1 h-3 w-3' />
                                                        {entry.pullRequest}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className='text-muted-foreground flex items-center text-sm'>
                                                <CalendarDays className='mr-1 h-4 w-4' />
                                                {formatDate(entry.date)}
                                            </div>
                                        </div>

                                        <CardTitle className='text-xl sm:text-2xl'>
                                            {entry.title}
                                        </CardTitle>
                                        <CardDescription className='text-base leading-relaxed'>
                                            {entry.description}
                                        </CardDescription>

                                        <div className='border-border/50 flex items-center gap-3 border-t pt-3'>
                                            <Avatar className='h-10 w-10'>
                                                <AvatarImage
                                                    alt={entry.author.name}
                                                    src={entry.author.avatar}
                                                />
                                                <AvatarFallback className='bg-accent text-accent-foreground'>
                                                    RS
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='min-w-0 flex-1'>
                                                <p className='truncate text-sm font-medium'>
                                                    {entry.author.name}
                                                </p>
                                                <p className='text-muted-foreground text-xs'>
                                                    {entry.author.role}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className='space-y-3'>
                                            <h4 className='text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase'>
                                                <ExternalLink className='h-3 w-3' />
                                                What's New
                                            </h4>
                                            <ul className='space-y-3'>
                                                {entry.changes.map((change, changeIndex) => (
                                                    <li
                                                        key={changeIndex}
                                                        className='flex items-start gap-3 text-sm'
                                                    >
                                                        <div className='bg-accent mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full' />
                                                        <span className='leading-relaxed'>
                                                            {change}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Connection indicator for next item */}
                            {versionIndex < changelogData.versions.length - 1 && (
                                <div className='bg-accent/50 absolute -bottom-4 left-3 h-2 w-2 animate-bounce rounded-full sm:-bottom-6 sm:left-7' />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className='mt-16 text-center'>
                <div className='bg-muted/50 rounded-lg border p-6'>
                    <h3 className='mb-3 text-lg font-semibold'>Want to contribute?</h3>
                    <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                        <a
                            className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'
                            href='https://github.com/fixitrock/web'
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            <SiGithub className='h-4 w-4' />
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
