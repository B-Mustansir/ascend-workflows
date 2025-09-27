import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchGetQuote implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OneInch Get Quote',
		name: 'oneInchGetQuote',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Get quote from 1inch API',
		defaults: { name: 'OneInch Get Quote' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'From Token',
				name: 'fromToken',
				type: 'string',
				default: '',
				placeholder: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
				description: 'The source token address (use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for ETH)',
			},
			{
				displayName: 'To Token',
				name: 'toToken',
				type: 'string',
				default: '',
				placeholder: '0x0000000000000000000000000000000000000000',
				description: 'The destination token address',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'string',
				default: '',
				placeholder: '1000000000000000000',
				description: 'The amount to swap (in wei)',
			},
			{
				displayName: 'From Address',
				name: 'fromAddress',
				type: 'string',
				default: '',
				placeholder: '0xYourAddressHere',
				description: 'The wallet address making the swap',
			},
			{
				displayName: 'Slippage',
				name: 'slippage',
				type: 'string',
				default: '1',
				description: 'Slippage tolerance percentage',
			},
			{
				displayName: 'Disable Estimate',
				name: 'disableEstimate',
				type: 'options',
				options: [
					{ name: 'False', value: 'false' },
					{ name: 'True', value: 'true' },
				],
				default: 'false',
				description: 'Whether to disable estimation',
			},
			{
				displayName: 'Referrer Address',
				name: 'referrerAddress',
				type: 'string',
				default: '',
				description: 'Optional referrer address for commission',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const fromToken = this.getNodeParameter('fromToken', i) as string;
			const toToken = this.getNodeParameter('toToken', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const fromAddress = this.getNodeParameter('fromAddress', i) as string;
			const slippage = this.getNodeParameter('slippage', i) as string;
			const disableEstimate = this.getNodeParameter('disableEstimate', i) as string;
			const referrerAddress = this.getNodeParameter('referrerAddress', i) as string;

			try {
				const url = 'https://api.1inch.dev/v1.1/quote/receive';
				const params = new URLSearchParams({
					fromToken,
					toToken,
					amount,
					fromAddress,
					slippage,
					disableEstimate,
					referrerAddress: referrerAddress || '',
				});

				const response = await this.helpers.httpRequest({
					method: 'GET',
					url: `${url}?${params.toString()}`,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
				});

				returnData.push({
					json: {
						fromToken,
						toToken,
						amount,
						fromAddress,
						slippage,
						disableEstimate,
						referrerAddress: referrerAddress || null,
						...response,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							fromToken,
							toToken,
							amount,
							fromAddress,
							slippage,
							disableEstimate,
							referrerAddress: referrerAddress || null,
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
