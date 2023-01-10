# Mock library for Anchor tests
import:
```
import { Mock } from "@todesstille/mocksolana";
const mock = new Mock(anchor);
const provider = mock.getProvider();
```
### Tokens
```
let token = await mock.createToken(decimals);
console.log(token.mintAddress)
// Create account associated with address
let account = await token.getOrCreateAssociatedAccount(address)
// Mint to associated account
await token.mint(account.address, amount);
console.log((await token.balanceOf(account.address)).value.amount); 
```