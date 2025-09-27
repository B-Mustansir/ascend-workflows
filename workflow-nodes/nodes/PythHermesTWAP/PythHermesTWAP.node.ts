import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythHermesTWAP implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Hermes TWAP',
		name: 'pythHermesTWAP',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Get TWAP (Time Weighted Average Price) from Pyth Hermes',
		defaults: { name: 'Pyth Hermes TWAP' },
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
				displayName: 'Window Seconds',
				name: 'window',
				type: 'number',
				default: 3600,
				description: 'Window in seconds for TWAP calculation',
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
			const window = this.getNodeParameter('window', i) as number;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const res = await axios.get(`${baseUrl}/v2/updates/price/${id}/twap`, { 
					params: { window } 
				});
				data = res.data;
			} catch (err) {
				data = { error: (err as any).message };
			}

			returnData.push({ 
				json: { 
					id, 
					window, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
