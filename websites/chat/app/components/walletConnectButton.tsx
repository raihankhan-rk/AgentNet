'use client'
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { base } from 'wagmi/chains';
import { createSiweMessage } from 'viem/siwe'
import { useSignMessage } from 'wagmi';
import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
 
const message = createSiweMessage({
  address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  chainId: base.id,
  domain: 'example.com',
  nonce: 'foobarbaz',
  uri: 'https://example.com/path',
  version: '1',
})
 
export function WalletComponents() {
  const { signMessage } = useSignMessage();
 
  return (
    <Wallet className='absolute z-[10000] right-2 top-2'>
  <ConnectWallet onConnect={() => {signMessage({ message })}}>
    <Avatar className="h-6 w-6" />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
      <Avatar />
      <Name />
      <Address />
      <EthBalance />
    </Identity>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
  );
}