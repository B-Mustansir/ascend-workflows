import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { ethers } from 'ethers';

export class ENSPrimaryName implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ENS Primary Name',
		name: 'ensPrimaryName',
		icon: 'file:ens.svg',
		group: ['transform'],
		version: 1,
		description: 'Get primary ENS name for an Ethereum address',
		defaults: { name: 'ENS Primary Name' },
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Ethereum Address',
				name: 'address',
				type: 'string',
				default: '',
				placeholder: '0x1234...abcd',
				description: 'The Ethereum address to resolve to a primary ENS name',
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
			const rpcUrl = this.getNodeParameter('rpcUrl', i) as string;

			const provider = new ethers.JsonRpcProvider(rpcUrl);
			let primaryName: string | null = null;

			try {
				primaryName = await provider.lookupAddress(address);
			} catch (err) {
				// Address not found or invalid
				primaryName = null;
			}

			returnData.push({
				json: {
					address,
					primaryName,
				},
			});
		}

		return [returnData];
	}
}
