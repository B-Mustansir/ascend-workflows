import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import axios from 'axios';

export class PythPriceFeeds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Price Feeds',
		name: 'pythPriceFeeds',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch all price feeds from the Pyth network',
		defaults: { name: 'Pyth Price Feeds' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Asset Type',
				name: 'assetType',
				type: 'string',
				default: '',
				placeholder: 'Optional: e.g., crypto, forex, commodities',
				description: 'Filter feeds by asset type',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				placeholder: 'Optional search query',
				description: 'Filter feeds by search query',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const assetType = this.getNodeParameter('assetType', i) as string;
			const query = this.getNodeParameter('query', i) as string;

			try {
				const response = await axios.get('https://hermes.pyth.network/v2/price_feeds', {
					params: {
						asset_type: assetType || undefined,
						query: query || undefined,
					},
				});

				returnData.push({
					json: response.data,
				});
			} catch (err) {
				returnData.push({
					json: {
						error: err.message || 'Failed to fetch price feeds',
					},
				});
			}
		}

		return [returnData];
	}
}