import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusWriteBlob implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Write Blob',
		name: 'walrusWriteBlob',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Upload a blob (binary data) to Walrus',
		defaults: { name: 'Walrus Write Blob' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Upload Relay Host',
				name: 'relayHost',
				type: 'string',
				default: '',
				placeholder: 'https://relay.walrus.xyz',
				description: 'Walrus relay host',
			},
			{
				displayName: 'Blob Data',
				name: 'blobData',
				type: 'string',
				default: '',
				description: 'Base64 or raw string of blob data to upload',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const relayHost = this.getNodeParameter('relayHost', i) as string;
			const blobData = this.getNodeParameter('blobData', i) as string;

			try {
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: `${relayHost}/api/writeBlob`,
					body: { data: blobData },
					json: true,
				});

				returnData.push({
					json: {
						relayHost,
						blobSize: blobData.length,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							relayHost,
							blobSize: blobData.length,
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
