'use client'

import { ArrowDownToLine, Download } from 'lucide-react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { IoAlertCircle } from 'react-icons/io5'

import { DownloadItem } from '@/zustand/store/download'
import { DriveItem } from '@/types/drive'

interface DownloadSwitchProps {
    c: DriveItem
    downloads: Map<string, DownloadItem>
    size?: number
}

export function DownloadSwitch({ c, downloads, size = 16 }: DownloadSwitchProps) {
    const download = downloads.get(c.id)

    const getSwitchProps = () => {
        if (!download) {
            return {
                icon: <ArrowDownToLine size={size} />,
                title: 'Click file to download',
            }
        }

        switch (download.status) {
            case 'queued':
                return {
                    title: `Queued - Position ${download.queuePosition || '?'}`,
                    isLoading: true,
                }
            case 'downloading':
                return {
                    icon: <FaPause size={size} />,
                    title: 'Downloading - Click file to pause',
                }
            case 'paused':
                return {
                    icon: <FaPlay size={size} />,
                    title: 'Paused - Click file to resume',
                }
            case 'completed':
                return {
                    icon: <Download size={size} />,
                    title: 'Completed - Click file to download again',
                    color: 'success' as const,
                }
            case 'error':
                return {
                    icon: <IoAlertCircle size={size} />,
                    title: 'Error - Click file to retry',
                    color: 'danger' as const,
                }
            default:
                return {
                    icon: <Download size={size} />,
                    title: 'Click file to download',
                }
        }
    }

    return getSwitchProps()
}
