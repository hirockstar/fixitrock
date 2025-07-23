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
    Tooltip,
} from '@heroui/react'
import { MapPin, ArrowLeft, UserRound, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { BiMaleFemale } from 'react-icons/bi'
import { useActionState } from 'react'

import { User } from '®app/login/types'
import { updateUser } from '®actions/users'
import { openCurrentLocationInMaps } from '®lib/utils'
import { GoogleMaps } from '®ui/icons'
import { Dob } from '®ui/dob'

const LOCATION_EDIT_ROLES = [2, 3]

export function Setting({ user }: { user: User }) {
    const [form, setForm] = useState(() => ({ ...user }))
    const bioError =
        form.bio && form.bio.length > 160 ? 'Bio must be 160 characters or less' : undefined
    const [dobError, setDobError] = useState('')
    const [locationUrlError, setLocationUrlError] = useState('')

    const canEditLocation = typeof user.role === 'number' && LOCATION_EDIT_ROLES.includes(user.role)

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const [, formAction, isLoading] = useActionState(
        async (prevState: Record<string, unknown>, formData: FormData) => {
            if (dobError) {
                addToast({
                    title: 'Please enter a valid date of birth.',
                    color: 'danger',
                })

                return prevState
            }
            // Set all form fields dynamically, converting values to string
            Object.entries(form).forEach(([key, value]) => {
                formData.set(key, value == null ? '' : String(value))
            })

            try {
                const result = await updateUser(formData)

                if (result && result.user) {
                    setForm({ ...result.user })
                    addToast({
                        title: 'Profile settings saved successfully!',
                        color: 'success',
                    })
                }

                return result
            } catch {
                addToast({
                    title: 'Failed to save profile settings',
                    color: 'danger',
                })

                return prevState
            }
        },
        {}
    )

    return (
        <Form action={formAction} className='mx-auto mt-2 grid max-w-4xl gap-4 px-2'>
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
            <Input
                description='Your real or display name as you want it to appear on your profile.'
                id='name'
                label='Full Name'
                labelPlacement='outside'
                name='name'
                placeholder='Enter your full name'
                startContent={<UserRound className='text-muted-foreground' size={18} />}
                value={form.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
            />
            <Select
                description='Choose your gender (optional).'
                label='Gender'
                labelPlacement='outside'
                name='gender'
                placeholder='Select Gender'
                selectedKeys={form.gender ? [form.gender] : []}
                startContent={<BiMaleFemale className='text-muted-foreground' size={18} />}
                onSelectionChange={(keys) =>
                    handleChange('gender', Array.from(keys)[0]?.toString() || '')
                }
            >
                <SelectSection>
                    <SelectItem key='male'>Male</SelectItem>
                    <SelectItem key='female'>Female</SelectItem>
                    <SelectItem key='other'>Other</SelectItem>
                </SelectSection>
            </Select>
            <Dob
                description='Enter your birth date (must be 18+)'
                label='Date of Birth'
                value={form.dob || ''}
                onChange={(val) => handleChange('dob', val)}
                onError={setDobError}
            />
            {canEditLocation && (
                <>
                    <Input
                        description='Enter your shop or business address (as users will see it)'
                        id='location'
                        label='Store/Shop Address'
                        labelPlacement='outside'
                        name='location'
                        placeholder='e.g. Fix iT Rock, Sikandrabad, India'
                        startContent={<MapPin className='h-4 w-4' />}
                        value={form.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                    <Input
                        description='Paste the Google Maps URL for your shop location (users can click to open in Maps)'
                        endContent={
                            <Tooltip content='Open current location in Maps'>
                                <Button
                                    isIconOnly
                                    radius='full'
                                    size='sm'
                                    startContent={<GoogleMaps />}
                                    variant='light'
                                    onPress={openCurrentLocationInMaps}
                                />
                            </Tooltip>
                        }
                        errorMessage={locationUrlError}
                        id='location_url'
                        isInvalid={!!locationUrlError}
                        label='Store/Shop Location URL'
                        labelPlacement='outside'
                        name='location_url'
                        placeholder='Paste your Google Maps link here'
                        startContent={<LinkIcon className='h-4 w-4' />}
                        type='url'
                        value={form.location_url || ''}
                        onChange={(e) => {
                            handleChange('location_url', e.target.value)
                            // Validate URL
                            try {
                                if (e.target.value && !/^https?:\/\//.test(e.target.value)) {
                                    setLocationUrlError(
                                        'Please enter a valid URL starting with http:// or https://'
                                    )
                                } else if (e.target.value && !new URL(e.target.value)) {
                                    setLocationUrlError('Please enter a valid URL')
                                } else {
                                    setLocationUrlError('')
                                }
                            } catch {
                                setLocationUrlError('Please enter a valid URL')
                            }
                        }}
                    />
                </>
            )}
            <Textarea
                description={`Tell us about yourself, your shop, or your interests. (${form.bio?.length || 0}/160 characters)`}
                errorMessage={bioError}
                id='bio'
                isInvalid={!!bioError}
                label='Bio'
                labelPlacement='outside'
                maxLength={160}
                name='bio'
                placeholder='Tell us about yourself...'
                rows={3}
                value={form.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
            />
            <div className='flex justify-end'>
                <Button color='primary' isLoading={isLoading} size='sm' type='submit'>
                    {isLoading ? 'Saving . . .' : ' Save'}
                </Button>
            </div>
        </Form>
    )
}
