exports.Mock = class Mock {

    constructor(anchor) {
        
        this._anchor = anchor;
        this._provider = anchor.AnchorProvider.env();
        anchor.setProvider(this._provider);
        this.createKeypair = function() {
            return new this._anchor.web3.Keypair()
        }
    }
}