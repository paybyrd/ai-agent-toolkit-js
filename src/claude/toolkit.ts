import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import {Configuration, isToolAllowed} from '../shared/configuration.js';
import PaybyrdAPI from '../shared/api.js';
import tools from '../shared/tools.js';

class PaybyrdAgentToolkit extends McpServer {
  private _paybyrd: PaybyrdAPI;
  
  constructor({
    apiKey,
    configuration,
  }: {
    apiKey: string;
    configuration: Configuration;
  }) {
    super({
      name: 'Paybyrd',
      version: '0.1.2'      
    });

    this._paybyrd = new PaybyrdAPI(apiKey, configuration.context);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );

    // Log which tools are being registered
    console.log('Registering the following tools:');
    filteredTools.forEach(tool => console.log(`- ${tool.name} (${tool.method})`));

    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,  // Method is the tool's ID
        tool.description,
        tool.parameters.shape,
        async (arg: any, _extra: RequestHandlerExtra) => {
          console.log(`Executing tool: ${tool.method} with args:`, JSON.stringify(arg));
          const result = await this._paybyrd.run(tool.method, arg);
          return {
            content: [
              {
                type: 'text' as const,
                text: String(result),
              },
            ],
          };
        }
      );
    });
  }
}

export default PaybyrdAgentToolkit;