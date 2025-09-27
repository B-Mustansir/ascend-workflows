import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ethers } from 'ethers';

export class ENSAvatar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS Avatar',
		name: 'ensAvatar',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Retrieve avatar URI from ENS domain',
		defaults: { name: 'ENS Avatar' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'ENS Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.eth',
				description: 'The ENS domain to get avatar for',
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
			let avatar: string | null = null;

			try {
				const resolver = await provider.getResolver(domain);
				if (resolver) {
					avatar = await resolver.getText('avatar');
				}
			} catch (err) {
				// Domain not found or invalid
				avatar = null;
			}

			returnData.push({
				json: {
					domain,
					avatar,
				},
			});
		}

		return [returnData];
	}
}
