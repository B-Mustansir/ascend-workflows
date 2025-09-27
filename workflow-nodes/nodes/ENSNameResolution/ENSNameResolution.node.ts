import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ethers } from 'ethers';

export class ENSNameResolution implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS Name Resolution',
		name: 'ensNameResolution',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Resolve ENS domain to Ethereum address',
		defaults: { name: 'ENS Name Resolution' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'ENS Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.eth',
				description: 'The ENS domain to resolve',
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
			const rpcUrl = this.getNodeParameter('rpcUrl', i) as string;

			const provider = new ethers.JsonRpcProvider(rpcUrl);

			let resolvedAddress: string | null = null;

			try {
				resolvedAddress = await provider.resolveName(domain);
			} catch (err) {
				// ENS not registered or invalid
				resolvedAddress = null;
			}

			returnData.push({
				json: {
					domain,
					address: resolvedAddress,
				},
			});
		}

		return [returnData];
	}
}
