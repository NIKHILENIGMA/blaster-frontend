import { ChevronDown, Play, Users, Target, Trophy, Zap, Award } from 'lucide-react'
import { motion, useScroll, AnimatePresence } from 'motion/react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import PublicRoute from '@/components/shared/public-route'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function Home() {
    const { scrollY } = useScroll()
    const [isNavbarShrunk, setIsNavbarShrunk] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            setIsNavbarShrunk(scrollY.get() > 50)
        }

        const unsubscribe = scrollY.on('change', handleScroll)
        return () => unsubscribe()
    }, [scrollY])

    return (
        <PublicRoute>
            <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
                {/* Header/Navbar */}
                <motion.header
                    className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
                    animate={{
                        height: isNavbarShrunk ? 60 : 80,
                        backgroundColor: isNavbarShrunk ? 'rgba(15, 23, 42, 0.8)' : 'rgba(15, 23, 42, 0.5)'
                    }}
                    transition={{ duration: 0.3 }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <img
                                src="https://res.cloudinary.com/dynbvnhcc/image/upload/v1775299513/logo-fortune_qda5xe.png"
                                alt="logo"
                                className={'h-20 w-20 object-cover'}
                            />
                        </motion.div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {["Men's Teams", "Women's Teams", 'Events'].map((item) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    className="text-sm text-slate-300 hover:text-white transition-colors"
                                    whileHover={{ y: -2 }}>
                                    {item}
                                </motion.a>
                            ))}
                        </nav>

                        {/* CTA and Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/auth/signup')}
                                className="hidden sm:block px-4 sm:px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-green-400/50 transition-shadow">
                                Sign Up
                            </motion.button>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden text-white"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
                                <div className="px-4 py-4 space-y-4">
                                    {["Men's Teams", "Women's Teams", 'Events'].map((item) => (
                                        <motion.a
                                            key={item}
                                            href="#"
                                            className="block text-slate-300 hover:text-white transition-colors"
                                            whileHover={{ x: 4 }}>
                                            {item}
                                        </motion.a>
                                    ))}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/auth/signup')}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-slate-950 font-bold rounded-lg">
                                        Sign Up
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.header>

                {/* Hero Section */}
                <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-slate-950 to-slate-950" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Build Your Squad. Win Big.
                                </h1>
                                <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
                                    Experience the ultimate fantasy sports league. Select real players, earn points based on actual performance, and
                                    compete with millions of fans worldwide. Build your dream team and dominate the competition.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 sm:px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-slate-950 font-bold rounded-lg hover:shadow-lg hover:shadow-green-400/50 transition-shadow">
                                        Create Team
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 sm:px-8 py-3 border-2 border-blue-400 text-blue-400 font-bold rounded-lg hover:bg-blue-400/10 transition-colors">
                                        View Matches
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Right Side - Animated Cards */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative h-64 sm:h-80 lg:h-96">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute top-0 left-4 w-40 sm:w-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-400/30 rounded-lg p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm text-slate-300 mb-2">Top Player</div>
                                    <div className="text-lg sm:text-xl font-bold text-green-400 mb-3">Elite Squad</div>
                                    <div className="text-xs text-slate-400">Players Selected: 11</div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                    className="absolute bottom-0 right-4 w-40 sm:w-48 bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md border border-green-400/30 rounded-lg p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm text-slate-300 mb-2">This Week</div>
                                    <div className="text-lg sm:text-xl font-bold text-blue-400 mb-3">2,450 pts</div>
                                    <div className="text-xs text-slate-400">Rank: #12</div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mt-16 sm:mt-20">
                        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                    </motion.div>
                </section>

                {/* Trailer Section */}
                <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="relative">
                            <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg sm:rounded-2xl overflow-hidden aspect-video border border-slate-700/50">
                                <img
                                    src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=675&fit=crop"
                                    alt="Fantasy Sports"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-green-400/90 hover:bg-green-400 text-slate-950 rounded-full p-3 sm:p-4 transition-colors">
                                        <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* What is This League Section */}
                <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-900">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            What is DJBlaster?
                        </motion.h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[
                                {
                                    icon: Users,
                                    title: 'Fantasy Gameplay',
                                    description: 'Pick real players from upcoming matches and score points based on their actual performance.'
                                },
                                {
                                    icon: Target,
                                    title: 'Points System',
                                    description: 'Every goal, assist, and clean sheet counts. Watch your squad gain points in real-time.'
                                },
                                {
                                    icon: Trophy,
                                    title: 'Real Match Integration',
                                    description: 'Compete directly against live match data from official leagues and tournaments worldwide.'
                                }
                            ].map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -8 }}
                                    className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg sm:rounded-xl p-6 sm:p-8 hover:border-green-400/50 transition-all">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                        <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{card.title}</h3>
                                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{card.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How to Play Section */}
                <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950">
                    <div className="max-w-7xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            How to Play
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {[
                                {
                                    number: '01',
                                    title: 'Select Match',
                                    description: 'Choose from upcoming matches and tournaments across all major leagues.'
                                },
                                {
                                    number: '02',
                                    title: 'Build Your Team',
                                    description: 'Pick 11 players within your budget and create the perfect squad strategy.'
                                },
                                {
                                    number: '03',
                                    title: 'Earn Points',
                                    description: 'Gain points based on real player performance in live matches.'
                                },
                                {
                                    number: '04',
                                    title: 'Win Rewards',
                                    description: 'Climb the leaderboard and claim exclusive prizes and badges.'
                                }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex gap-4 sm:gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400/20 to-blue-400/20 border border-green-400/50">
                                            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                                {step.number}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-1 sm:pt-2">
                                        <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}>
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full">
                                {[
                                    {
                                        question: 'How does the scoring system work?',
                                        answer: 'Points are awarded based on real player performance: Goals (5 pts), Assists (3 pts), Clean Sheets (1 pt), and more. Check your league settings for specific scoring rules.'
                                    },
                                    {
                                        question: 'Can I edit my team after the match starts?',
                                        answer: 'No, once the match begins, your team is locked. However, you can make transfers before the deadline in future gameweeks.'
                                    },
                                    {
                                        question: 'When are points updated?',
                                        answer: 'Points update in real-time during live matches. Final points are confirmed within 24 hours of match completion.'
                                    },
                                    {
                                        question: 'Is there a budget limit for building a team?',
                                        answer: 'Yes, you have a budget of 100 credits to build your 11-player squad. Balance star players with undervalued gems.'
                                    },
                                    {
                                        question: 'How often can I check my league standings?',
                                        answer: 'League standings update live during matches and are finalized after each gameweek. Check anytime from your dashboard.'
                                    }
                                ].map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}>
                                        <AccordionTrigger className="text-left text-sm sm:text-base hover:text-green-400 transition-colors">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm sm:text-base text-slate-300">{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </div>
                </section>

                {/* Footer Section */}
                <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="text-center mb-12 sm:mb-16">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                                DJBlaster
                            </h2>
                            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
                                The ultimate fantasy sports experience. Build, compete, and win with millions of fans worldwide.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16 text-center">
                            {[
                                { icon: Trophy, label: 'Compete' },
                                { icon: Zap, label: 'Score' },
                                { icon: Award, label: 'Rewards' },
                                { icon: Users, label: 'Community' }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    className="flex flex-col items-center gap-2">
                                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                                    <span className="text-xs sm:text-sm text-slate-300">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8 sm:mb-12 text-center sm:text-left text-sm text-slate-400">
                            <a
                                href="#"
                                className="hover:text-white transition-colors">
                                About
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors">
                                Contact
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors">
                                Privacy
                            </a>
                            <a
                                href="#"
                                className="hover:text-white transition-colors">
                                Terms
                            </a>
                        </div>

                        <div className="border-t border-slate-800 pt-8 text-center text-xs sm:text-sm text-slate-500">
                            <p>© 2024 DJBlaster. All rights reserved.</p>
                        </div>
                    </div>
                </section>
            </div>
        </PublicRoute>
    )
}
