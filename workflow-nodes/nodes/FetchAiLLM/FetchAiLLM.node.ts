import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';

export class FetchAiLLM implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fetch.ai LLM',
    name: 'fetchAiLLM',
    icon: 'file:superIntelligence.svg',
    group: ['transform'],
    version: 1,
    description: 'Call Fetch.ai LLM API',
    defaults: { name: 'Fetch.ai LLM' },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Prompt',
        name: 'prompt',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'asi1-mini',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      const apiKey = this.getNodeParameter('apiKey', i) as string;
      const prompt = this.getNodeParameter('prompt', i) as string;
      const model = this.getNodeParameter('model', i) as string;

      const body = {
        model,
        messages: [{ role: 'user', content: prompt }],
      };

      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: 'https://api.asi1.ai/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
        json: true,
      });

      returnData.push({ json: response });
    }

    return this.prepareOutputData(returnData);
  }
}
