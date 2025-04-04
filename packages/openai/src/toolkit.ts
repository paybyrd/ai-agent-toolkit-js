import { 
  PaybyrdAPI, 
  tools, 
  isToolAllowed, 
  type Configuration 
} from '@paybyrd/ai-agent-toolkit';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type {
  ChatCompletionTool,
  ChatCompletionMessageToolCall,
  ChatCompletionToolMessageParam,
} from 'openai/resources';

class OpenAIAgentToolkit {
  private _paybyrd: PaybyrdAPI;
  tools: ChatCompletionTool[];

  constructor({
    authToken,
    configuration,
  }: {
    authToken: string;
    configuration: Configuration;
  }) {
    this._paybyrd = new PaybyrdAPI(authToken, configuration.context);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    this.tools = filteredTools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.method,
        description: tool.description,
        parameters: zodToJsonSchema(tool.parameters),
      },
    }));
  }

  getTools(): ChatCompletionTool[] {
    return this.tools;
  }

  /**
   * Processes a single OpenAI tool call by executing the requested function.
   *
   * @param {ChatCompletionMessageToolCall} toolCall - The tool call object from OpenAI containing
   *   function name, arguments, and ID.
   * @returns {Promise<ChatCompletionToolMessageParam>} A promise that resolves to a tool message
   *   object containing the result of the tool execution with the proper format for the OpenAI API.
   */
  async handleToolCall(toolCall: ChatCompletionMessageToolCall) {
    const args = JSON.parse(toolCall.function.arguments);
    const response = await this._paybyrd.run(toolCall.function.name, args);
    return {
      role: 'tool',
      tool_call_id: toolCall.id,
      content: response,
    } as ChatCompletionToolMessageParam;
  }
}

export default OpenAIAgentToolkit;