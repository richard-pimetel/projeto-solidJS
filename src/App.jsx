import { createSignal } from 'solid-js'
import TabButton from './components/TabButton'
import EventsTab from './components/sections/EventsTab'
import LeaguesTab from './components/sections/LeaguesTab'
import PlayersTab from './components/sections/PlayersTab'
import TeamsTab from './components/sections/TeamsTab'
import CountriesTab from './components/sections/CountriesTab'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = createSignal('events')

  const tabs = [
    { id: 'events', label: 'Eventos', icon: '⚽' },
    { id: 'leagues', label: 'Ligas', icon: '🏆' },
    { id: 'players', label: 'Jogadores', icon: '👤' },
    { id: 'teams', label: 'Times', icon: '🛡️' },
    { id: 'countries', label: 'Países', icon: '🌍' }
  ]

  const renderActiveTab = () => {
    switch (activeTab()) {
      case 'events': return <EventsTab />
      case 'leagues': return <LeaguesTab />
      case 'players': return <PlayersTab />
      case 'teams': return <TeamsTab />
      case 'countries': return <CountriesTab />
      default: return <EventsTab />
    }
  }

  return (
    <div class="app">
      <header class="header">
        <div class="container">
          <h1 class="title">
            <span class="title-icon">🏟️</span>
            Sports Dashboard
          </h1>
          <p class="subtitle">Explore o mundo dos esportes</p>
        </div>
      </header>

      <nav class="nav">
        <div class="container">
          <div class="tab-buttons">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={activeTab() === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </div>
        </div>
      </nav>

      <main class="main">
        <div class="container">
          <div class="content">
            {renderActiveTab()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App