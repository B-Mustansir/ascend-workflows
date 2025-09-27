import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ENSSubdomain implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS Subdomain',
		name: 'ensSubdomain',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Get subdomain information for an ENS domain',
		defaults: { name: 'ENS Subdomain' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'ENS Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.eth',
				description: 'The ENS domain to get subdomain information for',
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

		let subdomainInfo: any = null;

		try {
			// This is a placeholder implementation
			// In reality, you'd need to query for subdomain information
			// const provider = new ethers.JsonRpcProvider(rpcUrl);
			subdomainInfo = { domain, subdomains: [] };
		} catch (err) {
			subdomainInfo = { domain, subdomains: [], error: 'Failed to fetch subdomain info' };
		}

			returnData.push({
				json: subdomainInfo,
			});
		}

		return [returnData];
	}
}
