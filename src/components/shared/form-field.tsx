import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { useState, type FC } from 'react'
import { type FieldError, type UseFormRegisterReturn } from 'react-hook-form'

import { cn } from '@/shared/lib/utils'

import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface FormFieldProps {
    label: string
    name: string
    placeholder: string
    register: UseFormRegisterReturn
    errors?: FieldError
    required: boolean
    type?: string
    icon?: LucideIcon
    iconPosition?: 'left' | 'right'
    shouldReset?: boolean
}

const FormField: FC<FormFieldProps> = ({ label, name, placeholder, type = 'text', icon: Icon, iconPosition = 'left', register, errors, required }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const isPasswordField = type === 'password'
    const inputType = isPasswordField && isPasswordVisible ? 'text' : type

    return (
        <div className="flex flex-col space-y-2 relative mb-2">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-red-600">*</span>}
            </Label>
            <div>
                <div className="relative">
                    {Icon && iconPosition === 'left' && (
                        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                    <Input
                        id={name}
                        type={inputType}
                        {...register}
                        placeholder={placeholder}
                        className={cn(
                            Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3',
                            ((Icon && iconPosition === 'right') || isPasswordField) && 'pr-10',
                            errors && 'border-red-600'
                        )}
                    />
                    {isPasswordField ? (
                        <button
                            type="button"
                            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-gray-400 transition-colors hover:text-gray-600"
                            onClick={() => setIsPasswordVisible((visible) => !visible)}>
                            {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    ) : Icon && iconPosition === 'right' ? (
                        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    ) : null}
                </div>
                {errors && <span className="text-sm text-red-600">{errors?.message as string}</span>}
            </div>
        </div>
    )
}

export default FormField
