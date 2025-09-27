import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchBuildQuote implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OneInch Build Quote',
		name: 'oneInchBuildQuote',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Build quote with secrets using 1inch Fusion Plus API',
		defaults: { name: 'OneInch Build Quote' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Quote ID',
				name: 'quoteId',
				type: 'string',
				default: '',
				placeholder: 'quote-id-123',
				description: 'The quote ID to build',
			},
			{
				displayName: 'Secret Hashes',
				name: 'secretHashes',
				type: 'string',
				default: '',
				placeholder: 'hash1,hash2,hash3',
				description: 'Comma-separated list of secret hashes',
			},
			{
				displayName: 'Permit',
				name: 'permit',
				type: 'string',
				default: '',
				description: 'Optional permit data',
			},
			{
				displayName: 'Preset',
				name: 'preset',
				type: 'options',
				options: [
					{ name: 'Fast', value: 'fast' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'Slow', value: 'slow' },
				],
				default: 'fast',
				description: 'The preset for the quote',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const quoteId = this.getNodeParameter('quoteId', i) as string;
			const secretHashesString = this.getNodeParameter('secretHashes', i) as string;
			const permit = this.getNodeParameter('permit', i) as string;
			const preset = this.getNodeParameter('preset', i) as string;

			try {
				const secretHashes = secretHashesString.split(',').map(hash => hash.trim()).filter(hash => hash);
				
				const url = `https://api.1inch.dev/fusion-plus/quoter/v1.1/quote/build/evm?quoteId=${quoteId}`;
				const bodyObj: any = {
					secretsHashList: secretHashes,
					preset: preset,
				};
				
				if (permit) {
					bodyObj.permit = permit;
				}

				const response = await this.helpers.httpRequest({
					method: 'POST',
					url,
					body: bodyObj,
					json: true,
				});

				returnData.push({
					json: {
						quoteId,
						secretHashes,
						preset,
						permit: permit || null,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							quoteId,
							secretHashes: secretHashesString,
							preset,
							permit: permit || null,
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
