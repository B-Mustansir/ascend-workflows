import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphHistoricalBalancer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Historical Balancer',
		name: 'theGraphHistoricalBalancer',
		icon: 'file:theGraph.svg',
		group: ['transform'],
		version: 1,
		description: 'Get historical Balancer data using TheGraph',
		defaults: { name: 'TheGraph Historical Balancer' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Pool Address',
				name: 'poolAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Balancer pool address',
			},
			{
				displayName: 'API Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2',
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
