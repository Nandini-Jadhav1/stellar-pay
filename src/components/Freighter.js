import { isConnected, requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";
import * as StellarSdk from "stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const networkPassphrase = StellarSdk.Networks.TESTNET;

export const checkConnection = async () => {
  const result = await isConnected();
  return result.isConnected;
};

export const retrievePublicKey = async () => {
  const accessObj = await requestAccess();
  if (accessObj.error) throw new Error(accessObj.error.message);
  return accessObj.address;
};

export const getBalance = async () => {
  const addressObj = await getAddress();
  if (addressObj.error) throw new Error(addressObj.error.message);
  const account = await server.loadAccount(addressObj.address);
  const xlmBalance = account.balances.find((b) => b.asset_type === "native");
  return xlmBalance ? xlmBalance.balance : "0";
};

export const sendXLM = async (destination, amount) => {
  const addressObj = await getAddress();
  if (addressObj.error) throw new Error(addressObj.error.message);
  const sourcePublicKey = addressObj.address;
  const sourceAccount = await server.loadAccount(sourcePublicKey);
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destination,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(30)
    .build();
  const signedResult = await signTransaction(transaction.toXDR(), { networkPassphrase });
  if (signedResult.error) throw new Error(signedResult.error.message);
  const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(signedResult.signedTxXdr, networkPassphrase);
  const res = await server.submitTransaction(signedTransaction);
  return res;
};