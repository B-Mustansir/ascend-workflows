import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ENSL2PrimaryNames implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS L2 Primary Names',
		name: 'ensL2PrimaryNames',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Get L2 primary names for an Ethereum address',
		defaults: { name: 'ENS L2 Primary Names' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Ethereum Address',
				name: 'address',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Ethereum address to get L2 primary names for',
			},
			{
				displayName: 'RPC URL',
				name: 'rpcUrl',
				type: 'string',
				default: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
				description: 'Ethereum JSON-RPC URL (Infura, Alchemy, etc.)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const address = this.getNodeParameter('address', i) as string;
			// const rpcUrl = this.getNodeParameter('rpcUrl', i) as string;

		let l2Names: string[] = [];

		try {
			// This is a placeholder implementation
			// In reality, you'd need to query L2 networks for primary names
			// const provider = new ethers.JsonRpcProvider(rpcUrl);
			l2Names = [];
		} catch (err) {
			l2Names = [];
		}

			returnData.push({
				json: {
					address,
					l2Names,
				},
			});
		}

		return [returnData];
	}
}
