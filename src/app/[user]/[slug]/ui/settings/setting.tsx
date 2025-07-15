'use client'

import React, { useState } from 'react'
import {
    Form,
    Input,
    Textarea,
    Button,
    addToast,
    Select,
    SelectSection,
    SelectItem,
} from '@heroui/react'
import { MapPin, ArrowLeft, UserRound } from 'lucide-react'
import Link from 'next/link'
import { BiMaleFemale } from 'react-icons/bi'

import { User } from '®app/login/types'
import { updateUser } from '®actions/user'
import DateInput from '®components/date'

export function Setting({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState(user.name || '')
    const [gender, setGender] = useState(user.gender || '')
    const [bio, setBio] = useState(user.bio || '')
    const [location, setLocation] = useState(user.location || '')
    const [dob, setDob] = useState(user.dob || '')
    const bioError = bio.length > 160 ? 'Bio must be 160 characters or less' : undefined
    const [dobError, setDobError] = useState('')

    const handleFormSubmit = async (formData: FormData) => {
        // Prevent submit if dob is invalid
        if (dobError) {
            addToast({
                title: 'Please enter a valid date of birth.',
                color: 'danger',
            })

            return
        }
        setIsLoading(true)
        formData.set('name', name)
        formData.set('gender', gender)
        formData.set('bio', bio)
        formData.set('location', location)
        formData.set('dob', dob || '')

        const updatePromise = updateUser(formData)

        addToast({
            title: 'Saving your changes...',
            color: 'primary',
            promise: updatePromise,
        })

        try {
            const result = await updatePromise

            if (result && result.user) {
                setName(result.user.name || '')
                setGender(result.user.gender || '')
                setBio(result.user.bio || '')
                setLocation(result.user.location || '')
                setDob(result.user.dob || '')
            }
            addToast({
                title: 'Profile settings saved successfully!',
                color: 'success',
            })
        } catch {
            addToast({
                title: 'Failed to save profile settings',
                color: 'danger',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form action={handleFormSubmit} className='mx-auto mt-2 grid max-w-4xl gap-4 px-2'>
            <div className='flex items-center gap-3'>
                <Button
                    isIconOnly
                    passHref
                    as={Link}
                    href={`/@${user.username}`}
                    radius='full'
                    size='sm'
                    startContent={<ArrowLeft size={20} />}
                    variant='light'
                />
                <h1 className='text-2xl font-bold'>Account Settings</h1>
            </div>

            {/* Name */}
            <Input
                id='name'
                label='Full Name'
                labelPlacement='outside'
                name='name'
                placeholder='Enter your full name'
                startContent={<UserRound className='text-muted-foreground' size={18} />}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Select
                label='Gender'
                labelPlacement='outside'
                name='gender'
                placeholder='Select Gender'
                selectedKeys={gender ? [gender] : []}
                startContent={<BiMaleFemale className='text-muted-foreground' size={18} />}
                onSelectionChange={(keys) => setGender(Array.from(keys)[0]?.toString() || '')}
            >
                <SelectSection>
                    <SelectItem key='male'>Male</SelectItem>
                    <SelectItem key='female'>Female</SelectItem>
                    <SelectItem key='other'>Other</SelectItem>
                </SelectSection>
            </Select>

            {/* Date of Birth */}
            <DateInput value={dob} onChange={setDob} onError={setDobError} />

            {/* Location */}
            <Input
                id='location'
                label='Location'
                labelPlacement='outside'
                name='location'
                placeholder='Enter your location'
                startContent={<MapPin className='h-4 w-4' />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            {/* Bio */}
            <Textarea
                description={`${bio.length}/160 characters`}
                errorMessage={bioError}
                id='bio'
                isInvalid={!!bioError}
                label='Bio'
                labelPlacement='outside'
                maxLength={160}
                name='bio'
                placeholder='Tell us about yourself...'
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />
            {/* Submit Button */}
            <div className='flex justify-end'>
                <Button isLoading={isLoading} type='submit'>
                    {isLoading ? 'Saving . . .' : ' Save'}
                </Button>
            </div>
        </Form>
    )
}
