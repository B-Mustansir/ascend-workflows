import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class PythPrice implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pyth Price Feed',
		name: 'pythPrice',
		icon: 'file:pyth.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch latest price from Pyth Network',
		defaults: { name: 'Pyth Price' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Price Feed ID',
				name: 'feedId',
				type: 'string',
				default: '',
				placeholder: 'Enter Pyth price feed ID (hex)',
				description: 'Unique Pyth feed ID, e.g., BTC/USD feed',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const feedId = this.getNodeParameter('feedId', i) as string;

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `https://hermes.pyth.network/v2/updates/price/latest?ids[]=${encodeURIComponent(feedId)}`,
			});

			returnData.push({
				json: {
					feedId,
					data: response.parsed || response,
				},
			});
		}

		return [returnData];
	}
}