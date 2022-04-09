import React, { useState } from 'react'
import ConnectButton from '../ConnectButton';
import TelegramSVG from '../../assets/telegram.svg'
import './index.css'

const Header = ({ connect, accounts }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="navbar">
            <div className="header">
                <h2 className="logo">BNB FARMING</h2>
                <span className="hamburgur" onClick={() => setOpen(!open)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="img" aria-labelledby="a2hgugy5t9o4a3ju5e69vlorfpt508s5" className="crayons-icon"><title id="a2hgugy5t9o4a3ju5e69vlorfpt508s5">Navigation menu</title>
                        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
                    </svg>
                </span>
                <a href="#home" className={`nav-links ${open && 'opened'}`} onClick={() => setOpen(false)}>DASHBOARD</a>
                <a href="#deposit" className={`nav-links ${open && 'opened'}`} onClick={() => setOpen(false)}>CONTRACT</a>
                <a href="#withdraw" className={`nav-links ${open && 'opened'}`} onClick={() => setOpen(false)}>AUDIT</a>
                <a href="#faq" className={`nav-links ${open && 'opened'}`} onClick={() => setOpen(false)}>ABOUT</a>
                <div className={`nav-btns ${open && 'opened'}`}>
                    <ConnectButton connect={connect} accounts={accounts} />
                </div>
            </div>
        </div>
    )
}

export default Header