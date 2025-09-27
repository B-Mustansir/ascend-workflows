import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';

export class FetchAiLLMStructured implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Fetch.ai LLM Structured',
    name: 'fetchAiLLMStructured',
    icon: 'file:superIntelligence.svg',
    group: ['transform'],
    version: 1,
    description: 'Call Fetch.ai LLM API with tool/function calling & structured output',
    defaults: { name: 'Fetch.ai LLM Structured' },
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
      {
        displayName: 'Tool Functions (JSON)',
        name: 'tools',
        type: 'json',
        default: '[]',
        description: 'List of tool or function definitions as standard JSON',
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
      const tools = this.getNodeParameter('tools', i) as object[];

      const body = {
        model,
        messages: [{ role: 'user', content: prompt }],
        tools,
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
