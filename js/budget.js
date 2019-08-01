abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "creator",
    "outputs": [
      {
        "name": "",
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
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "candidatesCount",
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
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
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
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "counter",
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
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_daysAfter",
        "type": "uint256"
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
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "votedEvent",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "countdown",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "winner",
    "outputs": [
      {
        "name": "winner",
        "type": "string"
      }
    ],
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
    web3.eth.getCoinbase(function (err, account) { //turn off privacy mode for this to work with MetaMask
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
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
    // var budget_creator;
    var budget_address;
    var acc; // account to transfer the $bread$ to
    var amount; //amount of $$$ to transfer to acc
    $("#button-click").on("click", function () {
      App.contracts.BudgetCreator.deployed().then(function (instance) {
        //console.log('hey0');
        amount = Number(document.querySelector('#budget_amount').value);
        budget_address = document.querySelector('#receiver_address').value;
        acc = document.querySelector('#sender_address').value;
        // web3.eth.getCoinbase(function (err, account) { //turn off privacy mode for this to work with MetaMask
        //   if (err) throw err;
        //   acc = account;
        // });
        console.log(amount);
        console.log(budget_address);
        console.log(acc);
        //var x = setInterval(function() {
        //if(acc != undefined) {
        instance.add_contract(document.querySelector('#budget_name').value, amount, document.querySelector('#budget_description').value, new Date().toString(), document.querySelector('#deadline').value, acc, budget_address);
        // clearInterval(x)
        //}
        // });
        //console.log(amount);
        // budget_creator = instance;
        // console.log('hey2');
        //return budget_creator.contract_count();
        // App.listenForNewContract();
        // })
        // .then(function(index) {
        //   console.log('hey3');
        //   return budget_creator.budgets(index);
        // })
        // .then(function(address) {
        //  console.log('hey4');
        // budget_address = document.querySelector('#receiver_address').value;
        // web3.eth.sendTransaction({
        //   to: budget_address,
        //   from: App.address,
        //   value: web3.toWei(`${amount}`, "ether")
        //  }, function(err, transactionHash) {
        //   if(err) throw err;
        //   console.log(transactionHash);
      });
      //var budgetInstance = web3.eth.contract(abi).at(address);
      //console.log('hey5');
      //});
      // .then(function(budgetContract) {
      //   console.log('hey6');
      //   if(budgetContract.getBalance() < amount) {
      //     alert('not enuf bred');
      //     console.log(budgetContract.getBalance());
      //   }
      //   budgetContract.withdraw(amount);
      // });
      //);
      console.log('hey');
    });
    return App.get_data();
  },

  get_data: function () {
    console.log('gottem');
    var budget_creator;
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      budget_creator = instance;
      return budget_creator.contract_count();
    }).then(function (count) {
      App.budget_count = count;
      for (var i = 0; i < count; i++) {
        var budget_address;
        budget_creator.budgets(i).then(function (address) {
          budget_address = address;
          return web3.eth.contract(abi).at(address);
        }).then(function (budgetInstance) {
          var data = []
          data.push(budget_address)
          console.log('gottem1');
          budgetInstance.data(0, function (err, result) {
            console.log('gottem2');
            if (!err) {
              for (var i = 0; i < 7; i++) {
                data.push(result[i]);
              }
              App.budgets.push(data);
            } else {
              console.log(err);
            }
          })
          console.log('gottem0');
        });
      }
    }).then(function () {
      var x = setInterval(function () {
        if (App.budgets.length == App.budget_count) {
          console.log('render reached');
          App.render();
          clearInterval(x);
        }
      }, 1000);
    });
  },

  render: function () {
    // var loader = $("#loader");
    // var content = $("#content");
    // var voted = $("#voted");
    var display = $("#display");
    for (var id = 0; id < App.budgets.length; id++) {
      var address = App.budgets[id][0];
      var name = App.budgets[id][1];
      var amount = App.budgets[id][2]
      var description = App.budgets[id][3];
      var creation_date = App.budgets[id][4];
      var deadline = App.budgets[id][5];
      var sender = App.budgets[id][6];
      var receiver = App.budgets[id][7];


      var timer = "<p class=\"timer" + address + "\"> </p>";

      var header = "<div class=\"modal-header\"><h2 class=\"modal-title\">" + name + "</h2><button class=\"close\" type=\"button\" data-dismiss=\"modal\">x</button></div>"
      var outside = "<div class=\"p-3 mb-2 bg-light text-dark\"><h4><a href=\"#\" data-toggle=\"modal\" data-target=\"#" + "modal" + address + "\">" + name + "</a></h4>" + timer + "</div>"

      var table = "<table class=\"table\"><thead><tr><th scope=\"col\">#</th><th scope=\"col\">Option</th><th scope=\"col\">Votes</th></tr></thead><tbody id=\"option_results" + address + "\"></tbody></table>"
      var button = "<button type=\"submit\" class=\"btn btn-primary\">Vote</button>"
      var form = "<form id=\"form" + address + "\" onSubmit=\"App.castVote(" + id + "); return false;\"><div class=\"form-group\"><label for=\"option_select" + address + "\">Select Option</label><select class=\"form-control\" id=\"option_select" + address + "\"></select></div>" + button + "<hr/></form>"
      var body = "<div class=\"modal-body\"><p>" + sender + '\n' + receiver + '\n' + amount + '\n' + description + "</p>" + timer + table + form + "</div>"

      var budget_box = "<div class=\"col-sm-3\"><div class=\"container\"><div class=\"modal\" id=\"" + "modal" + address + "\"><div class=\"modal-dialog\"><div class=\"modal-content\">" + header + body + "</div></div></div>" + outside + "</div></div>";
      display.append(budget_box);
      console.log(App.budgets);
      App.countdown(new Date(creation_date), deadline, address);
      App.create_table(address);
    }

    // loader.show();
    // content.hide();
    // voted.hide();

    // Load account data
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      console.log(instance.address);
      console.log(App.account)
      web3.eth.getBalance(instance.address, function (err, res) {
        if (err) {
          console.log(err);
        } else {
          web3.eth.sendTransaction({
            to: instance.address,
            from: App.account,
            value: web3.toWei(1, "ether"),
            gas: 4700000
          }, function (err, transactionHash) {
            if (err) {
              console.log(err);
            } else {
              console.log(transactionHash);
            }
          });
        }
        console.log(res);
      });
    })

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

          var option_template = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + vote_count + "</td></tr>"
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

  castVote: function (budget_id) {
    var option_id = $("#option_select" + budget_id).val() - 1;
    var address = App.budgets[budget_id][0];
    var budget = web3.eth.contract(abi).at(address);
    budget.vote(option_id, function (error, result) {
      if (!error) {
        App.listenForNewVote(address);
      } else {
        console.log(error)
      }
    });
  },

  listenForNewContract: function () {
    var creator;
    App.contracts.BudgetCreator.deployed().then(function (instance) {
      creator = instance;
      instance.NewContract({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        $("#newbudget").modal('hide');
      });
      //console.log(creator.last_sender.balance);
    });
  },

  listenForNewVote: function (address) {
    var contract = web3.eth.contract(abi).at(address);
    contract.votedEvent({}, {
      fromBlock: 'latest',
      toBlock: 'latest'
    }).watch(function (error, event) {
      console.log("event triggered", event)
      $("#modal" + address).modal('hide');
      App.render();
      App.create_table(address);
      $("#modal" + address).modal('show');
    });
  },

  countdown: function (proposal_creation, deadline, address) {
    var yes_vote_count;
    var no_vote_count;
    var timer = $(".timer" + address);
    var end = new Date();
    end.setDate(proposal_creation.getDate() /*+ Number(deadline)*/);
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
        //App.history.push(App.budgets[]);
        //App.budgets.pull()
        var budget = web3.eth.contract(abi).at(address);
        for (var i = 0; i < 2; i++) {
          budget.options(i, function (error, option) {
            if (error) { throw error; }
            else {
              var id = Number(option[0]) + 1;
              var name = option[1];
              var vote_count = option[2];

              console.log(id);
              console.log(name);
              console.log(vote_count);

              if (name === 'Yes') {
                yes_vote_count = vote_count;
              } else if (name === 'No') {
                no_vote_count = vote_count;
              }
              if (yes_vote_count > no_vote_count) {
                var budget_address;
                var acc; // account to transfer the $bread$ to
                var amount; //amount of $$$ to transfer to acc
                console.log('hey3');
                budget.data(0, function (err, res) {
                  if (!err) {
                    amount = res[1];
                    acc = res[5];
                    budget_address = res[6];
                  } else {
                    console.log(err);
                  }
                  console.log('transaction reached');
                  // budget_address = document.querySelector('#receiver_address').value;
                  web3.eth.sendTransaction({
                    to: budget_address,
                    from: acc,
                    value: web3.toWei(`${amount}`, "ether")
                  }, function (err, transactionHash) {
                    if (err) throw err;
                    console.log(transactionHash);
                  });
                  //var budgetInstance = web3.eth.contract(abi).at(address);
                  console.log('hey5');
                });
                //App.send_transaction(id);
              }
            }
          });
          timer.empty();
          timer.append("the vote is over");
          $('#form' + address).hide();
        }
      }
    }, 1000)
  },

  // send_transaction: function (id) {
  //   var budget_creator;
  //   var budget_address;
  //   var acc; // account to transfer the $bread$ to
  //   var amount; //amount of $$$ to transfer to acc
  //   //$("#button-click").on("click", function () {
  //     App.contracts.BudgetCreator.deployed().then(function (instance) {
  //       // console.log('hey0');
  //       // amount = Number(document.querySelector('#budget_amount').value);
  //       // budget_address = document.querySelector('#receiver_address').value;
  //       // web3.eth.getCoinbase(function (err, account) { //turn off privacy mode for this to work with MetaMask
  //       //   if (err) throw err
  //       //   acc = account;
  //       // });
  //       // //instance.add_contract(document.getElementById('budget_name').value, amount, document.getElementById('budget_description').value, new Date().toString(), document.getElementById('deadline').value, acc, budget_address);
  //       // console.log(amount);
  //       // budget_creator = instance;
  //       // console.log('hey2');
  //       // return instance.contract_count();
  //       // App.listenForNewContract();
  //       return instance.budgets(id);
  //     })
  //     .then(function(budget) {
  //       console.log('hey3');
  //       amount = budget.data(0)[1];
  //       acc = budget.data(0)[5];
  //       budget_address = budget.data(0)[6];
  //     })
  //     .then(function(address) {
  //       console.log('hey4');
  //       // budget_address = document.querySelector('#receiver_address').value;
  //       web3.eth.sendTransaction({
  //         to: budget_address,
  //         from: acc,
  //         value: web3.toWei(`${amount}`, "ether")
  //       }, function(err, transactionHash) {
  //         if(err) throw err;
  //         console.log(transactionHash);
  //       });
  //       //var budgetInstance = web3.eth.contract(abi).at(address);
  //       console.log('hey5');
  //     })
  //     // .then(function(budgetContract) {
  //     //   console.log('hey6');
  //     //   if(budgetContract.getBalance() < amount) {
  //     //     alert('not enuf bred');
  //     //     console.log(budgetContract.getBalance());
  //     //   }
  //     //   budgetContract.withdraw(amount);
  //     // });
  //   //});
  // }
  //   //console.log('hey');
  //   //return App.get_data();

};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});
