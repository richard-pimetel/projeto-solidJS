function ErrorMessage({ message, onRetry }) {
  return (
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Ops! Algo deu errado</h3>
      <p class="error-message">{message}</p>
      {onRetry && (
        <button class="error-button" onClick={onRetry}>
          Tentar Novamente
        </button>
      )}
    </div>
  )
}

export default ErrorMessage