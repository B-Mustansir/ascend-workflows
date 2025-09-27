import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchTokenMetadata implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch Token Metadata',
		name: 'oneInchTokenMetadata',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch token metadata via 1inch API',
		defaults: { name: '1inch Token Metadata' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{ displayName: 'Chain ID', name: 'chainId', type: 'number', default: 1 },
			{ displayName: 'Token IDs / Addresses', name: 'tokens', type: 'string', default: '', placeholder: 'Comma-separated token addresses' },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const chainId = this.getNodeParameter('chainId', i) as number;
			const tokens = (this.getNodeParameter('tokens', i) as string).split(',').map(t => t.trim());

			const metadataResponse = await this.helpers.httpRequest({
				method: 'GET',
				url: `https://api.1inch.io/v5.0/${chainId}/tokens`,
			});

			const data: any = {};
			for (const token of tokens) {
				const tokenData = metadataResponse.tokens[token.toLowerCase()];
				if (!tokenData) {
					data[token] = { error: 'Token not found on this chain' };
				} else {
					data[token] = {
						symbol: tokenData.symbol,
						decimals: tokenData.decimals,
						logoURI: tokenData.logoURI,
					};
				}
			}

			returnData.push({ json: { chainId, data } });
		}

		return [returnData];
	}
}
