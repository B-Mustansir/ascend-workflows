import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythUpdate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Update',
		name: 'pythUpdate',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Update Pyth price feed data',
		defaults: { name: 'Pyth Update' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Price Feed ID',
				name: 'id',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Pyth price feed ID to update',
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
				const res = await axios.post(`${baseUrl}/v2/updates/price/${id}/update`);
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
