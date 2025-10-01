import './BuildControl.css'

interface BuildControlProps {
  label: string
  added: () => void
  removed: () => void
  disabled: boolean
}

const BuildControl = ({ label, added, removed, disabled }: BuildControlProps) => {
  return (
    <div className="build-control">
      <div className="build-control-label">{label}</div>
      <button 
        className="build-control-less" 
        onClick={removed}
        disabled={disabled}
      >
        Less
      </button>
      <button 
        className="build-control-more" 
        onClick={added}
      >
        More
      </button>
    </div>
  )
}

export default BuildControl
