import './Backdrop.css'

interface BackdropProps {
  show: boolean
  clicked: () => void
}

const Backdrop = ({ show, clicked }: BackdropProps) => {
  return show ? <div className="backdrop" onClick={clicked}></div> : null
}

export default Backdrop
