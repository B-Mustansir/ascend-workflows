import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OneInchWalletBalances implements INodeType {
	description: INodeTypeDescription = {
		displayName: '1inch Wallet Balances',
		name: 'oneInchWalletBalances',
		icon: 'file:oneinch.svg',
		group: ['transform'],
		version: 1,
		description: 'Fetch token balances for a wallet via 1inch API',
		defaults: { name: '1inch Wallet Balances' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{ displayName: 'Chain ID', name: 'chainId', type: 'number', default: 1 },
			{ displayName: 'Wallet Address', name: 'wallet', type: 'string', default: '', placeholder: '0x...' },
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const chainId = this.getNodeParameter('chainId', i) as number;
			const wallet = this.getNodeParameter('wallet', i) as string;

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `https://api.1inch.io/v5.0/${chainId}/wallet/balances`,
				qs: { address: wallet },
			});

			returnData.push({ json: { wallet, balances: response } });
		}

		return [returnData];
	}
}
