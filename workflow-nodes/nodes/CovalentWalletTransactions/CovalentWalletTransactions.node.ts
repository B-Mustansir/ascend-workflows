import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class CovalentWalletTransactions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Covalent Wallet Transactions',
		name: 'covalentWalletTransactions',
		icon: 'file:covalent.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch latest wallet transactions across all chains using Covalent API',
		defaults: { name: 'Covalent Wallet Transactions' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Wallet Address',
				name: 'walletAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'Ethereum or multi-chain wallet address',
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
				displayName: 'Transaction Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				description: 'Number of recent transactions to fetch',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const walletAddress = this.getNodeParameter('walletAddress', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;
			const limit = this.getNodeParameter('limit', i) as number;

			const url = `https://api.covalenthq.com/v1/allchains/transactions/?addresses=${walletAddress}&limit=${limit}`;

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			});

			const data = response.data?.data;

			const txs = data?.items?.map((tx: any) => ({
				tx_hash: tx.tx_hash,
				from: tx.from_address,
				to: tx.to_address,
				value: tx.value,
				fees_paid: tx.fees_paid,
				chain_id: tx.chain_id,
			})) || [];

			returnData.push({
				json: { walletAddress, transactions: txs },
			});
		}

		return [returnData];
	}
}