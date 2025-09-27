import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphSolanaAccount implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Solana Account',
		name: 'theGraphSolanaAccount',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get Solana account data using TheGraph',
		defaults: { name: 'TheGraph Solana Account' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Account Address',
				name: 'accountAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Solana account address',
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
							balance
							owner
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
