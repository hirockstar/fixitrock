type Props = {
    children?: string | React.ReactNode
}

export default function Code(props: Props) {
    return (
        <>
            {typeof props.children === 'string' ? (
                <code className='rounded p-0.5'>{props.children}</code>
            ) : (
                <code>{props.children}</code>
            )}
        </>
    )
}
