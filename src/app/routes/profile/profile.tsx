import { useClerk, useUser } from '@clerk/clerk-react'
import { ArrowLeft, Camera, CheckCircle2, Eye, EyeOff, KeyRound, LogOut, Mail, Pencil, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Loader } from '@/components'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useChangeUsername, useGetProfile, useSyncProfile, useUpdateFranchise } from '@/features/profile/api/profile'
import { LOGO_OPTIONS } from '@/shared/lib/team-logos'

type ExternalAccount = {
    provider?: string
    strategy?: string
    identificationId?: string
}

const Profile: FC = () => {
    const { user, isLoaded, isSignedIn } = useUser()
    const { signOut } = useClerk()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: profile, isPending: isProfilePending } = useGetProfile({
        queryConfig: {
            enabled: Boolean(isSignedIn)
        }
    })
    const { mutateAsync: syncProfile, isPending: isSyncingProfile } = useSyncProfile()
    const { mutateAsync: changeUsername, isPending: isChangingUsername } = useChangeUsername()
    const { mutateAsync: updateFranchise, isPending: isUpdatingFranchise } = useUpdateFranchise()

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [teamName, setTeamName] = useState<string>('')
    const [teamLogo, setTeamLogo] = useState<string>(LOGO_OPTIONS[0])
    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [signOutOtherSessions, setSignOutOtherSessions] = useState<boolean>(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false)
    const [isEditingAccount, setIsEditingAccount] = useState<boolean>(false)
    const [isEditingFranchise, setIsEditingFranchise] = useState<boolean>(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

    useEffect(() => {
        if (!user && !profile) return

        setFirstName(profile?.user.firstName || user?.firstName || '')
        setLastName(profile?.user.lastName || user?.lastName || '')
        setUsername(profile?.user.username || '')
        setTeamName(profile?.franchise?.teamName || '')
        setTeamLogo(profile?.franchise?.teamLogo || LOGO_OPTIONS[0])
    }, [profile, user])

    const email = user?.primaryEmailAddress?.emailAddress || profile?.user.email || user?.emailAddresses[0]?.emailAddress || 'N/A'
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || user?.fullName || 'Player'
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim() || fullName.charAt(0)

    const accountAccess = useMemo(() => {
        const externalAccounts = ((user?.externalAccounts || []) as ExternalAccount[]) ?? []
        const hasGoogle = externalAccounts.some((account) => {
            const provider = `${account.provider || account.strategy || account.identificationId || ''}`.toLowerCase()
            return provider.includes('google')
        })
        const passwordEnabled = Boolean((user as unknown as { passwordEnabled?: boolean })?.passwordEnabled)

        return {
            hasGoogle,
            passwordEnabled,
            passwordActionLabel: passwordEnabled ? 'Change Password' : 'Set Password',
            methodLabel: hasGoogle ? 'Google account connected' : 'Email account'
        }
    }, [user])

    if (!isLoaded || isProfilePending) {
        return <Loader />
    }

    if (!isSignedIn || !user) {
        return <div>Please sign in to view your profile.</div>
    }

    const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!firstName.trim() || !lastName.trim()) {
            toast.error('First name and last name are required')
            return
        }

        try {
            await user.update({
                firstName: firstName.trim(),
                lastName: lastName.trim()
            })
            await syncProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim()
            })
            await user.reload()
            toast.success('Profile updated successfully')
            setIsEditingAccount(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        }
    }

    const handleUsernameSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (username.trim().length < 3) {
            toast.error('Username must be at least 3 characters long')
            return
        }

        try {
            await changeUsername({
                newUsername: username.trim()
            })
            toast.success('Username updated successfully')
            setIsEditingAccount(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update username')
        }
    }

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setIsUploadingAvatar(true)
            await user.setProfileImage({ file })
            await user.reload()
            await syncProfile({ profileImage: user.imageUrl })
            toast.success('Profile picture updated successfully')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile picture')
        } finally {
            setIsUploadingAvatar(false)
            event.target.value = ''
        }
    }

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            setIsUpdatingPassword(true)
            await user.updatePassword({
                currentPassword: currentPassword || undefined,
                newPassword,
                signOutOfOtherSessions: signOutOtherSessions
            })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setSignOutOtherSessions(false)
            setShowCurrentPassword(false)
            setShowNewPassword(false)
            setShowConfirmPassword(false)
            toast.success('Password updated successfully')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update password')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    const handleFranchiseSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!profile?.franchise) {
            toast.error('Create a franchise before editing team details')
            return
        }

        if (teamName.trim().length < 3) {
            toast.error('Team name must be at least 3 characters long')
            return
        }

        try {
            await updateFranchise({
                teamName: teamName.trim(),
                teamLogo
            })
            toast.success('Franchise updated successfully')
            setIsEditingFranchise(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update franchise')
        }
    }

    const renderPasswordToggle = (isVisible: boolean, onToggle: () => void, label: string) => {
        const Icon = isVisible ? EyeOff : Eye

        return (
            <button
                type="button"
                aria-label={label}
                onClick={onToggle}
                className="absolute inset-y-0 right-2 flex items-center gap-1 rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
                <Icon className="h-4 w-4" />
                <span>{isVisible ? 'Hide' : 'Show'}</span>
            </button>
        )
    }

    return (
        <div className="min-h-screen w-full bg-neutral-background px-4 py-6 pb-28 lg:pb-8">
            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <Button
                    variant="outline"
                    className="w-fit gap-2"
                    onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>

                <header className="space-y-1">
                    <p className="text-xs font-bold uppercase text-primary">Account Center</p>
                    <h1 className="font-heading text-3xl font-bold text-foreground">Manage Profile</h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        Update your player identity, account access, password, and franchise details from one place.
                    </p>
                </header>

                <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20 border-4 border-primary/15">
                                    <AvatarImage src={user.imageUrl || profile?.user.profileImage || undefined} />
                                    <AvatarFallback className="text-xl font-bold">{initials.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button
                                    type="button"
                                    size="icon"
                                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                                    disabled={isUploadingAvatar}
                                    onClick={() => fileInputRef.current?.click()}>
                                    <Camera className="h-4 w-4" />
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="truncate font-heading text-2xl font-bold">{fullName}</h1>
                                <p className="truncate text-sm text-muted-foreground">{email}</p>
                                <p className="mt-1 text-sm font-semibold text-primary">@{profile?.user.username || username}</p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => signOut(() => navigate('/'))}>
                            <LogOut className="h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between gap-3">
                                <CardTitle className="flex items-center gap-2">
                                    <UserRound className="h-5 w-5 text-primary" />
                                    Account Details
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant={isEditingAccount ? 'secondary' : 'outline'}
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setIsEditingAccount((current) => !current)}>
                                    <Pencil className="h-4 w-4" />
                                    {isEditingAccount ? 'Cancel' : 'Edit'}
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditingAccount ? (
                                    <>
                                        <form
                                            onSubmit={handleProfileSubmit}
                                            className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={firstName}
                                                    onChange={(event) => setFirstName(event.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={lastName}
                                                    onChange={(event) => setLastName(event.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2 sm:col-span-2">
                                                <Label htmlFor="email">Registered Email</Label>
                                                <Input
                                                    id="email"
                                                    value={email}
                                                    readOnly
                                                    disabled
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Email changes are not enabled from this page right now.
                                                </p>
                                            </div>
                                            <Button
                                                type="submit"
                                                className="sm:w-fit"
                                                disabled={isSyncingProfile}>
                                                {isSyncingProfile ? 'Saving...' : 'Save Name'}
                                            </Button>
                                        </form>

                                        <form
                                            onSubmit={handleUsernameSubmit}
                                            className="space-y-3 border-t border-border pt-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="username">Game Username</Label>
                                                <Input
                                                    id="username"
                                                    value={username}
                                                    onChange={(event) => setUsername(event.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    This username is used inside the game and leaderboard.
                                                </p>
                                            </div>
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                disabled={isChangingUsername}>
                                                {isChangingUsername ? 'Saving...' : 'Save Username'}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">Full Name</p>
                                            <p className="mt-1 font-semibold">{fullName}</p>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background px-4 py-3">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">Game Username</p>
                                            <p className="mt-1 font-semibold text-primary">@{profile?.user.username || username}</p>
                                        </div>
                                        <div className="rounded-xl border border-border bg-background px-4 py-3 sm:col-span-2">
                                            <p className="text-xs font-semibold uppercase text-muted-foreground">Registered Email</p>
                                            <p className="mt-1 break-all font-semibold">{email}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <KeyRound className="h-5 w-5 text-primary" />
                                    {accountAccess.passwordActionLabel}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="space-y-4">
                                    {accountAccess.passwordActionLabel === 'Change Password' ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? 'text' : 'password'}
                                                    value={currentPassword}
                                                    onChange={(event) => setCurrentPassword(event.target.value)}
                                                    className="pr-20"
                                                />
                                                {renderPasswordToggle(showCurrentPassword, () => setShowCurrentPassword((current) => !current), 'Toggle current password visibility')}
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(event) => setNewPassword(event.target.value)}
                                                    className="pr-20"
                                                />
                                                {renderPasswordToggle(showNewPassword, () => setShowNewPassword((current) => !current), 'Toggle new password visibility')}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                                    className="pr-20"
                                                />
                                                {renderPasswordToggle(showConfirmPassword, () => setShowConfirmPassword((current) => !current), 'Toggle confirm password visibility')}
                                            </div>
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Checkbox
                                            checked={signOutOtherSessions}
                                            onCheckedChange={(checked) => setSignOutOtherSessions(checked === true)}
                                        />
                                        Sign out other sessions after password update
                                    </label>
                                    <Button
                                        type="submit"
                                        disabled={isUpdatingPassword}>
                                        {isUpdatingPassword ? 'Updating...' : accountAccess.passwordActionLabel}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Account Access
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Sign-in Method</p>
                                    <p className="mt-1 font-semibold flex gap-2 items-center">
                                        <FcGoogle className="h-5 w-5" /> {accountAccess.methodLabel}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-border bg-background px-4 py-3">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
                                    <p className="mt-1 flex items-center gap-2 break-all font-semibold">
                                        <Mail className="h-4 w-4 shrink-0 text-primary" />
                                        {email}
                                    </p>
                                </div>
                                {accountAccess.hasGoogle ? (
                                    <p className="flex items-center gap-2 text-sm font-medium text-green-700">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Google account connected
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">This account was created with email and password.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between gap-3">
                                <CardTitle>Franchise Identity</CardTitle>
                                {profile?.franchise ? (
                                    <Button
                                        type="button"
                                        variant={isEditingFranchise ? 'secondary' : 'outline'}
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => setIsEditingFranchise((current) => !current)}>
                                        <Pencil className="h-4 w-4" />
                                        {isEditingFranchise ? 'Cancel' : 'Edit'}
                                    </Button>
                                ) : null}
                            </CardHeader>
                            <CardContent>
                                {profile?.franchise && isEditingFranchise ? (
                                    <form
                                        onSubmit={handleFranchiseSubmit}
                                        className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="teamName">Team Name</Label>
                                            <Input
                                                id="teamName"
                                                value={teamName}
                                                onChange={(event) => setTeamName(event.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Select Team Logo</Label>
                                            <div className="grid grid-cols-4 gap-3">
                                                {LOGO_OPTIONS.map((logo) => (
                                                    <button
                                                        key={logo}
                                                        type="button"
                                                        onClick={() => setTeamLogo(logo)}
                                                        className={`rounded-xl border p-2 transition ${
                                                            teamLogo === logo
                                                                ? 'border-primary ring-2 ring-primary/20'
                                                                : 'border-border grayscale hover:grayscale-0'
                                                        }`}>
                                                        <img
                                                            src={logo}
                                                            alt="Team logo option"
                                                            className="w-full rounded-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isUpdatingFranchise}>
                                            {isUpdatingFranchise ? 'Saving...' : 'Save Franchise'}
                                        </Button>
                                    </form>
                                ) : profile?.franchise ? (
                                    <div className="flex flex-col items-center rounded-xl border border-border bg-background px-4 py-6 text-center">
                                        <img
                                            src={profile.franchise.teamLogo}
                                            alt={profile.franchise.teamName}
                                            className="h-24 w-24 rounded-full border border-border bg-white object-cover p-2 shadow-sm"
                                        />
                                        <p className="mt-4 text-xs font-semibold uppercase text-muted-foreground">Team Name</p>
                                        <h2 className="mt-1 font-heading text-xl font-bold">{profile.franchise.teamName}</h2>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                                        Create a franchise first to edit your team name and logo.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile
