abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "options",
    "outputs": [
      {
        "name": "id",
        "type": "uint256"
      },
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "vote_count",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "voters",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "data",
    "outputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "description",
        "type": "string"
      },
      {
        "name": "creation",
        "type": "string"
      },
      {
        "name": "deadline",
        "type": "string"
      },
      {
        "name": "has_sent",
        "type": "bool"
      },
      {
        "name": "receiver",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "option_count",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_amount",
        "type": "uint256"
      },
      {
        "name": "_description",
        "type": "string"
      },
      {
        "name": "_creation",
        "type": "string"
      },
      {
        "name": "_deadline",
        "type": "string"
      },
      {
        "name": "_receiver",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_option_id",
        "type": "uint256"
      }
    ],
    "name": "votedEvent",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "sent_yet",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_option_id",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  budgets: [],
  budget_count: 0,
  creator_address: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
        const publicaddress = document.getElementById("publicaddress").innerText.toLowerCase();
        if (account != publicaddress) {
          document.getElementById("content").className = "d-none";
          // window.alert(`Invalid public address detected. Please change your Metamask account to the one used during registration for Solon and reload the page. \nThe public address of that account should be: ${publicaddress}`);
          window.location.href = "/budget/addresserror";
        };
      }
    });
    $.getJSON("/js/BudgetCreator.json", function (budget) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.BudgetCreator = TruffleContract(budget);
      // Connect provider to interact with contract
      App.contracts.BudgetCreator.setProvider(App.web3Provider);

      App.listenForNewContract();

      return App.create_contract();
    });
  },

  create_contract: function () {
    var errors = document.querySelector('.errors');
    $("#button-click").on("click", function () {

      var name = document.querySelector('#budget_name').value;
      var amount = Number(document.querySelector('#budget_amount').value);
      var receiver_address = document.querySelector('#receiver_address').value;
      var description = document.querySelector('#budget_description').value;
      var date = new Date().toString();
      var deadline = document.querySelector('#deadline').value;

      App.contracts.BudgetCreator.deployed().then(function (instance) {
        App.creator_address = instance.address;
        web3.eth.getBalance(instance.address, function (err, balance) {
          if (err) { console.log(err); }
          else {
            if (amount * 1e18 > balance) {
              errors.innerHTML = "<div class=\"mx-2 \"><div class=\"text-center alert alert-warning\" role=\"alert\">Input amount is greater than the current balance</div></div>";
            } else { instance.add_contract(name, amount, description, date, deadline, receiver_address); }
          }
        });
      });
    });
    return App.get_data();
  },

  get_data: function () {
    var budget_creator;
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      budget_creator = instance;
      return budget_creator.contract_count();
    }).then(function (count) {
      App.budget_count = count;
      for (var i = 0; i < count; i++) {
        var receiver_address;
        budget_creator.budgets(i).then(function (address) {
          receiver_address = address;
          return web3.eth.contract(abi).at(address);
        }).then(function (budgetInstance) {
          var data = []
          data.push(receiver_address)
          budgetInstance.data(0, function (err, result) {
            if (!err) {
              for (var i = 0; i < 7; i++) { data.push(result[i]) }
              App.budgets.push(data);
            } else { console.log(err) }
          })
        });
      }
    }).then(function () {
      var x = setInterval(function () {
        if (App.budgets.length == App.budget_count) {
          App.render();
          clearInterval(x);
        }
      }, 1000);
    });
  },

  get_balance: function () {
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      App.creator_address = instance.address;
      web3.eth.getBalance(instance.address, function (err, res) {
        if (err) { console.log(err); }
        else { document.querySelector('#contract_balance').innerHTML = `Current Balance: ${res / 1e18} ETH`; }
      });
    });
  },

  render: function () {
    App.display_history();
    App.display_ongoing();
    $("#past_display").hide();
    for (var id = 0; id < App.budgets.length; id++) {
      var address = App.budgets[id][0];
      var name = App.budgets[id][1];
      var amount = App.budgets[id][2]
      var description = App.budgets[id][3];
      var receiver = App.budgets[id][7];

      var timer = "<p class=\"timer" + address + "\"> </p>";

      var header = "<div class=\"modal-header\"><h2 align = \"center\" class=\"modal-title w-100\">" + name + "</h2></div>"
      var outside = "<div class=\"p-3 mb-2 bg-light text-dark\"><h4><a href=\"#\" data-toggle=\"modal\" data-target=\"#" + "modal" + address + "\">" + name + "</a></h4>" + timer + "</div>"

      var table = "<table class=\"table\"><thead><tr><th scope=\"col\">Option</th><th scope=\"col\">Votes</th></tr></thead><tbody id=\"option_results" + address + "\"></tbody></table>"
      var button = "<button type=\"submit\" class=\"btn btn-primary\">Vote</button>"
      var form = "<form id=\"form" + address + "\" onSubmit=\"App.castVote(" + id + "); return false;\"><div class=\"form-group\"><label for=\"option_select" + address + "\">Select Option</label><select class=\"form-control\" id=\"option_select" + address + "\"></select></div>" + button + "<hr/></form>"
      var body = "<div class=\"modal-body\"><p>" + "Recipient's Address: " + receiver + "<br> Requested Amount: " + amount + " ETH<br> Description: " + description + "</p> Time Left: " + timer + table + form + "</div>"

      var budget_box = "<div id=\"box" + address + "\" class=\"col-sm-4 text-center\"><div class=\"container\"><div class=\"modal text-center\" id=\"" + "modal" + address + "\"><div class=\"modal-dialog\"><div class=\"modal-content\">" + header + body + "</div></div></div>" + outside + "</div></div>";
      $("#ongoing_display").append(budget_box);
      App.countdown(id, budget_box);
      App.create_table(address);
    }
    App.deposit_money();
  },

  create_table: function (address) {
    var budget = web3.eth.contract(abi).at(address);
    var option_results = $("#option_results" + address);
    option_results.empty();
    var option_select = $("#option_select" + address);
    option_select.empty();
    for (var i = 0; i < 2; i++) {
      budget.options(i, function (error, option) {
        if (!error) {
          var id = Number(option[0]) + 1;
          var name = option[1];
          var vote_count = option[2];

          var option_template = "<tr><th>" + name + "</th><td>" + vote_count + "</td></tr>"
          option_results.append(option_template);

          var option_options = "<option value='" + id + "'>" + name + "</option"
          option_select.append(option_options);
        }
        else { console.log(error) }
      });
    }
    budget.voters(App.account, function (error, hasVoted) {
      if (!error) {
        if (hasVoted) { $("#form" + address).hide(); }
      }
      else { console.log(error) }
    });
  },

  deposit_money: function () {
    App.get_balance();
    $("#deposit-click").on("click", function () {
      App.contracts.BudgetCreator.deployed().then(function (instance) {
        instance.deposit(web3.toWei(document.querySelector("#deposit_amount").value),
          { from: App.account, value: web3.toWei(document.querySelector("#deposit_amount").value) });
        App.listenForNewDeposit();
      });
    });
  },

  castVote: function (budget_id) {
    var address = App.budgets[budget_id][0];
    var option_id = $("#option_select" + address).val() - 1;
    var budget = web3.eth.contract(abi).at(address);
    budget.vote(option_id, function (error, result) {
      if (!error) {
        App.listenForNewVote(address);
      } else { console.log(error) }
    });
  },

  display_history: function () {
    $("#history").on("click", function () {
      $("#ongoing_display").hide();
      $("#past_display").show();
      $(".fixed-bottom").hide();
      document.getElementById("history").className = "btn btn-primary mx-2";
      document.getElementById("ongoing").className = "btn btn-outline-primary mx-2";
    });
  },

  display_ongoing: function () {
    $("#ongoing").on("click", function () {
      $("#past_display").hide();
      $("#ongoing_display").show();
      $(".fixed-bottom").show();
      document.getElementById("ongoing").className = "btn btn-primary mx-2";
      document.getElementById("history").className = "btn btn-outline-primary mx-2";
    });
  },

  listenForNewContract: function () {
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      instance.NewContract({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("new contract", event)
        $("#newbudget").modal('hide');
      });
    });
  },

  listenForNewVote: function (address) {
    var contract = web3.eth.contract(abi).at(address);
    contract.votedEvent({}, {
      fromBlock: 'latest',
      toBlock: 'latest'
    }).watch(function (error, event) {
      console.log("new vote", event)
      $("#modal" + address).modal('hide');
      App.create_table(address);
      $("#modal" + address).modal('show');
    });
  },

  listenForNewWithdraw: function (address) {
    var contract = web3.eth.contract(abi).at(address);
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      instance.Withdraw({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("withdraw", event)
        App.get_balance();
      });
    });
  },

  listenForNewDeposit: function () {
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      instance.Deposit({}, {
        fromBlock: "latest",
        toBlock: "latest"
      }).watch(function (error, event) {
        console.log("deposit", event)
        App.get_balance();
        $("#deposit").modal('hide');
      });
    });
  },

  countdown: function (id, budget_box) {
    var address = App.budgets[id][0];
    var proposal_creation = new Date(App.budgets[id][4]);
    var deadline = App.budgets[id][5];
    var timer = $(".timer" + address);
    var end = new Date();

    end.setDate(proposal_creation.getDate() /* + Number(deadline) */);
    end.setHours(proposal_creation.getHours());
    end.setMinutes(proposal_creation.getMinutes() + Number(deadline));
    end.setSeconds(proposal_creation.getSeconds());

    var x = setInterval(function () {
      timer.empty();
      var now = new Date().getTime();
      var distance = end.getTime() - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timer.append(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

      if (distance < 0) {
        clearInterval(x);
        var has_sent = App.budgets[id][6];
        console.log(has_sent)
        var receiver_address = App.budgets[id][7];
        var yes_count;
        var no_count;
        var budget = web3.eth.contract(abi).at(address);
        if (receiver_address == App.account) {
          for (var i = 0; i < 2; i++) {
            budget.options(i, function (error, option) {
              if (error) { throw error; }
              else {
                if (option[1] === 'Yes') { yes_count = option[2]; }
                else if (option[1] === 'No') { no_count = option[2]; }
                if (yes_count > no_count && !has_sent) {
                  var amount = App.budgets[id][2];
                  App.contracts.BudgetCreator.deployed().then(function (creator) {
                    creator.withdraw(receiver_address, web3.toWei(`${amount}`, "ether"), address)
                    App.listenForNewWithdraw();
                  });
                }
              }
            });
          }
        }
        $('#box' + address).remove();
        $('#past_display').append(budget_box);
        $(".timer" + address).empty();
        App.create_table(address);
        $('#form' + address).hide();
      }
    }, 1000)
  },
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});
