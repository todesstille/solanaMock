const spl = require('@solana/spl-token');

exports.createNewToken = async function createNewToken(anchor) {
    return {
        _anchor: anchor,
        _provider: anchor.AnchorProvider.env(),
        createMint: createMint,
    }
}

async function createMint(decimals) {
    const tokenMint = new this._anchor.web3.Keypair();
    const rentExempt =  await this._provider.connection.getMinimumBalanceForRentExemption(spl.MintLayout.span);
    let tx = new this._anchor.web3.Transaction();
        tx.add(
            this._anchor.web3.SystemProgram.createAccount({
                programId: spl.TOKEN_PROGRAM_ID,
                space: spl.MintLayout.span,
                fromPubkey: this._provider.wallet.publicKey,
                newAccountPubkey: tokenMint.publicKey,
                lamports: rentExempt,
            })
        )
        tx.add(
            spl.Token.createInitMintInstruction(
                spl.TOKEN_PROGRAM_ID,
                tokenMint.publicKey,
                decimals,
                this._provider.wallet.publicKey,
                this._provider.wallet.publicKey,
            )
        );
        const signature = await this._provider.send(tx, [tokenMint]);
        console.log(`[${tokenMint.publicKey}] Created new mint account at ${signature}`);
        return tokenMint.publicKey;
}