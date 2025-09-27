import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ENSVABackExtra implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS VA Back Extra',
		name: 'ensVABackExtra',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Get VA back extra information for ENS domain',
		defaults: { name: 'ENS VA Back Extra' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'ENS Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.eth',
				description: 'The ENS domain to get VA back extra information for',
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
			const domain = this.getNodeParameter('domain', i) as string;
			// const rpcUrl = this.getNodeParameter('rpcUrl', i) as string;

		let vaBackExtra: any = null;

		try {
			// This is a placeholder implementation
			// In reality, you'd need to query for VA back extra information
			// const provider = new ethers.JsonRpcProvider(rpcUrl);
			vaBackExtra = { domain, vaBackExtra: null };
		} catch (err) {
			vaBackExtra = { domain, vaBackExtra: null, error: 'Failed to fetch VA back extra info' };
		}

			returnData.push({
				json: vaBackExtra,
			});
		}

		return [returnData];
	}
}
