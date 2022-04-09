import React from 'react'
import './index.css'
import Social from '../../assets/social.svg'
import Telegram from '../../assets/telegram.svg'
import { contractAddress } from '../../Constants'

const Footer = () => {
    return (
        <div className='footer'>
            <div className="footer-links">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '12px',
                    color: 'white'
                }}>
                    <span>© 2021</span>
                    <span><b>BNB FARMING</b></span>
                </div>
                <a href={`https://testnet.bscscan.com/address/${contractAddress}`} target="_blank" className="btn-gradient">Smart Contract</a>
                <div className="btns-more">
                    <a className='outlined'>Audit</a>
                    <a className='outlined full-radius round'><img alt="telegram" src={Telegram} /></a>
                </div>
            </div>
            <img alt="social" src={Social} style={{ maxWidth: '80%' }} />
        </div>
    )
}

export default Footer