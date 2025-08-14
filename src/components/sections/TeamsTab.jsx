import { createSignal, Show } from 'solid-js'
import { searchTeams } from '../../services/sportsApi'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

function TeamsTab() {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal(null)
  const [teams, setTeams] = createSignal([])
  const [sport, setSport] = createSignal('Soccer')
  const [country, setCountry] = createSignal('England')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!sport().trim() || !country().trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await searchTeams(sport(), country())
      setTeams(data.teams || [])
      if (!data.teams || data.teams.length === 0) {
        setError('Nenhum time encontrado para essa combinação.')
      }
    } catch (err) {
      setError('Erro ao buscar times. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="tab-content fade-in">
      <div class="search-form">
        <h2>🛡️ Buscar Times</h2>
        <form onSubmit={handleSearch}>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Esporte</label>
              <input
                type="text"
                class="form-input"
                value={sport()}
                onInput={(e) => setSport(e.target.value)}
                placeholder="Soccer, Basketball, etc."
              />
            </div>
            <div class="form-group">
              <label class="form-label">País</label>
              <input
                type="text"
                class="form-input"
                value={country()}
                onInput={(e) => setCountry(e.target.value)}
                placeholder="England, Brazil, etc."
              />
            </div>
            <button type="submit" class="form-button" disabled={loading()}>
              {loading() ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      <Show when={loading()}>
        <LoadingSpinner message="Buscando times..." />
      </Show>

      <Show when={error()}>
        <ErrorMessage message={error()} onRetry={handleSearch} />
      </Show>

      <Show when={!loading() && !error() && teams().length > 0}>
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-number">{teams().length}</span>
            <span class="stat-label">Times Encontrados</span>
          </div>
        </div>

        <div class="cards-grid">
          {teams().map(team => (
            <div key={team.idTeam} class="card">
              <h3>{team.strTeam}</h3>
              <p><strong>Liga:</strong> {team.strLeague}</p>
              <p><strong>Esporte:</strong> {team.strSport}</p>
              <p><strong>País:</strong> {team.strCountry}</p>
              {team.intFormedYear && <p><strong>Fundado:</strong> {team.intFormedYear}</p>}
              {team.strStadium && <p><strong>Estádio:</strong> {team.strStadium}</p>}
              {team.strDescriptionPT && (
                <p class="description"><strong>Descrição:</strong> {team.strDescriptionPT.substring(0, 150)}...</p>
              )}
              <div class="card-meta">
                <span class="badge primary">{team.strSport}</span>
                {team.strLeague && <span class="badge">{team.strLeague}</span>}
                {team.strCountry && <span class="badge warning">{team.strCountry}</span>}
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Show when={!loading() && !error() && teams().length === 0 && sport() && country()}>
        <div class="empty-state">
          <h3>Nenhum time encontrado</h3>
          <p>Tente uma combinação diferente de esporte e país.</p>
        </div>
      </Show>
    </div>
  )
}

export default TeamsTab