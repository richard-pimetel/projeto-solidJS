import { createSignal, Show } from 'solid-js'
import { searchPlayers } from '../../services/sportsApi'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

function PlayersTab() {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal(null)
  const [players, setPlayers] = createSignal([])
  const [searchQuery, setSearchQuery] = createSignal('Messi')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery().trim()) return

    setLoading(true)
    setError(null)

    try {
      const data = await searchPlayers(searchQuery())
      setPlayers(data.player || [])
      if (!data.player || data.player.length === 0) {
        setError('Nenhum jogador encontrado para essa busca.')
      }
    } catch (err) {
      setError('Erro ao buscar jogadores. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="tab-content fade-in">
      <div class="search-form">
        <h2>👤 Buscar Jogadores</h2>
        <form onSubmit={handleSearch}>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nome do Jogador</label>
              <input
                type="text"
                class="form-input"
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite o nome do jogador..."
              />
            </div>
            <button type="submit" class="form-button" disabled={loading()}>
              {loading() ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>

      <Show when={loading()}>
        <LoadingSpinner message="Buscando jogadores..." />
      </Show>

      <Show when={error()}>
        <ErrorMessage message={error()} onRetry={handleSearch} />
      </Show>

      <Show when={!loading() && !error() && players().length > 0}>
        <div class="cards-grid">
          {players().map(player => (
            <div key={player.idPlayer} class="card">
              <h3>{player.strPlayer}</h3>
              <p><strong>Nacionalidade:</strong> {player.strNationality}</p>
              <p><strong>Time:</strong> {player.strTeam}</p>
              <p><strong>Posição:</strong> {player.strPosition}</p>
              <p><strong>Nascimento:</strong> {player.dateBorn}</p>
              {player.strHeight && <p><strong>Altura:</strong> {player.strHeight}</p>}
              {player.strWeight && <p><strong>Peso:</strong> {player.strWeight}</p>}
              {player.strDescriptionPT && (
                <p class="description"><strong>Descrição:</strong> {player.strDescriptionPT.substring(0, 150)}...</p>
              )}
              <div class="card-meta">
                <span class="badge primary">{player.strSport}</span>
                {player.strPosition && <span class="badge">{player.strPosition}</span>}
                {player.strNationality && <span class="badge warning">{player.strNationality}</span>}
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Show when={!loading() && !error() && players().length === 0 && searchQuery()}>
        <div class="empty-state">
          <h3>Nenhum jogador encontrado</h3>
          <p>Tente uma busca diferente ou verifique a ortografia.</p>
        </div>
      </Show>
    </div>
  )
}

export default PlayersTab