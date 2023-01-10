const spl = require('@solana/spl-token');

exports.createNewToken = async function createNewToken(anchor, decimals) {
    return {
        _anchor: anchor,
        _provider: anchor.AnchorProvider.env(),
        mintAddress: await createMint(anchor, decimals),
        getOrCreateAssociatedAccount: getOrCreateAssociatedAccount,
        mint: mint,
        balanceOf: balanceOf,
    }
}

async function createMint(anchor, decimals) {
    const provider = anchor.AnchorProvider.env();
    const tokenMint = new anchor.web3.Keypair();
    const rentExempt =  await provider.connection.getMinimumBalanceForRentExemption(spl.MintLayout.span);
    let tx = new anchor.web3.Transaction();
        tx.add(
            anchor.web3.SystemProgram.createAccount({
                programId: spl.TOKEN_PROGRAM_ID,
                space: spl.MintLayout.span,
                fromPubkey: provider.wallet.publicKey,
                newAccountPubkey: tokenMint.publicKey,
                lamports: rentExempt,
            })
        )
        tx.add(
            spl.createInitializeMintInstruction(
                tokenMint.publicKey,
                decimals,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
                spl.TOKEN_PROGRAM_ID
            )
        );
        const signature = await provider.sendAndConfirm(tx, [tokenMint]);
        return tokenMint.publicKey;
}

async function getOrCreateAssociatedAccount(account) {
    return await spl.getOrCreateAssociatedTokenAccount(
        this._provider.connection,
        this._provider.wallet.payer,
        this.mintAddress,
        account,
    )
}

async function mint(address, amount) {
    await spl.mintTo(
        this._provider.connection,
        this._provider.wallet.payer,
        this.mintAddress,
        address,
        this._provider.wallet.payer,
        amount,
    )
}

async function balanceOf(address) {
    return await this._provider.connection.getTokenAccountBalance(address);
}