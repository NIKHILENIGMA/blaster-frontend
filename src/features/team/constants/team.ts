export type TeamName = 'KKR' | 'CSK' | 'MI' | 'RCB' | 'SRH' | 'RR' | 'DC' | 'PBKS' | 'LSG' | 'GT'

export interface TeamInfo {
    name: string
    teamLogoUrl: string
    bgCover: string
    shadowColor: string
    btnGradient: string
}

export const teams: Record<TeamName, TeamInfo> = {
    KKR: {
        name: 'Kolkata Knight Riders',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673261/4_qblr7c.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/kkr-avatar-background_y9cbjm_ohdd33.png',
        shadowColor: 'shadow-purple-500/50',
        btnGradient: 'from-purple-600 to-purple-900'
    },
    CSK: {
        name: 'Chennai Super Kings',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673252/6_myzao7.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/csk-avatar-background_ixbt3c_dperzm.png',
        shadowColor: 'shadow-yellow-500/50',
        btnGradient: 'from-yellow-400 to-yellow-600'
    },
    MI: {
        name: 'Mumbai Indians',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673251/7_ustppa.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/mi-avatar-background_ju32bi.png',
        shadowColor: 'shadow-blue-500/50',
        btnGradient: 'from-blue-600 to-blue-900'
    },
    RCB: {
        name: 'Royal Challengers Bangalore',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673254/2_eluazn.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777556200/rcb-avatar-background_izmszs_ql7ztj.png',
        shadowColor: 'shadow-red-500/50',
        btnGradient: 'from-red-600 to-red-900'
    },
    SRH: {
        name: 'Sunrisers Hyderabad',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673256/9_ra5rsq.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/srk-avatar-background_q8qobf.png',
        shadowColor: 'shadow-orange-500/50',
        btnGradient: 'from-orange-600 to-orange-900'
    },
    RR: {
        name: 'Rajasthan Royals',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673256/1_jxdhvm.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636499/rr-avatar-background_uzfdsi_nstzcs.png',
        shadowColor: 'shadow-pink-500/50',
        btnGradient: 'from-pink-600 to-pink-900'
    },
    DC: {
        name: 'Delhi Capitals',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673253/3_ut57yn.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/dc-avatar-background_e0y6uf_ubcdcw.png',
        shadowColor: 'shadow-blue-500/50',
        btnGradient: 'from-blue-600 to-blue-900'
    },
    PBKS: {
        name: 'Punjab Kings',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673255/10_lntkaf.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/pbks-avatar-background_o7z7je_skk1cx.png',
        shadowColor: 'shadow-red-500/50',
        btnGradient: 'from-red-600 to-red-900'
    },
    LSG: {
        name: 'Lucknow Super Giants',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673252/5_bzzt5u.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/lsg-avatar-background_nvnjnb_i3qzvf.png',
        shadowColor: 'shadow-green-500/50',
        btnGradient: 'from-green-600 to-green-900'
    },
    GT: {
        name: 'Gujarat Titans',
        teamLogoUrl: 'https://res.cloudinary.com/djblasters/image/upload/v1778673250/8_swbnvw.png',
        bgCover: 'https://res.cloudinary.com/djblasters/image/upload/v1777636498/gt-avatar-background_hqtbcl.png',
        shadowColor: 'shadow-green-500/50',
        btnGradient: 'from-green-600 to-green-900'
    }
}
