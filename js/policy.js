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
  policies: [],
  policy_count: 0,

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
    $.getJSON("/js/PolicyCreator.json", function (policy) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.PolicyCreator = TruffleContract(policy);
      // Connect provider to interact with contract
      App.contracts.PolicyCreator.setProvider(App.web3Provider);

      App.listenForNewContract();

      App.click_cancel();

      return App.create_contract();
    });
  },

  create_contract: function () {
    $("#button-click").on("click", function () {
      App.contracts.PolicyCreator.deployed().then(function (instance) {
        instance.add_contract(document.getElementById('proposal_name').value, document.getElementById('proposal_description').value, new Date().toString(), document.getElementById('deadline').value);
      });
      document.getElementById("loading-contract").className = "mr-2 spinner-border spinner-border-sm";
    });
    return App.get_data();
  },

  click_cancel: function () {
    $("#button-cancel").on("click", function () {
      document.getElementById("loading-contract").className = "mr-2 spinner-border spinner-border-sm d-none";
    });
  },

  get_data: function () {
    var policy_creator;
    App.contracts.PolicyCreator.deployed().then(function (creator) {
      policy_creator = creator;
      return policy_creator.contract_count();
    }).then(function (count) {
      App.policy_count = count;
      for (var i = 0; i < count; i++) {
        var policy_address;
        policy_creator.policies(i).then(function (address) {
          policy_address = address;
          return web3.eth.contract(abi).at(address);
        }).then(function (contract) {
          var data = []
          data.push(policy_address)
          contract.data(0, function (error, result) {
            if (!error) {
              data.push(result[0]);
              data.push(result[1]);
              data.push(result[2]);
              data.push(result[3]);
              App.policies.push(data)
            }
            else { console.log(error); }
          });
        });
      }
    }).then(function () {
      var render_data = setInterval(function () {
        if (App.policies.length == App.policy_count) {
          App.render()
          clearInterval(render_data);
        }
      }, 1000);
    });
  },

  render: function () {
    App.display_history();
    App.display_ongoing();
    $("#past_display").hide();
    for (var id = 0; id < App.policies.length; id++) {
      var address = App.policies[id][0]
      var name = App.policies[id][1];
      var description = App.policies[id][2];
      var creation_date = App.policies[id][3];
      var deadline = App.policies[id][4];

      var timer = "<p class=\"timer" + address + "\"> </p>";

      var header = "<div class=\"modal-header text-center\"><h2 class=\"modal-title w-100\">" + name + "</h2><button class=\"close\" type=\"button\" data-dismiss=\"modal\">x</button></div>"
      var outside = "<div class=\"p-3 mb-2 bg-light text-dark\"><h4><a href=\"#\" data-toggle=\"modal\" data-target=\"#" + "modal" + address + "\">" + name + "</a></h4>" + timer + "</div>"

      var table = "<table class=\"table\"><thead><tr><th scope=\"col\">Option</th><th scope=\"col\">Votes</th></tr></thead><tbody id=\"option_results" + address + "\"></tbody></table>"
      var button = "<button type=\"submit\" class=\"btn btn-outline-primary\">" +
        "Vote" +
        "</button >"
      var form = "<form id=\"form" + address + "\" onSubmit=\"App.castVote(" + id + "); return false;\"><div class=\"form-group\"><label for=\"option_select" + address + "\">Select Option</label><select class=\"form-control\" id=\"option_select" + address + "\"></select></div>" + button + "<hr/></form>"
      var body = "<div class=\"modal-body\"><p>" + description + "</p>" + timer + table + form + "</div>"
      var policy_box = "<div id=\"box" + address + "\" class=\"col-sm-4 text-center\"><div class=\"container\"><div class=\"modal text-center\" id=\"" + "modal" + address + "\"><div class=\"modal-dialog\"><div class=\"modal-content\">" + header + body + "</div></div></div>" + outside + "</div></div>";
      $("#ongoing_display").append(policy_box);
      App.countdown(new Date(creation_date), deadline, address, policy_box);
      App.create_table(address);
    }

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html(account);
        const publicaddress = document.getElementById("publicaddress").innerText.toLowerCase();
        if (account != publicaddress) {
          document.getElementById("content").className = "d-none";
          // window.alert(`Invalid public address detected. Please change your Metamask account to the one used during registration for Solon and reload the page. \nThe public address of that account should be: ${publicaddress}`);
          window.location.href = "/policy/addresserror";
        };
      }
    });
  },

  create_table: function (address) {
    var contract = web3.eth.contract(abi).at(address);
    var option_results = $("#option_results" + address);
    option_results.empty();
    var option_select = $("#option_select" + address);
    option_select.empty();
    for (var i = 0; i < 2; i++) {
      contract.options(i, function (error, option) {
        if (!error) {
          var id = Number(option[0]) + 1;
          var name = option[1];
          var vote_count = option[2];

          var option_template = "<tr><th>" + name + "</th><td>" + vote_count + "</td></tr>";
          option_results.append(option_template);

          var option_options = "<option value=" + id + ">" + name + "</option";
          option_select.append(option_options);
        }
        else { console.log(error) }
      });
    }
    contract.voters(App.account, function (error, hasVoted) {
      if (!error) { if (hasVoted) { $("#form" + address).hide(); } }
      else { console.log(error) }
    });
  },

  castVote: function (id) {
    var address = App.policies[id][0]
    var option_id = $("#option_select" + address).val() - 1;
    var contract = web3.eth.contract(abi).at(address);
    contract.vote(option_id, function (error, result) {
      if (!error) {
        App.listenForNewVote(address);
      }
      else { console.log(error) }
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
    App.contracts.PolicyCreator.deployed().then(function (instance) {
      instance.NewContract({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log("event triggered", event)
        $("#newpolicy").modal('hide');
        document.getElementById("loading-contract").className = "mr-2 spinner-border spinner-border-sm d-none";
      });
    });
  },

  listenForNewVote: function (address) {
    var contract = web3.eth.contract(abi).at(address);
    contract.votedEvent({}, {
      fromBlock: 'latest',
      toBlock: 'latest'
    }).watch(function (error, event) {
      console.log("event triggered", event)
      $("#modal" + address).modal("hide");
      App.create_table(address);
      $("#modal" + address).modal("show");
    });
  },

  countdown: function (proposal_creation, deadline, address, policy_box) {
    var timer = $(".timer" + address);
    var end = new Date();
    end.setDate(proposal_creation.getDate() + Number(deadline));
    end.setHours(proposal_creation.getHours());
    end.setMinutes(proposal_creation.getMinutes());
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
        $('#box' + address).remove();
        $('#past_display').append(policy_box);
        $(".timer" + address).empty();
        App.create_table(address);
        $('#form' + address).hide();
      }
    }, 1000)
  }
};

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});