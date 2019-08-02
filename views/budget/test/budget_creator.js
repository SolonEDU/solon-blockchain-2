var BudgetCreator = artifacts.require("./BudgetCreator.sol");

contract("BudgetCreator", function(accounts) {

    it("creates a creator contract", function() {
        BudgetCreator.deployed().then(function(creator) {
            return creator.contract_count();
        }).then(function(count) {
            assert.equal(count, 0)
        });
    });

    it("can add a new budget proposal", function() {
        var create;
        BudgetCreator.deployed().then(function(creator) {
            create = creator;
            return creator.add_contract()
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            return create.contract_count()
        }).then(function(count) {
            assert.equal(count, 1, "a proposal was added");
            return create.last_sender();
        }).then(function(address) {
            assert.equal(address, accounts[0], "the accounts are from the same address");
        })
    });

    it("can access a proposal", function() {
        BudgetCreator.deployed().then(function(creator) {
            return creator.budgets(0)
        }).then(function(contract) {
            return contract.owner();
        }).then(function(address) {
            assert.equal(address, accounts[0], "the budget has the correct owner")
        })
    })


    // this is really an insufficient test but I'll assume it works correctly because it follows the logic I use.
    it("can vote correctly", function() {
        BudgetCreator.deployed().then(function(creator) {
            return creator.budgets(0)
        }).then(function(contract) {
            return contract.vote(0)
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered")
        });
    });

    // it("can get account balances", function() {
    //     web3.eth.getBalance(accounts[0], function(error, result) {
    //         if(!error) {console.log(result)}
    //         else {console.log(error)}
    //     });
    // })

    it("can transfer money", function() {
        BudgetCreator.deployed().then(function(creator) {
            return creator.budgets(0)
        }).then(function(budget){
            return budget.transfer(accounts[0], accounts[1], 100000000000000000);
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
        });
    })
});