import { createSignal, onMount, Show } from 'solid-js'
import { getAllLeagues } from '../../services/sportsApi'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

function LeaguesTab() {
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal(null)
  const [leagues, setLeagues] = createSignal([])

  const loadLeagues = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAllLeagues()
      setLeagues(data.leagues || [])
    } catch (err) {
      setError('Erro ao carregar as ligas. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    loadLeagues()
  })

  return (
    <div class="tab-content fade-in">
      <div class="section-header">
        <h2>🏆 Todas as Ligas</h2>
        <p>Explore todas as ligas disponíveis no banco de dados</p>
      </div>

      <Show when={loading()}>
        <LoadingSpinner message="Carregando ligas..." />
      </Show>

      <Show when={error()}>
        <ErrorMessage message={error()} onRetry={loadLeagues} />
      </Show>

      <Show when={!loading() && !error() && leagues().length > 0}>
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-number">{leagues().length}</span>
            <span class="stat-label">Ligas Disponíveis</span>
          </div>
        </div>

        <div class="cards-grid">
          {leagues().map(league => (
            <div key={league.idLeague} class="card">
              <h3>{league.strLeague}</h3>
              <p><strong>Esporte:</strong> {league.strSport}</p>
              {league.strLeagueAlternate && (
                <p><strong>Nome Alternativo:</strong> {league.strLeagueAlternate}</p>
              )}
              <div class="card-meta">
                <span class="badge primary">{league.strSport}</span>
              </div>
            </div>
          ))}
        </div>
      </Show>
    </div>
  )
}

export default LeaguesTab