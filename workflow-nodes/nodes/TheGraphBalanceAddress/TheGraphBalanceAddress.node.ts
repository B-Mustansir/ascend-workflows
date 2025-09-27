import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphBalanceAddress implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Balance Address',
		name: 'theGraphBalanceAddress',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get token balances for an address using TheGraph',
		defaults: { name: 'TheGraph Balance Address' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Wallet Address',
				name: 'address',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The wallet address to get balances for',
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
			const address = this.getNodeParameter('address', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						user(id: "${address.toLowerCase()}") {
							id
							usdSwapped
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
					address, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
