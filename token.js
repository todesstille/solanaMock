const spl = require('@solana/spl-token');

exports.createNewToken = async function createNewToken(anchor) {
    return {
        _anchor: anchor,
        _provider: anchor.AnchorProvider.env(),
        createMint: createMint,
    }
}

async function createMint(anchor, provider, decimals) {
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
            spl.Token.createInitMintInstruction(
                spl.TOKEN_PROGRAM_ID,
                tokenMint.publicKey,
                decimals,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
            )
        );
        const signature = await provider.send(tx, [tokenMint]);
        console.log(`[${tokenMint.publicKey}] Created new mint account at ${signature}`);
        return tokenMint.publicKey;
}