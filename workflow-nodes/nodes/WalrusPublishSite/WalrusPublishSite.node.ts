import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusPublishSite implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Publish Site',
		name: 'walrusPublishSite',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Publish frontend site content to Walrus Sites API',
		defaults: { name: 'Walrus Publish Site' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Site API URL',
				name: 'siteApiUrl',
				type: 'string',
				default: '',
				placeholder: 'https://sites.walrus.xyz',
				description: 'The Walrus Sites API URL',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'The site content to publish',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const siteApiUrl = this.getNodeParameter('siteApiUrl', i) as string;
			const content = this.getNodeParameter('content', i) as string;

			try {
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: `${siteApiUrl}/publish`,
					body: { content },
					json: true,
				});

				returnData.push({
					json: {
						siteApiUrl,
						contentLength: content.length,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							siteApiUrl,
							contentLength: content.length,
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
