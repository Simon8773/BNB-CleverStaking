import React from 'react'
import { Button } from "react-bootstrap";

const ConnectButton = ({ connect, accounts }) => {
    return (
        <Button onClick={connect} className="outlined">
            {accounts[0] ?
                `${accounts[0].slice(0, 6)}...${accounts[0].slice(
                    accounts[0].length - 4,
                    accounts[0].length
                )}` : 'Connect'}
        </Button>
    )
}

export default ConnectButton;