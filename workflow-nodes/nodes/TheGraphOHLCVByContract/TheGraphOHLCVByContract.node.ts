import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class TheGraphOHLCVByContract implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TheGraph OHLCV By Contract',
		name: 'theGraphOHLCVByContract',
		icon: 'file:ethereum.svg',
		group: ['transform'],
		version: 1,
		description: 'Get OHLCV data by contract using TheGraph',
		defaults: { name: 'TheGraph OHLCV By Contract' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The contract address to get OHLCV data for',
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
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const query = `
					query {
						pair(id: "${contractAddress.toLowerCase()}") {
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
					contractAddress, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
