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
        this.createToken = createToken;
    }
}

async function createToken(decimals) {
    const {createNewToken} = require('./token.js');
    return createNewToken(this._anchor, decimals);
}