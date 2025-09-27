import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphSwapEvents implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Swap Events',
		name: 'theGraphSwapEvents',
		icon: 'file:theGraph.svg',
		group: ['transform'],
		version: 1,
		description: 'Get swap events using TheGraph',
		defaults: { name: 'TheGraph Swap Events' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Pool Address',
				name: 'poolAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The pool address to get swap events for',
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
			const poolAddress = this.getNodeParameter('poolAddress', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						swaps(where: {pair: "${poolAddress.toLowerCase()}"}) {
							id
							transaction {
								id
							}
							timestamp
							pair {
								token0 {
									symbol
								}
								token1 {
									symbol
								}
							}
							amount0In
							amount1In
							amount0Out
							amount1Out
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
