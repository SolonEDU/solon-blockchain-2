# solonedu

Solon is an educational tool that both students and parents can use to keep up with current school events. Our goal is to create a platform where we can encourage more parent and student participation in school decisions and policy.

### Usage

```sh
$ npm install
```

```sh
$ npm start

# Visit http://localhost:5000
```

### MongoDB

Open "config/keys.js" and add your MongoDB URI, local or Atlas

### Truffle migrations 

- Modify the truffle-config.js files in views/budget and in views/policy to include the mnemonic of your MetaMask account. 

- Create an infura account and paste the link for your chosen network

```sh
$ truffle migrate --reset --network \(chosen network\)
```

- move the .json files from views/budget/build/contracts and from views/policy/build/contract into the js folder 

- replace the abi vars in js/budget.js and js/policy.js with the ABIs from Budget.json and Policy.json