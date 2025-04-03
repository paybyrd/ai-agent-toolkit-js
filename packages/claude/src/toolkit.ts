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
    authToken,
    configuration,
  }: {
    authToken: string;
    configuration: Configuration;
  }) {
    super({
      name: 'paybyrd',
      version: '0.1.0'      
    });

    this._paybyrd = new PaybyrdAPI(authToken, configuration.context);

    const filteredTools = tools.filter((tool) =>
      isToolAllowed(tool, configuration)
    );    

    filteredTools.forEach((tool) => {
      this.tool(
        tool.method,  // Method is the tool's ID
        tool.description,
        tool.parameters.shape,
        async (arg: any, _extra: RequestHandlerExtra) => {
          
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