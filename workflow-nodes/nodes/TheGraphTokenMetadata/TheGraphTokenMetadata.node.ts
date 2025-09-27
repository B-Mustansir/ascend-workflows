import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphTokenMetadata implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Token Metadata',
		name: 'theGraphTokenMetadata',
		icon: 'file:theGraph.svg',
		group: ['transform'],
		version: 1,
		description: 'Get token metadata using TheGraph',
		defaults: { name: 'TheGraph Token Metadata' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The token address to get metadata for',
			},
			{
				displayName: 'API Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
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
						token(id: "${tokenAddress.toLowerCase()}") {
							id
							symbol
							name
							decimals
							totalSupply
							tradeVolume
							txCount
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
