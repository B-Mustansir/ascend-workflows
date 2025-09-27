import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythLatestPrice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Latest Price',
		name: 'pythLatestPrice',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Get latest price for a Pyth price feed ID',
		defaults: { name: 'Pyth Latest Price' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Price Feed ID',
				name: 'id',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Pyth price feed ID',
			},
			{
				displayName: 'Hermes Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://hermes.pyth.network',
				description: 'Hermes API base URL',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const id = this.getNodeParameter('id', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const res = await axios.get(`${baseUrl}/v2/updates/price/${id}/latest`);
				data = res.data;
			} catch (err) {
				data = { error: (err as any).message };
			}

			returnData.push({ 
				json: { 
					id, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
