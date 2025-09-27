import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusFileAbstraction implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus File Abstraction',
		name: 'walrusFileAbstraction',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Create WalrusFile object (abstraction layer)',
		defaults: { name: 'Walrus File Abstraction' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				placeholder: 'example.txt',
				description: 'The name of the file',
			},
			{
				displayName: 'File Data',
				name: 'fileData',
				type: 'string',
				default: '',
				description: 'The content/data of the file',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const fileName = this.getNodeParameter('fileName', i) as string;
			const fileData = this.getNodeParameter('fileData', i) as string;

			try {
				const walrusFile = {
					fileName,
					fileData,
					createdAt: Date.now(),
					size: fileData.length,
					type: 'text/plain', // Could be enhanced to detect file type
				};

				returnData.push({ json: walrusFile });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							fileName,
							fileData: fileData.substring(0, 100) + '...',
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
