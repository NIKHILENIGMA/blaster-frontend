import { type FC } from 'react'

const Footer: FC = () => {
    return (
        <footer className="border-t border-slate-800 bg-slate-900 py-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-white mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Matches
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Contests
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Teams
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4">Connect</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white transition-colors">
                                    Facebook
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
                    <p>© 2026 FantasyPlay. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a
                            href="#"
                            className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
