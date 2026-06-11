import { Routes, Route, NavLink } from 'react-router-dom'
import PicksPage from './pages/PicksPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import RulesPage from './pages/RulesPage.jsx'
import StatsPage from './pages/StatsPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-wc-border bg-wc-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h1 className="text-xl font-bold text-wc-gold leading-tight">World Cup Pool</h1>
              <p className="text-xs text-gray-400">2026 Edition</p>
            </div>
          </div>
          <nav className="flex gap-1">
            {[
              { to: '/', label: 'Picks' },
              { to: '/leaderboard', label: 'Leaderboard' },
              { to: '/results', label: 'Results' },
              { to: '/rules', label: 'Rules' },
              { to: '/stats', label: 'Stats' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-wc-gold text-black'
                      : 'text-gray-400 hover:text-white hover:bg-wc-border'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Venmo banner */}
      <div className="bg-[#008CFF]/10 border-b border-[#008CFF]/30 text-center py-2 px-4">
        <p className="text-sm text-[#008CFF] font-medium">
          💸 Entry fee: Venmo <span className="font-bold text-white">@jmclean23</span>
        </p>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Routes>
          <Route path="/" element={<PicksPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>

      <footer className="border-t border-wc-border text-center py-4 text-xs text-gray-500">
        World Cup Pool 2026 · Built with ❤️
      </footer>
    </div>
  )
}
