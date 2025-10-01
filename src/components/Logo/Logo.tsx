import './Logo.css'

interface LogoProps {
  height?: string
}

const Logo = ({ height }: LogoProps) => {
  return (
    <div className="logo" style={{ height: height }}>
      <p>MyBurger</p>
    </div>
  )
}

export default Logo
