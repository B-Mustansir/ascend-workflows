import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusGetFiles implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Get Files',
		name: 'walrusGetFiles',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Read one or more blobs / quilts from Walrus',
		defaults: { name: 'Walrus Get Files' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Aggregator Host',
				name: 'aggregatorHost',
				type: 'string',
				default: '',
				placeholder: 'https://aggregator.walrus.xyz',
				description: 'The Walrus aggregator host URL',
			},
			{
				displayName: 'File IDs',
				name: 'fileIds',
				type: 'string',
				default: '',
				placeholder: 'file-id-1,file-id-2,file-id-3',
				description: 'Comma-separated file IDs to fetch',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const aggregatorHost = this.getNodeParameter('aggregatorHost', i) as string;
			const fileIdsString = this.getNodeParameter('fileIds', i) as string;
			const fileIds = fileIdsString.split(',').map(id => id.trim()).filter(id => id);

			try {
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: `${aggregatorHost}/api/getFiles`,
					body: { ids: fileIds },
					json: true,
				});

				returnData.push({
					json: {
						fileIds,
						aggregatorHost,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							fileIds,
							aggregatorHost,
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
