import { Copy, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCreateRuleset, useDeleteRuleset, useRulesets, useUpdateRuleset } from '@/features/admin/api/rulesets'
import type { Ruleset, RulesetConfig, RulesetScope } from '@/features/admin/types/rulesets'

const defaultConfig: RulesetConfig = {
    totalPlayers: 12,
    roles: {
        batsman: { min: 5 },
        bowler: { min: 4 },
        wicketKeeper: { min: 1 },
        allRounder: { min: 1 }
    },
    overseas: { max: 4 },
    multipliers: {
        captain: 4,
        viceCaptain: 3,
        impactPlayer: 2.5,
        overseas: 1.5
    },
    scoring: {
        batsman: {
            runs: 1,
            fours: 5,
            sixes: 8,
            strikeRate: [
                { min: 270, points: 15 },
                { min: 240, points: 10 },
                { min: 200, points: 8 },
                { min: 180, points: 6 },
                { min: 120, points: 3 },
                { min: 100, points: 1 }
            ],
            mileStones: [
                { runs: 30, points: 20 },
                { runs: 50, points: 40 },
                { runs: 100, points: 75 },
                { runs: 150, points: 100 }
            ],
            duckPenalty: { points: -10, applicableRoles: 'Batsman' }
        },
        bowler: {
            wickets: 25,
            dotBall: 10,
            overBonus: [
                { minOvers: 4, points: 60 },
                { minOvers: 3, points: 40 },
                { minOvers: 2, points: 20 }
            ],
            economyRate: [
                { max: 3, points: 15 },
                { max: 4, points: 10 },
                { max: 5, points: 5 },
                { max: 6, points: 3 },
                { max: 7, points: 1 }
            ],
            mileStones: [
                { wickets: 2, points: 40 },
                { wickets: 3, points: 60 },
                { wickets: 4, points: 90 },
                { wickets: 5, points: 140 },
                { wickets: 6, points: 200 }
            ],
            maiden: 100,
            lbwBowled: 5
        },
        fielder: {
            catch: 25,
            runOut: 40,
            stumping: 70,
            numberOfCatchesForBonus: [
                { minCatches: 3, points: 20 },
                { minCatches: 4, points: 40 },
                { minCatches: 5, points: 60 }
            ],
            numberOfRunOutsForBonus: [
                { minRunOuts: 2, points: 20 },
                { minRunOuts: 3, points: 40 }
            ],
            stumpingBonus: [
                { minStumpings: 2, points: 30 },
                { minStumpings: 3, points: 60 }
            ]
        }
    }
}

type FormState = {
    id?: string
    name: string
    scope: RulesetScope
    isActive: boolean
    config: RulesetConfig
}

type TierEditorProps<T extends { points: number }> = {
    title: string
    description?: string
    items: T[]
    thresholdKey: Exclude<keyof T, 'points'>
    thresholdLabel: string
    onChange: (items: T[]) => void
    step?: number
}

const cloneConfig = (config: RulesetConfig): RulesetConfig => JSON.parse(JSON.stringify(config)) as RulesetConfig

const normalizeConfig = (config?: RulesetConfig): RulesetConfig => {
    const incoming = config ?? defaultConfig

    return {
        ...cloneConfig(defaultConfig),
        ...incoming,
        roles: {
            ...defaultConfig.roles,
            ...incoming.roles
        },
        overseas: {
            ...defaultConfig.overseas,
            ...incoming.overseas
        },
        multipliers: {
            ...defaultConfig.multipliers,
            ...incoming.multipliers
        },
        scoring: {
            batsman: {
                ...defaultConfig.scoring?.batsman,
                ...incoming.scoring?.batsman
            },
            bowler: {
                ...defaultConfig.scoring?.bowler,
                ...incoming.scoring?.bowler
            },
            fielder: {
                ...defaultConfig.scoring?.fielder,
                ...incoming.scoring?.fielder
            }
        }
    }
}

const createEmptyForm = (): FormState => ({
    name: 'Default Scoring Rules',
    scope: 'global',
    isActive: true,
    config: cloneConfig(defaultConfig)
})

const toFormState = (ruleset: Ruleset): FormState => ({
    id: ruleset.id,
    name: ruleset.name,
    scope: ruleset.scope,
    isActive: ruleset.isActive,
    config: normalizeConfig(ruleset.config)
})

const toNumber = (value: string) => {
    if (value.trim() === '') return 0

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function NumberField({
    id,
    label,
    value,
    onChange,
    step = 1,
    min
}: {
    id: string
    label: string
    value: number | undefined
    onChange: (value: number) => void
    step?: number
    min?: number
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                min={min}
                step={step}
                value={value ?? 0}
                onChange={(event) => onChange(toNumber(event.target.value))}
            />
        </div>
    )
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4 rounded-lg border border-border bg-background p-4">
            <h3 className="text-base font-semibold">{title}</h3>
            {children}
        </section>
    )
}

function TierEditor<T extends { points: number }>({
    title,
    description,
    items,
    thresholdKey,
    thresholdLabel,
    onChange,
    step = 1
}: TierEditorProps<T>) {
    const updateRow = (index: number, field: keyof T, value: number) => {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? ({ ...item, [field]: value } as T) : item)))
    }

    const addRow = () => {
        onChange([...items, { [thresholdKey]: 0, points: 0 } as T])
    }

    return (
        <div className="space-y-3 rounded-md border border-border bg-muted/20 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h4 className="text-sm font-semibold">{title}</h4>
                    {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRow}>
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            <div className="space-y-2">
                {items.map((item, index) => (
                    <div
                        key={`${String(thresholdKey)}-${index}`}
                        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <NumberField
                            id={`${title}-${String(thresholdKey)}-${index}`}
                            label={thresholdLabel}
                            value={Number(item[thresholdKey])}
                            step={step}
                            min={0}
                            onChange={(value) => updateRow(index, thresholdKey, value)}
                        />
                        <NumberField
                            id={`${title}-points-${index}`}
                            label="Points"
                            value={item.points}
                            onChange={(value) => updateRow(index, 'points', value)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="self-end text-destructive hover:text-destructive"
                            onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                            aria-label={`Remove ${title} row`}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {items.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">No tiers configured.</div>
                ) : null}
            </div>
        </div>
    )
}

export default function RulesetsPage() {
    const { data: rulesets = [], isLoading } = useRulesets()
    const createRuleset = useCreateRuleset()
    const updateRuleset = useUpdateRuleset()
    const deleteRuleset = useDeleteRuleset()
    const [form, setForm] = useState<FormState>(createEmptyForm)

    const activeRuleset = useMemo(() => rulesets.find((ruleset) => ruleset.isActive), [rulesets])
    const isSaving = createRuleset.isPending || updateRuleset.isPending
    const batting = form.config.scoring?.batsman ?? defaultConfig.scoring?.batsman
    const bowling = form.config.scoring?.bowler ?? defaultConfig.scoring?.bowler
    const fielding = form.config.scoring?.fielder ?? defaultConfig.scoring?.fielder

    const updateConfig = (updater: (config: RulesetConfig) => void) => {
        setForm((current) => {
            const nextConfig = normalizeConfig(current.config)
            updater(nextConfig)

            return { ...current, config: nextConfig }
        })
    }

    const handleSubmit = async () => {
        const payload = {
            name: form.name.trim(),
            scope: form.scope,
            isActive: form.isActive,
            config: normalizeConfig(form.config)
        }

        try {
            if (form.id) {
                await updateRuleset.mutateAsync({ rulesetId: form.id, data: payload })
                toast.success('Ruleset updated')
            } else {
                await createRuleset.mutateAsync(payload)
                toast.success('Ruleset created')
            }
            setForm(createEmptyForm())
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to save ruleset')
        }
    }

    const handleDelete = async (rulesetId: string) => {
        if (!window.confirm('Delete this ruleset? This cannot be undone.')) return

        try {
            await deleteRuleset.mutateAsync(rulesetId)
            toast.success('Ruleset deleted')
            if (form.id === rulesetId) setForm(createEmptyForm())
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete ruleset')
        }
    }

    const handleActiveChange = async (rulesetId: string, isActive: boolean) => {
        try {
            await updateRuleset.mutateAsync({ rulesetId, data: { isActive } })
            toast.success(isActive ? 'Ruleset activated' : 'Ruleset deactivated')
            if (form.id === rulesetId) {
                setForm((current) => ({ ...current, isActive }))
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update ruleset status')
        }
    }

    const handleFormActiveChange = async (isActive: boolean) => {
        setForm((current) => ({ ...current, isActive }))

        if (!form.id) return

        await handleActiveChange(form.id, isActive)
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Rulesets</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        Create and manage the scoring engine config used before processing fixtures.
                    </p>
                </div>
                <Button onClick={() => setForm(createEmptyForm())}>
                    <Plus className="h-4 w-4" />
                    New Ruleset
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <Card>
                    <CardContent className="space-y-4 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Saved Rulesets</h2>
                                <p className="text-sm text-muted-foreground">Active: {activeRuleset?.name ?? 'None'}</p>
                            </div>
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : null}
                        </div>

                        <div className="space-y-3">
                            {rulesets.map((ruleset) => (
                                <div
                                    key={ruleset.id}
                                    className="rounded-lg border border-border bg-background p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate font-semibold">{ruleset.name}</h3>
                                                {ruleset.isActive ? (
                                                    <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-700">
                                                        Active
                                                    </span>
                                                ) : null}
                                                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                                                    {ruleset.scope}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Updated {new Date(ruleset.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Switch
                                                checked={ruleset.isActive}
                                                disabled={updateRuleset.isPending}
                                                onCheckedChange={(checked) => handleActiveChange(ruleset.id, checked)}
                                                aria-label={`${ruleset.isActive ? 'Deactivate' : 'Activate'} ${ruleset.name}`}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setForm(toFormState(ruleset))}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setForm({
                                                        ...toFormState(ruleset),
                                                        id: undefined,
                                                        name: `${ruleset.name} Copy`
                                                    })
                                                }>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(ruleset.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!isLoading && rulesets.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                                    No rulesets yet. Create one to control scoring.
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-5 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{form.id ? 'Edit Ruleset' : 'Create Ruleset'}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Edit the rules using normal form fields. The app converts this into the scoring config automatically.
                                </p>
                            </div>
                            {form.id ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setForm(createEmptyForm())}>
                                    <X className="h-4 w-4" />
                                    Clear
                                </Button>
                            ) : null}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ruleset-name">Name</Label>
                                <Input
                                    id="ruleset-name"
                                    value={form.name}
                                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Scope</Label>
                                <Select
                                    value={form.scope}
                                    onValueChange={(value: RulesetScope) => setForm((current) => ({ ...current, scope: value }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="global">Global</SelectItem>
                                        <SelectItem value="cycle">Cycle</SelectItem>
                                        <SelectItem value="fixture">Fixture</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                            <div>
                                <Label htmlFor="ruleset-active">Use for scoring</Label>
                                <p className="text-xs text-muted-foreground">
                                    Turning this on will make this ruleset the only active scoring config.
                                </p>
                            </div>
                            <Switch
                                id="ruleset-active"
                                checked={form.isActive}
                                disabled={updateRuleset.isPending}
                                onCheckedChange={handleFormActiveChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <EditorSection title="Team Rules">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <NumberField
                                        id="total-players"
                                        label="Total players"
                                        value={form.config.totalPlayers}
                                        min={1}
                                        onChange={(value) => updateConfig((config) => void (config.totalPlayers = value))}
                                    />
                                    <NumberField
                                        id="batsman-min"
                                        label="Minimum batsmen"
                                        value={form.config.roles.batsman.min}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.roles.batsman.min = value))}
                                    />
                                    <NumberField
                                        id="bowler-min"
                                        label="Minimum bowlers"
                                        value={form.config.roles.bowler.min}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.roles.bowler.min = value))}
                                    />
                                    <NumberField
                                        id="keeper-min"
                                        label="Minimum wicket keepers"
                                        value={form.config.roles.wicketKeeper.min}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.roles.wicketKeeper.min = value))}
                                    />
                                    <NumberField
                                        id="all-rounder-min"
                                        label="Minimum all rounders"
                                        value={form.config.roles.allRounder.min}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.roles.allRounder.min = value))}
                                    />
                                    <NumberField
                                        id="overseas-max"
                                        label="Maximum overseas players"
                                        value={form.config.overseas.max}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.overseas.max = value))}
                                    />
                                </div>
                            </EditorSection>

                            <EditorSection title="Multipliers">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <NumberField
                                        id="captain-multiplier"
                                        label="Captain"
                                        value={form.config.multipliers.captain}
                                        step={0.1}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.multipliers.captain = value))}
                                    />
                                    <NumberField
                                        id="vice-captain-multiplier"
                                        label="Vice captain"
                                        value={form.config.multipliers.viceCaptain}
                                        step={0.1}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.multipliers.viceCaptain = value))}
                                    />
                                    <NumberField
                                        id="impact-player-multiplier"
                                        label="Impact player"
                                        value={form.config.multipliers.impactPlayer}
                                        step={0.1}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.multipliers.impactPlayer = value))}
                                    />
                                    <NumberField
                                        id="overseas-multiplier"
                                        label="Overseas player"
                                        value={form.config.multipliers.overseas}
                                        step={0.1}
                                        min={0}
                                        onChange={(value) => updateConfig((config) => void (config.multipliers.overseas = value))}
                                    />
                                </div>
                            </EditorSection>

                            <EditorSection title="Batting Points">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <NumberField
                                        id="batting-runs"
                                        label="Per run"
                                        value={batting?.runs}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.batsman!.runs = value))}
                                    />
                                    <NumberField
                                        id="batting-fours"
                                        label="Per four"
                                        value={batting?.fours}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.batsman!.fours = value))}
                                    />
                                    <NumberField
                                        id="batting-sixes"
                                        label="Per six"
                                        value={batting?.sixes}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.batsman!.sixes = value))}
                                    />
                                    <NumberField
                                        id="duck-penalty"
                                        label="Duck penalty"
                                        value={batting?.duckPenalty?.points}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.batsman!.duckPenalty!.points = value))}
                                    />
                                </div>

                                <TierEditor
                                    title="Strike Rate Bonus"
                                    description="Award points when strike rate is at least this value."
                                    items={batting?.strikeRate ?? []}
                                    thresholdKey="min"
                                    thresholdLabel="Minimum strike rate"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.batsman!.strikeRate = items))}
                                />
                                <TierEditor
                                    title="Batting Milestones"
                                    description="Award points when runs reach this value."
                                    items={batting?.mileStones ?? []}
                                    thresholdKey="runs"
                                    thresholdLabel="Runs"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.batsman!.mileStones = items))}
                                />
                            </EditorSection>

                            <EditorSection title="Bowling Points">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <NumberField
                                        id="bowling-wickets"
                                        label="Per wicket"
                                        value={bowling?.wickets}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.bowler!.wickets = value))}
                                    />
                                    <NumberField
                                        id="bowling-dot-ball"
                                        label="Per dot ball"
                                        value={bowling?.dotBall}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.bowler!.dotBall = value))}
                                    />
                                    <NumberField
                                        id="bowling-maiden"
                                        label="Per maiden"
                                        value={bowling?.maiden}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.bowler!.maiden = value))}
                                    />
                                    <NumberField
                                        id="bowling-lbw-bowled"
                                        label="LBW/Bowled bonus"
                                        value={bowling?.lbwBowled}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.bowler!.lbwBowled = value))}
                                    />
                                </div>

                                <TierEditor
                                    title="Over Bonus"
                                    description="Award points when a bowler bowls at least this many overs."
                                    items={bowling?.overBonus ?? []}
                                    thresholdKey="minOvers"
                                    thresholdLabel="Minimum overs"
                                    step={0.1}
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.bowler!.overBonus = items))}
                                />
                                <TierEditor
                                    title="Economy Rate Bonus"
                                    description="Award points when economy rate is at or below this value."
                                    items={bowling?.economyRate ?? []}
                                    thresholdKey="max"
                                    thresholdLabel="Maximum economy"
                                    step={0.1}
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.bowler!.economyRate = items))}
                                />
                                <TierEditor
                                    title="Wicket Milestones"
                                    description="Award points when wicket count reaches this value."
                                    items={bowling?.mileStones ?? []}
                                    thresholdKey="wickets"
                                    thresholdLabel="Wickets"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.bowler!.mileStones = items))}
                                />
                            </EditorSection>

                            <EditorSection title="Fielding Points">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <NumberField
                                        id="fielding-catch"
                                        label="Per catch"
                                        value={fielding?.catch}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.fielder!.catch = value))}
                                    />
                                    <NumberField
                                        id="fielding-run-out"
                                        label="Per run out"
                                        value={fielding?.runOut}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.fielder!.runOut = value))}
                                    />
                                    <NumberField
                                        id="fielding-stumping"
                                        label="Per stumping"
                                        value={fielding?.stumping}
                                        onChange={(value) => updateConfig((config) => void (config.scoring!.fielder!.stumping = value))}
                                    />
                                </div>

                                <TierEditor
                                    title="Catch Bonus"
                                    description="Award points when catch count reaches this value."
                                    items={fielding?.numberOfCatchesForBonus ?? []}
                                    thresholdKey="minCatches"
                                    thresholdLabel="Minimum catches"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.fielder!.numberOfCatchesForBonus = items))}
                                />
                                <TierEditor
                                    title="Run Out Bonus"
                                    description="Award points when run out count reaches this value."
                                    items={fielding?.numberOfRunOutsForBonus ?? []}
                                    thresholdKey="minRunOuts"
                                    thresholdLabel="Minimum run outs"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.fielder!.numberOfRunOutsForBonus = items))}
                                />
                                <TierEditor
                                    title="Stumping Bonus"
                                    description="Award points when stumping count reaches this value."
                                    items={fielding?.stumpingBonus ?? []}
                                    thresholdKey="minStumpings"
                                    thresholdLabel="Minimum stumpings"
                                    onChange={(items) => updateConfig((config) => void (config.scoring!.fielder!.stumpingBonus = items))}
                                />
                            </EditorSection>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSaving || !form.name.trim()}
                            className="w-full sm:w-auto">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {form.id ? 'Update Ruleset' : 'Create Ruleset'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
