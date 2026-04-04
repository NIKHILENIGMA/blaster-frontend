import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

interface ValidationErrorsProps {
    errors: string[]
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
    if (errors.length === 0) return null

    return (
        <Alert className="bg-red-200 border-red-600">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
                <ul className="space-y-1">
                    {errors.map((error, idx) => (
                        <li
                            key={idx}
                            className="text-sm">
                            • {error}
                        </li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    )
}
