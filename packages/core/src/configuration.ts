import type {Tool} from './tools.js';

// Actions restrict the subset of API calls that can be made.
// Setting a permission to false prevents the related "tool" from being considered.
export type Object = 'paymentLinks' | 'refunds' | 'order';

export type Permission = 'create' | 'read';

export type Actions = {
  [K in Object]?: {
    [K in Permission]?: boolean;
  };
};


// Context are settings that are applied to all requests made by the integration.
export type Context = {
  // Optional custom configuration
  baseUrl?: string;
};

// Configuration provides various settings and options for the integration
// to tune and manage how it behaves.
export type Configuration = {
  actions?: Actions;
  context?: Context;
};

export const isToolAllowed = (
  tool: Tool,
  configuration: Configuration
): boolean => {
  return Object.keys(tool.actions).every((resource) => {
    // For each resource.permission pair, check the configuration.
    // @ts-ignore
    const permissions = tool.actions[resource];

    return Object.keys(permissions).every((permission) => {
      // @ts-ignore
      return configuration.actions?.[resource]?.[permission] === true;
    });
  });
};