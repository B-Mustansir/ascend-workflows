import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphSolanaOHLCB implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Solana OHLCB',
		name: 'theGraphSolanaOHLCB',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get Solana OHLCB data using TheGraph',
		defaults: { name: 'TheGraph Solana OHLCB' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Solana token address',
			},
			{
				displayName: 'API Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://api.thegraph.com/subgraphs/name/solana/solana',
				description: 'TheGraph API base URL',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						token(id: "${tokenAddress}") {
							id
							symbol
							name
							totalSupply
							decimals
						}
					}
				`;
				
				const res = await axios.post(baseUrl, { query });
				data = res.data;
			} catch (err) {
				data = { error: (err as any).message };
			}

			returnData.push({ 
				json: { 
					tokenAddress, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
