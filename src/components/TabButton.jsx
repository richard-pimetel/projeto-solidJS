function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      class={`tab-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <span class="tab-icon">{icon}</span>
      <span class="tab-label">{label}</span>
    </button>
  )
}

export default TabButton