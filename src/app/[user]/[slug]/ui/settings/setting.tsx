'use client'

import React, { useState } from 'react'
import { Form, Input, Textarea, Button, addToast, RadioGroup, Radio } from '@heroui/react'
import { MapPin, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { User } from '®app/login/types'
import { updateUser } from '®actions/user'

export function Setting({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState(false)

    const [gender, setGender] = useState(user.gender || '')
    const [bio, setBio] = useState(user.bio || '')
    const bioError = bio.length > 160 ? 'Bio must be 160 characters or less' : undefined

    const handleFormSubmit = async (formData: FormData) => {
        setIsLoading(true)

        const updatePromise = updateUser(formData)

        addToast({
            title: 'Saving your changes...',
            color: 'primary',
            promise: updatePromise,
        })

        try {
            await updatePromise

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
                    href='/'
                    radius='full'
                    size='sm'
                    startContent={<ArrowLeft size={20} />}
                    variant='light'
                />
                <h1 className='text-2xl font-bold'>Account Settings</h1>
            </div>

            {/* Name */}
            <Input
                isRequired
                defaultValue={user.name}
                id='name'
                label='Full Name'
                labelPlacement='outside'
                name='name'
                placeholder='Enter your full name'
            />
            {/* Gender */}
            <RadioGroup
                isRequired
                label='Gender'
                orientation='horizontal'
                value={gender}
                onValueChange={(val) => setGender(val as 'male' | 'female' | 'other')}
            >
                <Radio value='male'>Male</Radio>
                <Radio value='female'>Female</Radio>
                <Radio value='other'>Other</Radio>
            </RadioGroup>
            {/* Date of Birth */}
            <div className='space-y-2'>
                <label className='flex items-center gap-2' htmlFor='dob'>
                    <Calendar className='h-4 w-4' /> Date of Birth
                </label>
                <Input defaultValue={user.dob || ''} id='dob' name='dob' type='date' />
            </div>
            {/* Location */}
            <Input
                defaultValue={user.location || ''}
                id='location'
                label='Location'
                labelPlacement='outside'
                name='location'
                placeholder='Enter your location'
                startContent={<MapPin className='h-4 w-4' />}
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
