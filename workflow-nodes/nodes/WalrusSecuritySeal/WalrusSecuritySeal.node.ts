import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusSecuritySeal implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Security Seal',
		name: 'walrusSecuritySeal',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Encrypt or apply access policies using Walrus Seal',
		defaults: { name: 'Walrus Security Seal' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: [
					{ name: 'Encrypt', value: 'encrypt' },
					{ name: 'Decrypt', value: 'decrypt' },
				],
				default: 'encrypt',
				description: 'The action to perform on the data',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				default: '',
				description: 'The data to encrypt or decrypt',
			},
			{
				displayName: 'Policy / Key',
				name: 'policyKey',
				type: 'string',
				default: '',
				description: 'The encryption key or access policy',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const action = this.getNodeParameter('action', i) as string;
			const data = this.getNodeParameter('data', i) as string;
			const policyKey = this.getNodeParameter('policyKey', i) as string;

			try {
				// Stubbed example – replace with real Walrus Seal API
				const response = {
					action,
					processedData: `${action}:${data}`,
					key: policyKey,
					timestamp: Date.now(),
				};

				returnData.push({ json: response });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							action,
							data: data.substring(0, 100) + '...',
							policyKey,
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
