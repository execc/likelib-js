const Likelib = require('../likelib-js/likelib.js');

let lk = new Likelib("ws://localhost:50051");
const account = new Likelib.Account("2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409");

const abi = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "stored_data",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": "",
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const compiled = '608060405234801561001057600080fd5b506040516101213803806101218339818101604052602081101561003357600080fd5b8101908080519060200190929190505050806000819055505060c78061005a6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c806360fe47b11460375780636d4ce63c146062575b600080fd5b606060048036036020811015604b57600080fd5b8101908080359060200190929190505050607e565b005b60686088565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea264697066735822122027192129008f2ff5ba5e3fdd3272421523c4aed1cb6ed36bfc9cb4cccbd9316f64736f6c634300060b0033';

let contract = Likelib.Contract.nondeployed(lk, account, abi, compiled);

contract.deploy('1228', 0, 100000000, function(err, fee_left) {
    if(err) {
        console.log("Error during deplyment: " + err);
    }
    else {
        console.log("Contract was successfully deployed: " + fee_left);

        contract.set('2345675643', 0, 5000000, function(err, result) {
            if(err) {
                console.log("Error while setting: " + err);
            }
            else {
                console.log("Successfull");
                contract.get(0, 5000000, function(err, result) {
                    console.log("The result is: " + result.stored_data);
                });
            }
        });
    }
});


lk.subAccountInfo('49cfqVfB1gTGw5XZSu6nZDrntLr2', function(err, info) {
    if(err) {
        console.log("Error");
        return;
    }
    console.log("This is not working: balance is " + info.balance);
});

let tx = new Likelib.Tx({
    from: '49cfqVfB1gTGw5XZSu6nZDrntLr1',
    to: '49cfqVfB1gTGw5XZSu6nZDrntLr2',
    amount: 500n,
    fee: 100n,
    timestamp: 1594383796
});

lk.subLastBlockInfo(function(err, info) {
    console.log("last block has been changed: " + info.top_block_hash);
});

account.sign(tx);
lk.pushTransaction(tx, function(err, info) {
    if(info.status_code == Likelib.Tx.Status.Success) {
        console.log("Transaction has been performed");

        lk.getAccountInfo('49cfqVfB1gTGw5XZSu6nZDrntLr2', function(err, info) {
            if(err) {
                console.log("Error");
                return;
            }
            console.log("This works: balance is " + info.balance);
        });        
    }
});
