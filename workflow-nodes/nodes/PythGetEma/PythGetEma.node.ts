import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythGetEma implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Get EMA',
		name: 'pythGetEma',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch EMA price for a Pyth price feed ID',
		defaults: { name: 'Pyth Get EMA' },
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
				default: 60,
				description: 'Window in seconds for EMA calculation',
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
				const res = await axios.get(`${baseUrl}/v2/updates/price/${id}/ema`, { 
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
