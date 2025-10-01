import './Modal.css'
import Backdrop from '../Backdrop/Backdrop'

interface ModalProps {
  show: boolean
  modalClosed: () => void
  children: React.ReactNode
}

const Modal = ({ show, modalClosed, children }: ModalProps) => {
  return (
    <>
      <Backdrop show={show} clicked={modalClosed} />
      <div 
        className="modal"
        style={{
          transform: show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: show ? '1' : '0'
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Modal
