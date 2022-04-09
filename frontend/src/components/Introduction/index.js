import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import './index.css'

const Introduction = ({ contract }) => {
    const [invested, setInvested] = useState(0)
    const [bonus, setBonus] = useState(0)
    const [withdrawn, setWithdrawn] = useState(0)

    useEffect(() => {
        (async () => {
            if (contract) {
                let invested = await contract.methods.invested().call()
                let withdrawn = await contract.methods.withdrawn().call()
                let bonus = await contract.methods.match_bonus().call()
                setInvested(invested)
                setBonus(bonus)
                setWithdrawn(withdrawn)
                contract.events.NewDeposit({}).on('data', async function (event) {
                    console.log(event.returnValues);
                    let invested = await contract.methods.invested().call()
                    let bonus = await contract.methods.match_bonus().call()
                    setInvested(invested)
                    setBonus(bonus)
                })
                    .on('error', console.error)
            }

        })()
        return () => {
            console.log('done')
        }
    }, [contract])

    return (
        <div style={{ background: 'linear-gradient(40deg,#4c249f,#1c3857 50%,#650380)' }} id="home">
            <div className="introduction">
                <div className="text-container">
                    <h1 className="main-title">
                        Stable & Profitable
                        Yield Farming Dapp on
                        <span>&nbsp;Binance Smart Chain</span>
                    </h1>
                    <p className="sub-title-main">
                        Up to <span>20% Daily ROI</span>
                        {/* <br /><span>5 Levels</span> of Referral Rewards */}
                    </p>
                    <a href="#deposit" className="btn-gradient" style={{ margin: 'unset' }}>Deposit</a>
                </div>
                <div className="right-screen">
                    <div className="block-result">
                        <p className="result" id="totalCurrencyInvested">{Web3.utils.fromWei((invested || '').toString(), 'ether')}</p>
                        <div className="sub-text-result">
                            <span>Total</span>
                            <span className="pink-text">&nbsp;BNB</span>
                            <br />
                            <span className="bold-text">Invested</span>
                        </div>
                    </div>
                    <div className="block-result">
                        <p className="result" id="totalCurrencyInvested">{Web3.utils.fromWei((withdrawn || '').toString(), 'ether')}</p>
                        <div className="sub-text-result">
                            <span>Total</span>
                            <span className="pink-text">&nbsp;BNB</span>
                            <br />
                            <span className="bold-text">Withdrawn</span>
                        </div>
                    </div>
                    {/* <div className="block-result">
                        <p className="result" id="totalReferralReward">{Web3.utils.fromWei((bonus || "").toString(), 'ether')}</p>
                        <div className="sub-text-result">
                            <span>Total Referral</span>
                            <br />
                            <span className="pink-text">BNB</span>
                            <span className="bold-text">&nbsp;Reward</span>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Introduction