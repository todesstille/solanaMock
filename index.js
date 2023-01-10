exports.Mock = class Mock {

    constructor(anchor) {
        
        this._anchor = anchor;
        this._provider = anchor.AnchorProvider.env();
        anchor.setProvider(this._provider);
        this.createKeypair = function() {
            return new this._anchor.web3.Keypair()
        }
        this.getProvider = function() {
            return this._provider;
        }
        this.transfer = transfer;
        this.getBalance = getBalance;
        this.createToken = createToken;
    }
}

async function createToken(decimals) {
    const {createNewToken} = require('./token.js');
    return createNewToken(this._anchor, decimals);
}

async function transfer(from, to, amount) {
    let tx = new this._anchor.web3.Transaction();
    tx.add(
        this._anchor.web3.SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to,
            lamports: amount,
        })
    )
    const signature = await this._provider.sendAndConfirm(tx, [from]);
}

async function getBalance(user) {
    return this._provider.connection.getBalance(user)
}