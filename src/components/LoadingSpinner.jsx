function LoadingSpinner({ size = 'medium', message = 'Carregando...' }) {
  return (
    <div class="loading-container">
      <div class={`loading-spinner ${size}`}></div>
      <p class="loading-message">{message}</p>
    </div>
  )
}

export default LoadingSpinner