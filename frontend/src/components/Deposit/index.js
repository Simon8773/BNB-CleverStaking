import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import Web3 from 'web3'
import { _upline } from '../../Constants'
import './index.css'
import Moment from 'react-moment';

const Deposit = ({ contract, accounts, web3, setOpen, refLink }) => {
    const [period, setPeriod] = useState(18);
    const [value, setValue] = useState(1);
    const [tarifs, setTarifs] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [accountBalance, setAccountBalance] = useState(0);

    const tarifsPlan = {
        "10": "130",
        "11": "141",
        "12": "152",
        "13": "163",
        "14": "173",
        "15": "183",
        "16": "193",
        "17": "203",
        "18": "212",
        "19": "221",
        "20": "230",
        "21": "238",
        "22": "246",
        "23": "254",
        "24": "261",
        "25": "268",
        "26": "275",
        "27": "282",
        "28": "288",
        "29": "294",
        "30": "300"
    };

    useEffect(() => {
        (async () => {
            console.log(tarifsPlan[period]);
            setTarifs(tarifsPlan[period]);

            if(accounts[0]) {
                console.log("account", accounts[0]);

                getUserInfo();
                getAccontBalance();
            }
        })()
        return () => {
            console.log('done')
        }
    }, [contract, period])



    const getUserInfo = async () => {
        const userInfo = await contract.methods.userInfo(accounts[0]).call();
        for (let i = 0; i < userInfo['deposits'].length; i++) {
            const element = userInfo['deposits'][i];
            console.log(element);
    
            const temp_tarif = await contract.methods.tarifs(element.tarif).call();
            userInfo['deposits'][i].percent = temp_tarif.percent;
        }
        console.log('userinfo', userInfo);
        setUserInfo(userInfo);
    }

    const getAccontBalance = async () => {
        const dada = await web3.eth.getBalance(accounts[0]);
        setAccountBalance(parseFloat(dada / (10 ** 18)).toFixed(2));
    }

    const deposit = async () => {
        console.log('accounts', accounts)
        if (accounts[0]) {
            setLoading(true);
            try {
                // console.log(period, _upline);
                console.log('refLink', refLink);
                if(!refLink) {
                    refLink = _upline;
                }

                contract.methods.deposit(period, refLink)
                .send({
                    from: accounts[0],
                    value: Web3.utils.toWei(value.toString(), 'ether')
                }).then( async (receipt) => {
                    // const event = receipt.events;
                    // const transfer = event.Transfer;
                    // console.log('success', receipt);
                    getUserInfo();
                    setLoading(false)
                    alert("Your deposit successfully was finished.");

                }).catch((err) => {
                    setLoading(false)
                    alert("Something Wrong, Try again!");
                    console.log(err);
                });

            } catch (error) {
                console.log('error', error)
                setLoading(false);
            }
        } else {
            alert('Please connect your wallet')
        }
    }

    const setMax = async () => {
        if (accounts[0]) {
            let max = await web3.eth.getBalance(accounts[0])
            max = Web3.utils.fromWei(max.toString(), 'ether');
            setValue(parseFloat(max).toFixed(2));
        } else {
            alert('Please connect your wallet')
        }
    }

    return (
        <div id="deposit">
            <div style={{ textAlign: 'center' }}>
                <h2 className="deposit-header">CALCULATE PROFIT</h2>
            </div>
            <Row>
                <div className="period">
                    <h6 className="label">Choose your plan:</h6>
                    <RangeSlider
                        value={period}
                        max={30}
                        min={10}
                        onChange={changeEvent => setPeriod(changeEvent.target.value)}
                        variant="info"
                        tooltip='on'
                        tooltipPlacement='top'
                    />

                    <div className="range">
                        <span>10</span>
                        <span>30</span>
                    </div>
                </div>
            </Row>

            <Row className='text-light'>
                <Col md="5" sm="12">
                    <div className="bg-div mx-1 my-2">
                        <p>Daily ROI: <b>{(tarifs / period).toFixed(2)}%</b></p>
                        <p>Total Profit: <b>{tarifs}%</b></p>
                        <p>Locked: No</p>
                        <h4>Your earning: <b className="pink-text">{(tarifs / 100 * value).toFixed(2)} BNB</b></h4>
                    </div>
                </Col>
                <Col md="7" sm="12">
                    <div className='bg-div mx-1 my-2'>
                        <p className="label">Current Wallet Balance: <b><span>{ accountBalance }</span> BNB</b><span> <small>(Minimum: 0.05BNB)</small></span></p>
                        <div className="amount-input">
                            <input type="number" className="input" value={value} onChange={(e) => setValue(e.target.value)} />
                            <span className="pink-text" style={{ cursor: 'pointer' }} onClick={setMax}>Max</span>
                        </div>
                        
                        <div style={{ textAlign: 'center', "marginTop": "30px" }}>
                            <span className={`pm-btn ${!accounts[0] && 'disable'}`} onClick={deposit}>{loading ? 'Investing...' : 'Invest'}</span>
                        </div>
                    </div>
                </Col>
            </Row>
            { 
                accounts[0] ? (
                    <>
                        <Row>
                            <Col className='bg-div mx-3 my-2 text-light text-center'>
                                <h3 className='text-left'>Deposit History</h3>
                                <Row className='my-2'>
                                    <Col>Plan Day</Col>
                                    <Col>Deposit Amount</Col>
                                    <Col>Deposit Date</Col>
                                    <Col>End Date</Col>
                                    <Col>Your Earning</Col>
                                </Row>
                                {userInfo['deposits'] &&
                                    userInfo['deposits'].map((item, index) => {
                                    return (
                                        <>
                                            <Row>
                                                <Col>{item.tarif}</Col>
                                                <Col>{Web3.utils.fromWei(item.amount.toString(), 'ether') } BNB</Col>
                                                <Col><Moment unix format="YYYY.MM.DD HH.mm.ss">{item.time}</Moment></Col>
                                                <Col><Moment unix format="YYYY.MM.DD HH.mm.ss">{parseInt(item.time) + parseInt(item.tarif * 86400)}</Moment></Col> 
                                                <Col>{(Web3.utils.fromWei(item.amount.toString(), 'ether') * item.percent / 100).toFixed(4)} BNB</Col>
                                            </Row>
                                        </>
                                    );
                                })}
                            </Col>
                        </Row>
                    </>
                ) : '' 
            }
        </div>
    )
}

export default Deposit