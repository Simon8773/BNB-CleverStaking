import React, { useState } from 'react'

const faqs = [
    {
        question: 'How to participate in BNBFarming?',
        answer: 'BNBFarming operates on the Binance Smart Chain. In order to interact with the contract, you need to install the Metamask browser extension. An identical mobile application is also available for iPhone and Android users.'
    },
    {
        question: 'Is the smart contract verified?',
        answer: 'Yes, the smart contract is fully verified and audited by HazeCrypto. No vulnerabilities, no backdoors, and no scam scripts have been found in the smart contract. BNBFarming is safe for use in the Binance Smart Chain main network. You can check the audit by clicking the "Audit" button at the bottom of this page.'
    },
    {
        question: 'How to invest in BNBFarming?',
        answer: "Select the desired Deposit Period for your investment. Enter the amount of BNB you'd like to deposit. Click ‘Invest’. That's it."
    },
    {
        question: 'What is the difference between different Deposit Periods?',
        answer: 'The Deposit Period can vary from 5 to 30 days. Keep in mind that different Deposit Periods have different profitability between 109% and 234%. The longer your Deposit Period - the bigger the reward.'
    },
    {
        question: 'Can I make multiple deposits?',
        answer: 'Absolutely! There is no limit to the number of your deposits.'
    },
    {
        question: 'Do you have a referral program?',
        answer: 'Yes, our referral program features 5 levels of referral rewards. For the friends that you invite, you receive a % of their deposits. Check the percentages for each level on our website.'
    },
    {
        question: 'Where can I follow the latest news?',
        answer: 'Follow our social media channels where we publish all the latest updates.'
    },
]

const Faq = () => {
    const [subOpen, setSubOpen] = useState(false)

    const toggle = (idx) => {
        if (subOpen === idx) {
            setSubOpen(-1)
        } else {
            setSubOpen(idx)
        }
    }

    return (
        <div className="modal" id="faq">
            <div className="content">
                <div className="modal-header">
                    <h2 className="title-window">FAQ</h2>
                </div>
                <div className="container-list-faq">
                    <ul className="list-faq">
                        {faqs.map((faq, idx) =>
                            <li className='item-faq' onClick={() => toggle(idx)}>
                                <div className="header-item-faq">
                                    <button className={`close-faq-item ${idx === subOpen && 'active'}`}></button>
                                    <h3 className='title-faq-item'>{faq.question}</h3>
                                </div>
                                <div className={`container-info-faq ${idx === subOpen && 'active'}`}>
                                    <p>{faq.answer}</p>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Faq