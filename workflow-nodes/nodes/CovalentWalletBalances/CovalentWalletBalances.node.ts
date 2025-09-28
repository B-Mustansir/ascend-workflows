import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class CovalentWalletBalances implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Covalent Wallet Balances',
		name: 'covalentWalletBalances',
		icon: 'file:covalent.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch ERC20 / native token balances of a wallet using Covalent API',
		defaults: { name: 'Covalent Wallet Balances' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Wallet Address',
				name: 'walletAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'Ethereum wallet address',
				required: true,
			},
			{
				displayName: 'Covalent API Key',
				name: 'apiKey',
				type: 'string',
				default: '',
				description: 'Your Covalent API key',
				required: true,
			},
			{
				displayName: 'Chain ID',
				name: 'chainId',
				type: 'options',
				options: [
					{ name: 'Ethereum Mainnet', value: 'eth-mainnet' },
					{ name: 'Polygon', value: 'polygon-mainnet' },
					{ name: 'Binance Smart Chain', value: 'bsc-mainnet' },
				],
				default: 'eth-mainnet',
				description: 'Select blockchain network',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const walletAddress = this.getNodeParameter('walletAddress', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const chainId = this.getNodeParameter('chainId', i) as string;

			const url = `https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/`;

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			});

			const data = response.data?.data;

			const balances = data?.items?.map((token: any) => ({
				contract_name: token.contract_name,
				contract_ticker: token.contract_ticker_symbol,
				contract_address: token.contract_address,
				last_transferred_at: token.last_transferred_at,
				type: token.type,
				balance: token.balance,
			})) || [];

			returnData.push({
				json: { walletAddress, chainId, balances },
			});
		}

		return [returnData];
	}
}