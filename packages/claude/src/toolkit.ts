import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import {
  Configuration, 
  isToolAllowed, 
  PaybyrdAPI, 
  tools
} from '@paybyrd/ai-agent-toolkit';

class ClaudeAgentToolkit extends McpServer {
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
      version: '0.1.3'      
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

export default ClaudeAgentToolkit;