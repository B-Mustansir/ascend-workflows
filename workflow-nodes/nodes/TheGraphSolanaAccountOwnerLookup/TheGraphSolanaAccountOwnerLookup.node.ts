import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphSolanaAccountOwnerLookup implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Solana Account Owner Lookup',
		name: 'theGraphSolanaAccountOwnerLookup',
		icon: 'file:theGraph.svg',
		group: ['transform'],
		version: 1,
		description: 'Lookup Solana account owner using TheGraph',
		defaults: { name: 'TheGraph Solana Account Owner Lookup' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Account Address',
				name: 'accountAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Solana account address to lookup owner for',
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
			const accountAddress = this.getNodeParameter('accountAddress', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						account(id: "${accountAddress}") {
							id
							owner
							balance
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
					accountAddress, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
