
export function teamNameGenerator(iplTeam: string): string[] {
    switch (iplTeam) {
        case 'KKR': return ['Kolkata']
        case 'CSK': return ['Chennai']
        case 'MI': return ['Mumbai']
        case 'RCB': return ['Bengaluru']
        case 'SRH': return ['Sunrisers']
        case 'RR': return ['Rajasthan']
        case 'DC': return ['Delhi']
        case 'PBKS': return ['Punjab']
        case 'LSG': return ['Lucknow']
        case 'GT': return ['Gujarat']
        default: return ['Mumbai']
    }
}