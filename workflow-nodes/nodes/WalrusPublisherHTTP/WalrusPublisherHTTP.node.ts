import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusPublisherHTTP implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Publisher HTTP',
		name: 'walrusPublisherHTTP',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Upload blobs to Walrus publisher HTTP API',
		defaults: { name: 'Walrus Publisher HTTP' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Publisher URL',
				name: 'publisherUrl',
				type: 'string',
				default: '',
				placeholder: 'https://publisher.walrus.xyz',
				description: 'The Walrus publisher API URL',
			},
			{
				displayName: 'Blob Data',
				name: 'blobData',
				type: 'string',
				default: '',
				description: 'The blob data to upload',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const publisherUrl = this.getNodeParameter('publisherUrl', i) as string;
			const blobData = this.getNodeParameter('blobData', i) as string;

			try {
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: `${publisherUrl}/upload`,
					body: { data: blobData },
					json: true,
				});

				returnData.push({
					json: {
						publisherUrl,
						blobData: blobData.substring(0, 100) + '...', // Truncate for display
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							publisherUrl,
							blobData: blobData.substring(0, 100) + '...',
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
