import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythUpdatePriceFeeds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Update Price Feeds',
		name: 'pythUpdatePriceFeeds',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Update multiple Pyth price feeds',
		defaults: { name: 'Pyth Update Price Feeds' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Price Feed IDs',
				name: 'ids',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd,0x5678...efgh',
				description: 'Comma-separated list of Pyth price feed IDs to update',
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
			const ids = this.getNodeParameter('ids', i) as string;
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			let data: any = null;
			try {
				const idList = ids.split(',').map(id => id.trim());
				const res = await axios.post(`${baseUrl}/v2/updates/price/update`, {
					ids: idList
				});
				data = res.data;
			} catch (err) {
				data = { error: (err as any).message };
			}

			returnData.push({ 
				json: { 
					ids, 
					data 
				} 
			});
		}

		return [returnData];
	}
}
