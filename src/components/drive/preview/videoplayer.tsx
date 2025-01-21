'use client'
import { Button } from '@heroui/react'
import { Loader, Maximize, Minimize, Volume2, VolumeX } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import { RiPictureInPictureFill } from 'react-icons/ri'
import { Slider } from '®/ui/slider'

interface CustomVideoPlayerProps {
    videoSrc: string
    poster?: string
    width?: number
    height?: number
}

export const VideoPlayer: React.FC<CustomVideoPlayerProps> = ({
    videoSrc,
    poster,
    height,
    width,
}) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [bufferedProgress, setBufferedProgress] = useState<number>(0) // Buffered progress
    const [volume, setVolume] = useState<number>(1)
    const [currentVolume, setCurrentVolume] = useState<number>(1)
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [showControls, setShowControls] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true) // Loading state
    const videoRef = useRef<HTMLVideoElement>(null)
    const playerRef = useRef<HTMLDivElement>(null)
    const [lastMouseMoveTime, setLastMouseMoveTime] = useState(Date.now())
    const [duration, setDuration] = useState<number>(0)

    const autoplay = useMemo(() => false, [])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const updateProgress = () => {
            if (video.duration > 0) {
                setProgress((video.currentTime / video.duration) * 100)
            }
        }

        const handleLoadedMetadata = () => {
            setDuration(video.duration)
            setLoading(false) // Video is ready to play
        }

        const handleVideoEnd = () => setIsPlaying(false)

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1)
                setBufferedProgress((bufferedEnd / video.duration) * 100)
            }
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('progress', handleProgress)
        video.addEventListener('timeupdate', updateProgress)
        video.addEventListener('ended', handleVideoEnd)

        if (autoplay) {
            video.play().catch((error) => console.error('Autoplay failed:', error))
        }

        return () => {
            video.removeEventListener('timeupdate', updateProgress)
            video.removeEventListener('ended', handleVideoEnd)
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('progress', handleProgress)
        }
    }, [autoplay])

    useEffect(() => {
        const handleMouseMove = () => {
            setLastMouseMoveTime(Date.now())
            setShowControls(true)
        }

        const handleMouseLeave = () => {
            if (isPlaying) {
                setShowControls(false)
            }
        }

        const checkMouseInactivity = () => {
            const currentTime = Date.now()
            if (currentTime - lastMouseMoveTime > 3000 && isFullscreen) {
                setShowControls(false)
            }
        }

        if (playerRef.current) {
            playerRef.current.addEventListener('mousemove', handleMouseMove)
            playerRef.current.addEventListener('mouseleave', handleMouseLeave)
        }

        const inactivityInterval = setInterval(checkMouseInactivity, 1000)

        return () => {
            if (playerRef.current) {
                playerRef.current.removeEventListener('mousemove', handleMouseMove)
                playerRef.current.removeEventListener('mouseleave', handleMouseLeave)
            }
            clearInterval(inactivityInterval)
        }
    }, [isFullscreen, lastMouseMoveTime, isPlaying])

    useEffect(() => {
        if (!isFullscreen) {
            setShowControls(true)
        }
    }, [isFullscreen])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleFullscreenChange)

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [])

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return
        videoRef.current[isPlaying ? 'pause' : 'play']()
        setIsPlaying(!isPlaying)
    }, [isPlaying])

    const handleProgressChange = useCallback((value: number | number[]) => {
        if (!videoRef.current) return

        const newTime = Array.isArray(value) ? value[0] : value
        const newVideoTime = (newTime / 100) * videoRef.current.duration
        videoRef.current.currentTime = newVideoTime
        setProgress(newTime)
    }, [])

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
        setVolume(isMuted ? currentVolume : 0)
    }, [isMuted, currentVolume])

    const handleVolumeChange = useCallback((value: number | number[]) => {
        if (!videoRef.current) return

        const newVolume = Array.isArray(value) ? value[0] : value
        videoRef.current.volume = newVolume
        setVolume(newVolume)
        setCurrentVolume(newVolume)
        setIsMuted(newVolume === 0)
    }, [])

    const toggleFullscreen = useCallback(() => {
        if (!playerRef.current) return
        if (!document.fullscreenElement) {
            playerRef.current.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }, [])

    const togglePip = useCallback(async () => {
        if (!videoRef.current) return

        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture()
        } else {
            await videoRef.current.requestPictureInPicture()
        }
    }, [])

    useEffect(() => {
        const handlePiPExit = () => {
            setIsFullscreen(false)
        }

        document.addEventListener('leavepictureinpicture', handlePiPExit)

        return () => {
            document.removeEventListener('leavepictureinpicture', handlePiPExit)
        }
    }, [])

    return (
        <>
            <div
                className={`relative flex h-full w-full max-w-full flex-col items-center justify-center overflow-hidden`}
                ref={playerRef}
            >
                {loading && (
                    <div className='absolute inset-0 flex items-center justify-center rounded-2xl'>
                        <Loader size={40} className='animate-spin text-white opacity-60' />
                    </div>
                )}
                <video
                    ref={videoRef}
                    className={`${isFullscreen ? '' : 'aspect-video rounded-lg border lg:aspect-square lg:rounded-none lg:border-none'} cursor-default`}
                    src={videoSrc}
                    width={width}
                    height={height}
                    poster={poster}
                    onClick={togglePlay}
                >
                    Your browser does not support the video tag.
                </video>
                {!isPlaying && !loading && (
                    <div
                        className='absolute inset-0 flex items-center justify-center'
                        onClick={togglePlay}
                    >
                        <FaPlay size={50} className='text-white opacity-60' />
                    </div>
                )}
                <div
                    className={`absolute -bottom-0.5 left-0 w-full p-1 transition-opacity duration-300 ease-in-out lg:bottom-1.5 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className='flex flex-col items-center'>
                        <div className='flex w-full items-center gap-2 px-1 text-xs'>
                            <p>{formatTime(videoRef.current ? videoRef.current.currentTime : 0)}</p>
                            <div className='relative w-full'>
                                <Slider
                                    value={[progress]}
                                    bufferedProgress={bufferedProgress}
                                    className=''
                                    onValueChange={handleProgressChange}
                                    min={0}
                                    max={100}
                                    hideThumb
                                    aria-label='Video Track'
                                />
                            </div>
                            <p>{formatTime(duration)}</p>
                        </div>
                        <div className='flex w-full items-center justify-between lg:-mb-2 lg:mt-2'>
                            <div className='flex w-full max-w-32'>
                                <Button
                                    isIconOnly
                                    radius='full'
                                    className='bg-transparent'
                                    onPress={toggleMute}
                                >
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </Button>
                                <Slider
                                    value={[volume]}
                                    onValueChange={handleVolumeChange}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    aria-label='Slider with solid thumb'
                                />
                            </div>
                            <div className='flex w-full items-center justify-end'>
                                <Button
                                    isIconOnly
                                    radius='full'
                                    variant='light'
                                    onPress={togglePip}
                                >
                                    <RiPictureInPictureFill size={20} />
                                </Button>
                                <Button
                                    isIconOnly
                                    radius='full'
                                    variant='light'
                                    onPress={toggleFullscreen}
                                >
                                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
