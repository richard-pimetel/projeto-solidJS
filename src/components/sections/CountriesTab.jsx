import { createSignal, onMount, Show } from 'solid-js'
import { getAllCountries } from '../../services/sportsApi'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

function CountriesTab() {
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal(null)
  const [countries, setCountries] = createSignal([])
  const [searchTerm, setSearchTerm] = createSignal('')

  const loadCountries = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getAllCountries()
      setCountries(data.countries || [])
    } catch (err) {
      setError('Erro ao carregar os países. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCountries = () => {
    if (!searchTerm()) return countries()
    return countries().filter(country =>
      country.name_en.toLowerCase().includes(searchTerm().toLowerCase())
    )
  }

  onMount(() => {
    loadCountries()
  })

  return (
    <div class="tab-content fade-in">
      <div class="section-header">
        <h2>🌍 Todos os Países</h2>
        <p>Explore todos os países disponíveis no banco de dados</p>
      </div>

      <Show when={!loading() && countries().length > 0}>
        <div class="search-form">
          <div class="form-group">
            <label class="form-label">🔍 Filtrar países</label>
            <input
              type="text"
              class="form-input"
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do país..."
            />
          </div>
        </div>
      </Show>

      <Show when={loading()}>
        <LoadingSpinner message="Carregando países..." />
      </Show>

      <Show when={error()}>
        <ErrorMessage message={error()} onRetry={loadCountries} />
      </Show>

      <Show when={!loading() && !error() && countries().length > 0}>
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-number">{filteredCountries().length}</span>
            <span class="stat-label">
              {searchTerm() ? 'Países Filtrados' : 'Países Disponíveis'}
            </span>
          </div>
        </div>

        <div class="cards-grid">
          {filteredCountries().map(country => (
            <div key={country.name_en} class="card">
              <h3>{country.name_en}</h3>
              {country.name_pt && <p><strong>Nome em PT:</strong> {country.name_pt}</p>}
              {country.name_es && <p><strong>Nome em ES:</strong> {country.name_es}</p>}
              {country.name_fr && <p><strong>Nome em FR:</strong> {country.name_fr}</p>}
              {country.name_de && <p><strong>Nome em DE:</strong> {country.name_de}</p>}
              <div class="card-meta">
                <span class="badge primary">País</span>
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Show when={!loading() && !error() && filteredCountries().length === 0 && searchTerm()}>
        <div class="empty-state">
          <h3>Nenhum país encontrado</h3>
          <p>Tente um termo de busca diferente.</p>
        </div>
      </Show>
    </div>
  )
}

export default CountriesTab