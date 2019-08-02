pragma solidity ^0.5.0;

import "./Budget.sol";

contract BudgetCreator{
    event NewContract(address indexed _budget_id);
    event withdrawal(address sender, uint amount);

    //address public withdrawer; //basically owner of an instance of this contract

    mapping(uint => Budget) public budgets;
    uint public contract_count;

    function add_contract(string memory _name,
                          uint _amount,
                          string memory _description,
                          string memory _creation,
                          string memory _deadline,
                          address _receiver
                          ) public {
        budgets[contract_count] = new Budget(_name, _amount, _description, _creation, _deadline, _receiver);
        emit NewContract(address(budgets[contract_count]));
        contract_count++;
        //withdrawer = msg.sender;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function deposit(uint amount) public payable {
        require(msg.value == amount, "unequal amounts");
    }

    function withdraw(address payable sender, uint amount) public {
        require(amount <= address(this).balance, "request is too large");
        sender.transfer(amount);
    }

    function() external payable { }
}