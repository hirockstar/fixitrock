'use client'

import { useState } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'

export default function LoginModal({
    isOpen,
    onClose,
    label,
    onSubmit,
}: {
    isOpen: boolean
    onClose: () => void
    label: string
    onSubmit: (password: string) => boolean
}) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = () => {
        const success = onSubmit(password)

        if (success) {
            setPassword('')
            onClose()
        } else {
            setError('Incorrect password')
        }
    }

    return (
        <Modal hideCloseButton isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className='text-base font-semibold'>{label}</ModalHeader>
                <ModalBody>
                    <Input
                        errorMessage={error}
                        isInvalid={!!error}
                        label='Password'
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit()
                        }}
                    />
                    <Button color='primary' onPress={handleSubmit}>
                        Submit
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
