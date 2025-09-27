import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ethers } from 'ethers';

export class ENSTextRecord implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS Text Record',
		name: 'ensTextRecord',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Get text record from ENS domain',
		defaults: { name: 'ENS Text Record' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'ENS Domain',
				name: 'domain',
				type: 'string',
				default: '',
				placeholder: 'example.eth',
				description: 'The ENS domain to get text record from',
			},
			{
				displayName: 'Text Record Key',
				name: 'key',
				type: 'string',
				default: 'description',
				placeholder: 'description',
				description: 'The text record key to retrieve',
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
			const key = this.getNodeParameter('key', i) as string;
			const rpcUrl = this.getNodeParameter('rpcUrl', i) as string;

			const provider = new ethers.JsonRpcProvider(rpcUrl);
			let textRecord: string | null = null;

			try {
				const resolver = await provider.getResolver(domain);
				if (resolver) {
					textRecord = await resolver.getText(key);
				}
			} catch (err) {
				textRecord = null;
			}

			returnData.push({
				json: {
					domain,
					key,
					textRecord,
				},
			});
		}

		return [returnData];
	}
}
