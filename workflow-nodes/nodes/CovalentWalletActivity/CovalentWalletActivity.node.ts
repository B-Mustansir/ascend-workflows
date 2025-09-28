import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class CovalentWalletActivity implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Covalent Wallet Activity',
		name: 'covalentWalletActivity',
		icon: 'file:covalent.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch wallet activity and last seen across chains using Covalent API',
		defaults: { name: 'Covalent Wallet Activity' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Wallet Address',
				name: 'walletAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'Ethereum wallet address to fetch activity for',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const walletAddress = this.getNodeParameter('walletAddress', i) as string;
			const apiKey = this.getNodeParameter('apiKey', i) as string;

			const url = `https://api.covalenthq.com/v1/address/${walletAddress}/activity/`;

			const response = await axios.get(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			});

			const data = response.data?.data;

			const lastSeenAcrossChains = data?.items?.map((chain: any) => ({
				chain: chain.name,
				last_seen_at: chain.last_seen_at,
			})) || [];

			returnData.push({
				json: { walletAddress, lastSeenAcrossChains },
			});
		}

		return [returnData];
	}
}