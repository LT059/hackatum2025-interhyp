"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MapPin, Home, Wallet, Calendar } from "lucide-react"

export default function OnboardingGuide() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem("hasSeenGuide")
    if (!hasSeenGuide) {
      // Small delay to let the app load
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("hasSeenGuide", "true")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-slate-900 border border-blue-500/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-blue-900/50 flex justify-between items-center bg-blue-950/20">
              <h2 className="text-xl font-bold text-white">Welcome to HomeQuest! 🚀</h2>
              <button onClick={handleClose} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid gap-8">
              <p className="text-slate-300 text-lg leading-relaxed">
                Your journey to real estate mogul starts here. Navigate the market, build your capital, and find your
                dream home.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">The Timeline</h3>
                    <p className="text-sm text-slate-400">
                      Move forward by growing your capital. Each step brings you closer to new opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Home className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Properties</h3>
                    <p className="text-sm text-slate-400">
                      Browse listing cards. Use filters to find the best deals for your budget.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                    <Wallet className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Manage Finances</h3>
                    <p className="text-sm text-slate-400">Track your savings, income, and expenses in the HUD above.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Life Events</h3>
                    <p className="text-sm text-slate-400">
                      Trigger life events to simulate real-world financial challenges.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold tracking-wide transition-colors shadow-lg shadow-blue-900/20"
              >
                Let's Start!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
