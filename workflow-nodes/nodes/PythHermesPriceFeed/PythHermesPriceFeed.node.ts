import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythHermesPriceFeed implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Hermes Price Feed',
		name: 'pythHermesPriceFeed',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Get price feed data from Pyth Hermes',
		defaults: { name: 'Pyth Hermes Price Feed' },
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
				const res = await axios.get(`${baseUrl}/v2/updates/price/${id}`);
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
