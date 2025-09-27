import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchLimitOrder implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch Limit Order',
		name: 'oneInchLimitOrder',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Create limit orders via 1inch Limit Order Protocol',
		defaults: { name: '1inch Limit Order' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Maker Token Address',
				name: 'makerToken',
				type: 'string',
				default: '',
				description: 'Address of the token the maker is selling',
			},
			{
				displayName: 'Taker Token Address',
				name: 'takerToken',
				type: 'string',
				default: '',
				description: 'Address of the token the maker is buying',
			},
			{
				displayName: 'Maker Amount',
				name: 'makerAmount',
				type: 'string',
				default: '',
				description: 'Amount of maker token to sell (in wei)',
			},
			{
				displayName: 'Taker Amount',
				name: 'takerAmount',
				type: 'string',
				default: '',
				description: 'Amount of taker token to buy (in wei)',
			},
			{
				displayName: 'Expiry Timestamp',
				name: 'expiry',
				type: 'number',
				default: 0,
				description: 'Timestamp when the order expires',
			},
			{
				displayName: 'Wallet Signature',
				name: 'signature',
				type: 'string',
				default: '',
				description: 'EIP-712 signature from the maker\'s wallet',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const makerToken = this.getNodeParameter('makerToken', i) as string;
			const takerToken = this.getNodeParameter('takerToken', i) as string;
			const makerAmount = this.getNodeParameter('makerAmount', i) as string;
			const takerAmount = this.getNodeParameter('takerAmount', i) as string;
			const expiry = this.getNodeParameter('expiry', i) as number;
			const signature = this.getNodeParameter('signature', i) as string;

			// Construct the limit order data
			const order = {
				makerToken,
				takerToken,
				makerAmount,
				takerAmount,
				expiry,
				signature,
			};

			// Here, you would typically send the order to the 1inch Limit Order Protocol contract
			// For the sake of this example, we'll simulate a response
			const response = {
				orderId: '0x1234567890abcdef',
				status: 'Pending',
				txData: '0xabcdef1234567890',
			};

			returnData.push({
				json: {
					order,
					response,
				},
			});
		}

		return [returnData];
	}
}
