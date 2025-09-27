import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class WalrusUploadRelayConfig implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Walrus Upload Relay Config',
		name: 'walrusUploadRelayConfig',
		icon: 'file:walrus.svg',
		group: ['transform'],
		version: 1,
		description: 'Setup relay host + tip configuration',
		defaults: { name: 'Walrus Upload Relay Config' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Relay Host',
				name: 'relayHost',
				type: 'string',
				default: '',
				placeholder: 'https://relay.walrus.xyz',
				description: 'The Walrus relay host URL',
			},
			{
				displayName: 'Tip',
				name: 'tip',
				type: 'number',
				default: 0,
				description: 'Optional tip for relay prioritization',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const relayHost = this.getNodeParameter('relayHost', i) as string;
			const tip = this.getNodeParameter('tip', i) as number;

			try {
				const config = {
					relayHost,
					tip,
					createdAt: Date.now(),
					priority: tip > 0 ? 'high' : 'normal',
				};

				returnData.push({ json: config });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							relayHost,
							tip,
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
