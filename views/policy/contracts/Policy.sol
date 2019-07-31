pragma solidity ^0.5.0;

contract Policy {

    event votedEvent(uint indexed _option_id);

    struct Option{
        uint id;
        string name;
        uint vote_count;
    }

    struct Data{
        string name;
        string description;
        string creation;
        string deadline;
    }

    mapping(uint => Option) public options;
    mapping(uint => Data) public data;
    mapping(address => bool) public voters;
    uint public option_count;


    constructor(string memory _name, string memory _description, string memory _creation, string memory _deadline) public {
        add_option("Yes");
        add_option("No");
        data[0] = Data(_name,_description,_creation,_deadline);
    }

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
