'use client'

import React, { useState } from 'react'
import {
    Form,
    Button,
    addToast,
    Card,
    CardHeader,
    CardBody,
    Input,
    Select,
    SelectItem,
    SelectSection,
    Textarea,
    Tooltip,
    CardFooter,
} from '@heroui/react'
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    LinkIcon,
    MapPin,
    Shield,
    Sparkles,
    Store,
    Trash2,
    UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { useActionState } from 'react'
import { BiMaleFemale } from 'react-icons/bi'

import { User } from '®app/login/types'
import { updateUser } from '®actions/users'
import { GoogleMaps } from '®ui/icons'
import { formatDateTime, openCurrentLocationInMaps } from '®lib/utils'
import { Badge } from '®ui/badge'
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
        <Form
            action={formAction}
            className='mx-auto flex max-w-7xl flex-col gap-4 rounded-xl p-2 md:p-4'
        >
            <div className='flex items-center gap-4'>
                <Button
                    isIconOnly
                    passHref
                    as={Link}
                    className='bg-muted/40'
                    href={`/@${user.username}`}
                    radius='full'
                    size='sm'
                    startContent={<ArrowLeft size={20} />}
                    variant='light'
                />
                <div>
                    <h1 className='text-xl leading-6 font-bold'>Account Settings</h1>
                    <p className='text-muted-foreground text-sm'>
                        Manage your profile and preferences
                    </p>
                </div>
            </div>

            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'>
                <Card fullWidth className='border bg-transparent md:p-4' shadow='none'>
                    <CardHeader className='items-start gap-2'>
                        <UserRound className='bg-muted/20 size-8 rounded-full p-1 text-indigo-500 dark:text-indigo-400' />
                        <div className='flex flex-col'>
                            <h1 className='text-lg leading-5 font-semibold'>
                                Personal Information
                            </h1>
                            <p className='text-muted-foreground text-sm'>
                                Your basic profile details
                            </p>
                        </div>
                    </CardHeader>
                    <CardBody className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <Input
                            description='Your display name'
                            label='Name'
                            labelPlacement='outside-top'
                            name='name'
                            placeholder='Enter your full name'
                            startContent={<UserRound className='text-muted-foreground' size={18} />}
                            value={form.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            isDisabled
                            description='Cannot be changed'
                            label='Username'
                            labelPlacement='outside-top'
                            name='username'
                            placeholder='Enter your username'
                            startContent={<UserRound className='text-muted-foreground' size={18} />}
                            value={`fixitrock.com/@${form.username || ''}`}
                            onChange={(e) => handleChange('username', e.target.value)}
                        />
                        <Input
                            isDisabled
                            description='Cannot be changed'
                            label='Phone Number'
                            labelPlacement='outside-top'
                            name='phone'
                            placeholder='Enter your phone number'
                            startContent={
                                <span className='text-muted-foreground text-sm'>+91</span>
                            }
                            value={form.phone ? form.phone.slice(-10) : ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                        <Select
                            description='Optional selection'
                            label='Gender'
                            labelPlacement='outside'
                            name='gender'
                            placeholder='Select Gender'
                            selectedKeys={form.gender ? [form.gender] : []}
                            startContent={
                                <BiMaleFemale className='text-muted-foreground' size={18} />
                            }
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
                    </CardBody>
                    <CardFooter>
                        <Dob
                            description='Must be 18 or older'
                            label='Date of Birth'
                            value={form.dob || ''}
                            onChange={(val) => handleChange('dob', val)}
                            onError={setDobError}
                        />
                    </CardFooter>
                </Card>
                <Card fullWidth className='border bg-transparent md:p-4' shadow='none'>
                    <CardHeader className='items-start gap-2'>
                        <Sparkles className='bg-muted/20 size-8 rounded-full p-1 text-amber-500 dark:text-amber-400' />
                        <div className='flex flex-col'>
                            <h1 className='text-lg leading-5 font-semibold'>About You</h1>
                            <p className='text-muted-foreground text-sm'>
                                Tell the world about yourself and your expertise
                            </p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Textarea
                            classNames={{
                                description: 'flex justify-between',
                                base: 'gap-2',
                            }}
                            description={
                                <>
                                    <p>About yourself or business</p>
                                    <p>{form.bio?.length || 0}/160</p>
                                </>
                            }
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
                    </CardBody>
                </Card>
            </div>

            {canEditLocation && (
                <Card fullWidth className='border bg-transparent md:p-4' shadow='none'>
                    <CardHeader className='items-start gap-2'>
                        <Store className='bg-muted/20 size-8 rounded-full p-1 text-blue-500 dark:text-blue-400' />
                        <div className='flex flex-col'>
                            <h1 className='text-lg leading-5 font-semibold'>Business Location</h1>
                            <p className='text-muted-foreground text-sm'>
                                Your shop or service location details
                            </p>
                        </div>
                    </CardHeader>
                    <CardBody className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <Input
                            description='Your shop address'
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
                            description='Google Maps link'
                            endContent={
                                <Tooltip content='Get your Google Maps URL'>
                                    <Button
                                        isIconOnly
                                        radius='full'
                                        size='sm'
                                        startContent={<GoogleMaps className='size-6' />}
                                        variant='light'
                                        onPress={openCurrentLocationInMaps}
                                    />
                                </Tooltip>
                            }
                            errorMessage={locationUrlError}
                            id='location_url'
                            isInvalid={!!locationUrlError}
                            label='Google Maps URL'
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
                    </CardBody>
                </Card>
            )}
            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card
                    className='bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/30 p-4 dark:from-slate-800/50 dark:via-gray-800/30 dark:to-slate-700/20'
                    shadow='sm'
                >
                    <CardHeader className='flex flex-row items-center justify-between gap-2 pb-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100/80 dark:bg-green-900/30'>
                                <CheckCircle className='h-4 w-4 text-green-600 dark:text-green-400' />
                            </div>
                            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                Account Status
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                        <Badge
                            className={`font-medium ${
                                form.active
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            }`}
                            variant='secondary'
                        >
                            {form.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </CardBody>
                </Card>

                <Card
                    className='bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/30 p-4 dark:from-slate-800/50 dark:via-gray-800/30 dark:to-slate-700/20'
                    shadow='sm'
                >
                    <CardHeader className='flex flex-row items-center justify-between gap-2 pb-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/80 dark:bg-blue-900/30'>
                                <Shield className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                            </div>
                            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                Verification
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                        <Badge
                            className={`font-medium ${
                                form.verified
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            }`}
                            variant='secondary'
                        >
                            {form.verified ? 'Verified' : 'Pending'}
                        </Badge>
                    </CardBody>
                </Card>

                <Card
                    className='bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/30 p-4 dark:from-slate-800/50 dark:via-gray-800/30 dark:to-slate-700/20'
                    shadow='sm'
                >
                    <CardHeader className='flex flex-row items-center justify-between gap-2 pb-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100/80 dark:bg-purple-900/30'>
                                <Calendar className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                            </div>
                            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                Member Since
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                        <Badge
                            className='bg-purple-100 font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                            variant='secondary'
                        >
                            {formatDateTime(form.created_at)}
                        </Badge>
                    </CardBody>
                </Card>

                <Card
                    className='bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/30 p-4 dark:from-slate-800/50 dark:via-gray-800/30 dark:to-slate-700/20'
                    shadow='sm'
                >
                    <CardHeader className='flex flex-row items-center justify-between gap-2 pb-2'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100/80 dark:bg-orange-900/30'>
                                <Clock className='h-4 w-4 text-orange-600 dark:text-orange-400' />
                            </div>
                            <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                                Last Login
                            </h3>
                        </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                        <Badge
                            className='bg-orange-100 font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                            variant='secondary'
                        >
                            {user.updated_at ? formatDateTime(user.updated_at) : 'Never'}
                        </Badge>
                    </CardBody>
                </Card>
            </div>

            {/* Action Buttons - Save & Delete */}
            <div className='flex w-full items-center justify-between border-t pt-4'>
                <div className='flex items-center gap-2'>
                    <Button
                        className='border-danger rounded-sm border'
                        color='danger'
                        size='sm'
                        startContent={<Trash2 className='size-4' />}
                        variant='light'
                    >
                        Delete Account
                    </Button>
                    <p className='text-muted-foreground hidden text-xs sm:block'>
                        Permanently remove your account
                    </p>
                </div>
                <Button
                    className='rounded-sm'
                    color='primary'
                    isDisabled={!!bioError || !!dobError || !!locationUrlError}
                    isLoading={isLoading}
                    size='sm'
                    type='submit'
                >
                    {isLoading ? 'Saving . . .' : ' Save Changes'}
                </Button>
            </div>
        </Form>
    )
}
