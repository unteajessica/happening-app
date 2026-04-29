import logo from '../assets/Logo_v3.svg'

type LogoProps = {
    width?: number
}

function Logo({width = 460} : LogoProps) {
    return (
        <img
            src={logo}
            alt="Happening logo"
            className='logo-image'
            style={{ width: `${width}px`, height: 'auto'}}
        />
    )
}

export default Logo