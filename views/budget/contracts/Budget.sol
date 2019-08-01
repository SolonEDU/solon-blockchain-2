pragma solidity ^0.5.0;

import "./ERC20.sol";

contract Budget is ERC20 {

    //address public owner;
    struct Data {
        string name;
        uint amount;
        string description;
        string creation;
        string deadline;
        address sender;
        address receiver;
    }

    constructor(string memory _name,
                uint _amount,
                string memory _description,
                string memory _creation,
                string memory _deadline,
                address _sender,
                address _receiver) public { //withdrawer --> sender
        add_option("Yes");
        add_option("No");
        data[0] = Data(_name, _amount, _description, _creation, _deadline, _sender, _receiver);
    }

    event votedEvent(uint indexed _option_id);

    struct Option{
        uint id;
        string name;
        uint vote_count;
    }

    mapping(uint => Option) public options;
    mapping(address => bool) public voters;
    mapping(uint => Data) public data;
    uint public option_count;

    // modifier isWithdrawer() {
    //     require(msg.sender == withdrawer, "stop it get some help"); //owner is basically the withdrawer
    //     _;
    // }

    function add_option(string memory _name) private {
        options[option_count] = Option(option_count, _name, 0);
        option_count++;
    }

    function vote(uint _option_id) public {
        require(!voters[msg.sender], "user already voted");
        require(_option_id >= 0 && _option_id < option_count, "invalid option");
        voters[msg.sender] = true;
        options[_option_id].vote_count++;
        emit votedEvent(_option_id);
    }

    // function withdraw(uint amt) public isWithdrawer {
    //     address payable sender;
    //     sender = 0x46cd19a25Bf0878bB702AB6cAbA837522f59adeA;
    //     sender.transfer(amt);
    // }
}
