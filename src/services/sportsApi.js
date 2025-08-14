const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

// Função auxiliar para fazer requisições
const fetchData = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro na requisição:', error)
    throw error
  }
}

// Buscar eventos por times e temporada
export const searchEvents = async (eventQuery, season = '') => {
  let url = `${BASE_URL}/searchevents.php?e=${encodeURIComponent(eventQuery)}`
  if (season) {
    url += `&s=${encodeURIComponent(season)}`
  }
  return await fetchData(url)
}

// Buscar todas as ligas
export const getAllLeagues = async () => {
  return await fetchData(`${BASE_URL}/all_leagues.php`)
}

// Buscar jogadores por nome
export const searchPlayers = async (playerName) => {
  const url = `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(playerName)}`
  return await fetchData(url)
}

// Buscar times por esporte e país
export const searchTeams = async (sport, country) => {
  const url = `${BASE_URL}/search_all_teams.php?s=${encodeURIComponent(sport)}&c=${encodeURIComponent(country)}`
  return await fetchData(url)
}

// Buscar todos os países
export const getAllCountries = async () => {
  return await fetchData(`${BASE_URL}/all_countries.php`)
}