'use client'
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { base } from 'wagmi/chains';
import { createSiweMessage } from 'viem/siwe'
import { useAccount, useSignMessage } from 'wagmi';
import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
 

 
export function WalletComponents() {

  const {address} = useAccount();

  // const message = createSiweMessage({
  //   address: address ? address as `0x${string}` : "0x1ce256752fBa067675F09291d12A1f069f34f5e8",
  //   chainId: base.id,
  //   domain: 'example.com',
  //   nonce: 'foobarbaz',
  //   uri: 'https://example.com/path',
  //   version: '1',
  // })

  const { signMessage } = useSignMessage();
 
  return (
    <Wallet className='text-black w-full hover:-translate-y-1 duration-200'>
  <ConnectWallet  className='hover:text-[#7B88F9] bg-gradient-to-br hover:text-[] h-12 from-[#abb3ff] to-[#fecdff] rounded hover:bg-[#7B88F9] w-full duration-200' >
    {/* <Avatar className="h-6 w-6" /> */}
    <Name />
  </ConnectWallet>
  <WalletDropdown className='bg-[#7B88F9] -translate-y-40'>
    <Identity className="px-4 pt-3 pb-2 " hasCopyAddressOnClick>
      <Avatar className="h-6 w-6" />
      <Name />
      <Address className=''/>
      <EthBalance />
    </Identity>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet>
  );
}