'use client'
import { BsFileEarmarkCodeFill } from 'react-icons/bs'
import {
    SiCss3,
    SiPython,
    SiGnubash,
    SiHtml5,
    SiReact,
    SiMarkdown,
    SiNextdotjs,
    SiVercel,
    SiTypescript,
} from 'react-icons/si'
import { VscJson, VscTerminalLinux } from 'react-icons/vsc'
import { IoLogoJavascript } from 'react-icons/io5'
import { AiOutlineFileText, AiOutlineFolderOpen } from 'react-icons/ai'
import { RiLockPasswordFill } from 'react-icons/ri'
import { FaTerminal, FaUserCircle } from 'react-icons/fa'
import { BookText } from 'lucide-react'

type Props = {
    lang: string
}

export default function CodeTitle({ lang }: Props) {
    let Icon, Title
    switch (lang) {
        case 'html':
            Icon = SiHtml5
            Title = 'HTML'
            break
        case 'css':
            Icon = SiCss3
            Title = 'CSS'
            break
        case 'js':
            Icon = IoLogoJavascript
            Title = 'JavaScript'
            break
        case 'bash':
            Icon = SiGnubash
            Title = 'Bash'
            break
        case 'py':
            Icon = SiPython
            Title = 'Python'
            break
        case 'json':
            Icon = VscJson
            Title = 'JSON'
            break
        case 'jsx':
            Icon = SiReact
            Title = 'JavaScript (JSX)'
            break
        case 'text':
            Icon = AiOutlineFileText
            Title = 'Text'
            break
        case 'md':
            Icon = SiMarkdown
            Title = 'Markdown'
            break
        case 'next':
            Icon = SiNextdotjs
            Title = 'Next.js'
            break
        case 'directory':
            Icon = AiOutlineFolderOpen
            Title = 'Directory'
            break
        case 'vercel':
            Icon = SiVercel
            Title = 'Vercel'
            break
        case 'ts':
        case 'tsx':
            Icon = SiTypescript
            Title = 'TypeScript'
            break
        case 'cmd':
            Icon = FaTerminal
            Title = 'Command Prompt'
            break
        case 'linux':
            Icon = VscTerminalLinux
            Title = 'Linux Terminal'
            break
        case 'username':
            Icon = FaUserCircle
            Title = 'User Name'
            break
        case 'password':
            Icon = RiLockPasswordFill
            Title = 'Password'
            break
        case 'txt':
            Icon = BookText
            Title = 'Text'
            break
        default:
            Icon = BsFileEarmarkCodeFill
            Title = 'Code'
            break
    }
    return (
        <div className='flex items-center gap-2'>
            <Icon className='h-5 w-5' />
            <p className='!my-0 text-sm font-[500]'>{Title}</p>
        </div>
    )
}
