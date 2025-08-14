import { createSignal, Show } from 'solid-js'
import { searchEvents } from '../../services/sportsApi'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

function EventsTab() {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal(null)
  const [events, setEvents] = createSignal([])
  const [searchQuery, setSearchQuery] = createSignal('Arsenal_vs_Chelsea')
  const [season, setSeason] = createSignal('2023-2024')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery().trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await searchEvents(searchQuery(), season())
      setEvents(data.event || [])
      if (!data.event || data.event.length === 0) {
        setError('Nenhum evento encontrado para essa busca.')
      }
    } catch (err) {
      setError('Erro ao buscar eventos. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="tab-content fade-in">
      <div class="search-form">
        <h2>🔍 Buscar Eventos</h2>
        <form onSubmit={handleSearch}>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Busca (ex: Arsenal_vs_Chelsea)</label>
              <input
                type="text"
                class="form-input"
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o nome dos times..."
              />
            </div>
            <div class="form-group">
              <label class="form-label">Temporada</label>
              <input
                type="text"
                class="form-input"
                value={season()}
                onInput={(e) => setSeason(e.target.value)}
                placeholder="2023-2024"
              />
            </div>
            <button type="submit" class="form-button" disabled={loading()}>
              {loading() ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      <Show when={loading()}>
        <LoadingSpinner message="Buscando eventos..." />
      </Show>

      <Show when={error()}>
        <ErrorMessage message={error()} onRetry={handleSearch} />
      </Show>

      <Show when={!loading() && !error() && events().length > 0}>
        <div class="cards-grid">
          {events().map(event => (
            <div key={event.idEvent} class="card">
              <h3>{event.strEvent}</h3>
              <p><strong>Data:</strong> {event.dateEvent} às {event.strTime}</p>
              <p><strong>Liga:</strong> {event.strLeague}</p>
              <p><strong>Temporada:</strong> {event.strSeason}</p>
              <p><strong>Local:</strong> {event.strVenue}</p>
              <div class="card-meta">
                <span class="badge primary">{event.strSport}</span>
                {event.strStatus && <span class="badge">{event.strStatus}</span>}
                {event.intHomeScore && event.intAwayScore && (
                  <span class="badge success">
                    {event.intHomeScore} - {event.intAwayScore}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Show when={!loading() && !error() && events().length === 0 && searchQuery()}>
        <div class="empty-state">
          <h3>Nenhum evento encontrado</h3>
          <p>Tente uma busca diferente ou verifique a temporada.</p>
        </div>
      </Show>
    </div>
  )
}

export default EventsTab