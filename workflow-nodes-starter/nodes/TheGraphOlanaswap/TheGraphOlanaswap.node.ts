import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphOlanaswap implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Olanaswap',
		name: 'theGraphOlanaswap',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get Olanaswap data using TheGraph',
		defaults: { name: 'TheGraph Olanaswap' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Pool Address',
				name: 'poolAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Olanaswap pool address',
			},
			{
				displayName: 'API Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://api.thegraph.com/subgraphs/name/olanaswap/olanaswap',
				description: 'TheGraph API base URL',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const poolAddress = this.getNodeParameter('poolAddress', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						pool(id: "${poolAddress.toLowerCase()}") {
							id
							totalLiquidity
							totalSwapVolume
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
					poolAddress, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
