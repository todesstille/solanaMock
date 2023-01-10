const spl = require('@solana/spl-token');

exports.createNewToken = async function createNewToken(anchor, decimals) {
    return {
        _anchor: anchor,
        _provider: anchor.AnchorProvider.env(),
        mintAddress: await createMint(decimals),
        getOrCreateAssociatedAccount: getOrCreateAssociatedAccount,
        mint: mint,
        balanceOf: balanceOf,
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
            spl.createInitializeMintInstruction(
                tokenMint.publicKey,
                decimals,
                this._provider.wallet.publicKey,
                this._provider.wallet.publicKey,
                spl.TOKEN_PROGRAM_ID
            )
        );
        const signature = await this._provider.sendAndConfirm(tx, [tokenMint]);
        console.log(`[${tokenMint.publicKey}] Created new mint account at ${signature}`);
        return tokenMint.publicKey;
}

async function getOrCreateAssociatedAccount(account) {
    return await spl.getOrCreateAssociatedTokenAccount(
        this._provider,
        this._provider.wallet,
        this.mintAddress,
        account,
    )
}

async function mint(address, amount) {
    await spl.mintTo(
        this._provider,
        this._provider.wallet,
        this.mintAddress,
        address,
        amount,
    )
}

async function balanceOf(address) {
    return await this._provider.connection.getTokenAccountBalance(address);
}