import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusAggregatorHTTP implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Aggregator HTTP',
		name: 'walrusAggregatorHTTP',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Read blobs from Walrus aggregator HTTP API',
		defaults: { name: 'Walrus Aggregator HTTP' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Aggregator URL',
				name: 'aggregatorUrl',
				type: 'string',
				default: '',
				placeholder: 'https://aggregator.walrus.xyz',
				description: 'The Walrus aggregator API URL',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				default: '',
				placeholder: 'file-id-123',
				description: 'The file ID to retrieve from the aggregator',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const aggregatorUrl = this.getNodeParameter('aggregatorUrl', i) as string;
			const fileId = this.getNodeParameter('fileId', i) as string;

			try {
				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: `${aggregatorUrl}/files/${fileId}`,
					json: true,
				});

				returnData.push({
					json: {
						fileId,
						aggregatorUrl,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							fileId,
							aggregatorUrl,
						},
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
