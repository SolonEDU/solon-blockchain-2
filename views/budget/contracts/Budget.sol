pragma solidity ^0.5.0;

contract Budget{

    event votedEvent(uint indexed _option_id);

    struct Data {
        string name;
        uint amount;
        string description;
        string creation;
        string deadline;
        bool has_sent;
        address receiver;
    }

    struct Option{
        uint id;
        string name;
        uint vote_count;
    }

    mapping(uint => Option) public options;
    mapping(address => bool) public voters;
    mapping(uint => Data) public data;
    uint public option_count;

    constructor(string memory _name,
                uint _amount,
                string memory _description,
                string memory _creation,
                string memory _deadline,
                address _receiver) public {
        add_option("Yes");
        add_option("No");
        data[0] = Data(_name, _amount, _description, _creation, _deadline, false, _receiver);
    }

    function sent_yet() public { data[0].has_sent = true; }

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

}
