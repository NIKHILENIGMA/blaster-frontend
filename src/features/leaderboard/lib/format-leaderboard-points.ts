const compactPointsFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
})

const fullPointsFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
})

export const formatLeaderboardPoints = (points: number) => compactPointsFormatter.format(points)

export const formatFullLeaderboardPoints = (points: number) => fullPointsFormatter.format(points)
