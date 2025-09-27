import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchFusion implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch Fusion',
		name: 'oneInchFusion',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Create swap transaction via 1inch API',
		defaults: { name: '1inch Fusion' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{ displayName: 'Chain ID', name: 'chainId', type: 'number', default: 1, description: 'EVM chain ID' },
			{ displayName: 'From Token', name: 'fromToken', type: 'string', default: '', description: 'Token address to swap from' },
			{ displayName: 'To Token', name: 'toToken', type: 'string', default: '', description: 'Token address to swap to' },
			{ displayName: 'Amount', name: 'amount', type: 'string', default: '', description: 'Amount in wei' },
			{ displayName: 'From Address', name: 'fromAddress', type: 'string', default: '', description: 'Wallet address initiating swap' },
			{ displayName: 'Slippage (%)', name: 'slippage', type: 'number', default: 1, description: 'Optional slippage percent' },
			{ displayName: 'Protocols', name: 'protocols', type: 'string', default: '', description: 'Optional: liquidity protocols, comma-separated' },
			{ displayName: 'Disable Estimate', name: 'disableEstimate', type: 'boolean', default: false, description: 'Skip gas estimation' },
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
			const fromAddress = this.getNodeParameter('fromAddress', i) as string;
			const slippage = this.getNodeParameter('slippage', i) as number;
			const protocols = this.getNodeParameter('protocols', i) as string;
			const disableEstimate = this.getNodeParameter('disableEstimate', i) as boolean;

			// Build query
			const qs: any = { fromTokenAddress: fromToken, toTokenAddress: toToken, amount, fromAddress };
			if (slippage) qs.slippage = slippage;
			if (protocols) qs.protocols = protocols;
			if (disableEstimate) qs.disableEstimate = true;

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `https://api.1inch.io/v5.0/${chainId}/swap`,
				qs,
			});

			returnData.push({
				json: {
					fromToken,
					toToken,
					amount,
					fromAddress,
					swapTx: response.tx,
					estimatedGas: response.estimatedGas,
					toTokenAmount: response.toTokenAmount,
				},
			});
		}

		return [returnData];
	}
}
