import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchPriceFeed implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch Price Feed',
		name: 'oneInchPriceFeed',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch token price quotes via 1inch API',
		defaults: { name: '1inch Price Feed' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{ displayName: 'Chain ID', name: 'chainId', type: 'number', default: 1 },
			{ displayName: 'From Token', name: 'fromToken', type: 'string', default: '', placeholder: 'Token address' },
			{ displayName: 'To Token', name: 'toToken', type: 'string', default: '', placeholder: 'Token address' },
			{ displayName: 'Amount', name: 'amount', type: 'string', default: '1000000000000000000', description: 'Amount in wei (default 1 token)' },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const chainId = this.getNodeParameter('chainId', i) as number;
			const fromToken = this.getNodeParameter('fromToken', i) as string;
			const toToken = this.getNodeParameter('toToken', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `https://api.1inch.io/v5.0/${chainId}/quote`,
				qs: { fromTokenAddress: fromToken, toTokenAddress: toToken, amount },
			});

			returnData.push({
				json: {
					fromToken,
					toToken,
					amount,
					toTokenAmount: response.toTokenAmount,
				},
			});
		}

		return [returnData];
	}
}
