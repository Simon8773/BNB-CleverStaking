import React, { useState, useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import Web3 from 'web3'
import DataCard from '../DataCard'
import LevelCard from '../LevelCard'
import './index.css'

const Withdraw = ({ contract, accounts, setOpen }) => {

    const [userInfo, setUserInfo] = useState({})
    const [leftTime, setLeftTIme] = useState(0);
    // const [level0, setLevel0] = useState(0)
    // const [level1, setLevel1] = useState(0)
    // const [level2, setLevel2] = useState(0)
    // const [level3, setLevel3] = useState(0)
    // const [level4, setLevel4] = useState(0)
    const [loading, setLoading] = useState(false)

    const [refLink, setRefLink] = useState("You will get your ref link after investing");

    // useEffect(() => {
    //     (async () => {
    //         if (accounts[0]) {
    //             let userInfo = await contract.methods.userInfo(accounts[0]).call()
    //             console.log('changed', userInfo)
    //             setUserInfo(userInfo)
    //         }
    // })

    useEffect(() => {
        (async () => {
            console.log(contract.methods);
            if (accounts[0]) {
                
                let userInfo = await contract.methods.userInfo(accounts[0]).call()
                console.log('changed', userInfo)
                setUserInfo(userInfo);

                if(userInfo) {
                    if(userInfo.deposits.length > 0) {
                        const current_url = window.location.href;
                        console.log("current_url", current_url);
                        let domain = (new URL(current_url));
                        domain = domain.hostname + ":" + domain.port;
                        console.log(domain);
                        setRefLink(domain+"/?ref_link="+accounts[0]);
                    }

                    const currentTimestamp = await contract.methods.currentTime().call();
                    console.log('getLeftTime', 86400 - (currentTimestamp - userInfo.last_payout));
                    setLeftTIme(86400 - (currentTimestamp - userInfo.last_payout));

                    getLeftWithdrawTime(86400 - (currentTimestamp - userInfo.last_payout));
                }
            }
            // let level0 = await contract.methods.ref_bonuses(0).call()
            // let level1 = await contract.methods.ref_bonuses(1).call()
            // let level2 = await contract.methods.ref_bonuses(2).call()
            // let level3 = await contract.methods.ref_bonuses(3).call()
            // let level4 = await contract.methods.ref_bonuses(4).call()
            // setLevel0(level0)
            // setLevel1(level1)
            // setLevel2(level2)
            // setLevel3(level3)
            // setLevel4(level4)

            contract.events.NewDeposit({}).on('data', async function (event) {
                let userInfo = await contract.methods.userInfo(accounts[0]).call()
                setUserInfo(userInfo)
            })
                .on('error', console.error)

            contract.events.Withdraw({}).on('data', async function (event) {
                console.log(event.returnValues);
                if (accounts[0]) {
                    let userInfo = await contract.methods.userInfo(accounts[0]).call()
                    setUserInfo(userInfo)
                }
                setLoading(false)
                setOpen(true)
            })
                .on('error', console.error)

                
            

        })()
        return () => {
            // console.log('done')
        }
    }, [contract, accounts])

    const withdraw = async () => {
        if(leftTime > 0) {
            alert("please wait until next withdraw time.");
            return ;
        }

        if (accounts[0]) {
            setLoading(true)
            try {
                await contract.methods.withdraw().send({
                    from: accounts[0],
                })
            } catch (error) {
                setLoading(false)
            }
        } else {
            alert('Please connect your wallet')
        }
    }

    const copyRefLink = () => {
        navigator.clipboard.writeText(refLink);
    }

    const getLeftWithdrawTime = (tm) => {
        console.log(tm)
        let n = tm;
        setInterval(() => {
            if(n <= 0) {
                setLeftTIme(0);
                clearInterval();
                return ;
            }

            console.log("lefttime", n);
            setLeftTIme(n - 1);
            n --;
        }, 1000);
        
    }

    const secondsToTime = (secs) => {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }



    return (
        <>
            <div id='claim'>
                <Row>
                    <Col md="5" sm="12">
                        <div className='bg-div text-light text-center mx-1 my-2'>
                            <p className='p-0 m-0 mb-2'>Total Rewards: { accounts[0] ? parseFloat(userInfo.for_withdraw / (10 ** 18)).toFixed(10) || '0' : "0"} BNB</p>
                            <button className={`pm-btn ${(!userInfo.for_withdraw || userInfo.for_withdraw === '0') && 'disable'}`} onClick={withdraw}>{loading ? "In progress..." : "Withdraw"}</button>
                            <p className='p-0 m-0 mt-2'>Next claim in { leftTime > 86400000 ? "0.0.0" : secondsToTime(leftTime).h+"."+secondsToTime(leftTime).m+"."+secondsToTime(leftTime).s  }</p>
                        </div>
                    </Col>
                    <Col md="7" sm="12">
                        <div className='bg-div text-light text-center mx-1 my-2'>
                            <span>Your Referral Link: <b>{refLink}</b></span>
                            <span className="copy" onClick={copyRefLink}></span>

                            <p style={{"marginTop": "10px", "marginBottom": "5px"}}>Total Referral Rewards: { accounts[0] ? parseFloat(userInfo.player_match_bonus / ( 10 ** 18 )).toFixed(3) || '0' : "0"} BNB</p><br/>
                            {/* <span className={`pm-btn ${(!userInfo.for_withdraw || userInfo.for_withdraw === '0') && 'disable'}`} onClick={withdraw}>{loading ? "In progress..." : "CLAIM REWARS"}</span> */}
                        </div>
                    </Col>
                </Row>
            </div>
            {/* <div id="withdraw">
                <div style={{ textAlign: 'center' }}>
                    <h2 className="withdraw-header">DASHBOARD</h2>
                </div>
                <div className="list-dashboard">
                    <div className="withdraw-info">
                        <DataCard label="Withdrawable (Divs+Refs)" value={parseInt(userInfo.for_withdraw) || '0'} />
                        <DataCard label="Total Invested" value={parseInt(userInfo.total_invested || {}) || '0'} />
                        <DataCard label="Total Withdrawal" value={parseInt(userInfo.total_withdrawn || {}) || '0'} />
                        <DataCard label="Total Referral Reward" value={parseInt(userInfo.match_bonus || {}) || '0'} />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '-27px', position: 'relative' }}>
                        <span className={`pm-btn ${(!userInfo.for_withdraw || userInfo.for_withdraw === '0') && 'disable'}`} onClick={withdraw}>{loading ? "In progress..." : "Withdraw"}</span>
                    </div>
                    <div className="invest-link" style={{ textAlign: 'center' }}>
                        <span>Your Referral Link: <b>You will get your ref link after investing</b></span>
                        <span className="copy">
                        </span>
                    </div>
                    <div className="list-footer">
                        <LevelCard level={1} reward={level0 / 10} referrals={0} />
                        <LevelCard level={2} reward={level1 / 10} referrals={0} />
                        <LevelCard level={3} reward={level2 / 10} referrals={0} />
                        <LevelCard level={4} reward={level3 / 10} referrals={0} />
                        <LevelCard level={5} reward={level4 / 10} referrals={0} />
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default Withdraw