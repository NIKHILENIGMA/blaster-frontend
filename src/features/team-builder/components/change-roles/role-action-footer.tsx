import { AlertCircle } from 'lucide-react'
import { FaSpinner } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
// import { Spinner } from '@/components/ui/spinner';

interface RoleActionFooterProps {
    isLocked: boolean
    isSubmitting: boolean
    isFormValid: boolean
    submitError: string | null
    onUpdate: () => void
    onReset: () => void
}

export default function RoleActionFooter({ isLocked, isSubmitting, isFormValid, submitError, onUpdate, onReset }: RoleActionFooterProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-5">
                <div className="space-y-3">
                    {/* Error Message */}
                    {submitError && (
                        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 border border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-red-800">{submitError}</p>
                        </div>
                    )}

                    {/* Locked Message */}
                    {isLocked && (
                        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 border border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs sm:text-sm text-amber-800">Role changes are locked for this fixture</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            onClick={onReset}
                            disabled={isSubmitting || isLocked}
                            variant="outline"
                            className="flex-1 h-10 sm:h-11">
                            Reset
                        </Button>
                        <Button
                            onClick={onUpdate}
                            disabled={!isFormValid || isSubmitting || isLocked}
                            variant={'default'}
                            className="flex-1 h-10 sm:h-11">
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <FaSpinner className="h-4 w-4" />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                'Update Roles'
                            )}
                        </Button>
                    </div>

                    {/* Helper Text */}
                    {!isFormValid && !isLocked && <p className="text-xs text-slate-600 text-center">Select different captain and vice-captain</p>}

                    {!isLocked && !isSubmitting && <p className="text-xs text-slate-600 text-center">Changes save instantly</p>}
                </div>
            </div>
        </div>
    )
}
