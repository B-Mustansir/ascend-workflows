import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphLiquidityPool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph Liquidity Pool',
		name: 'theGraphLiquidityPool',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get liquidity pool data using TheGraph',
		defaults: { name: 'TheGraph Liquidity Pool' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Pool Address',
				name: 'poolAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The liquidity pool address',
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
						pair(id: "${poolAddress.toLowerCase()}") {
							id
							token0 {
								symbol
								name
							}
							token1 {
								symbol
								name
							}
							reserve0
							reserve1
							totalSupply
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
