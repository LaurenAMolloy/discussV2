//This is a client component because we are using a hook
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@nextui-org/react'

interface FormButtonProps {
    //children can be any React node
    children: React.ReactNode;
}

export default function FormButton({children}: FormButtonProps){
    //This property is used to track the form status
    const { pending } = useFormStatus();

    return (
    <Button 
    type="submit" 
    isLoading={pending}
    isDisabled={pending}>
        {pending ? 'Submitting...' : children}
    </Button>
    );
}