//@see https://github.com/nestjs/nest/blob/master/packages/common/constants.ts

export const MODULE_METADATA = {
    IMPORTS: 'imports',
    PROVIDERS: 'providers',
    CONTROLLERS: 'controllers',
    EXPORTS: 'exports',
};

export const MODULE_PATH = '__module_path__';
export const HOST_METADATA = 'host';
export const PATH_METADATA = 'path';
export const METHOD_METADATA = 'method';
export const OPTIONS_METADATA = "options";
export const SCOPE_OPTIONS_METADATA = 'scope:options';
export const INJECTABLE_METADATA = "injectable";
export const CUSTOM_MEDATADA = "scope:metadata";
export const GUARDS_METADATA = "__guards__";
export const REDIRECT_METADATA = "redirect";

export const GLOBAL_MODULE_METADATA = '__module:global__';
export const PARAMTYPES_METADATA = 'design:paramtypes';
export const SELF_DECLARED_DEPS_METADATA = 'self:paramtypes';
export const OPTIONAL_DEPS_METADATA = 'optional:paramtypes';
export const PROPERTY_DEPS_METADATA = 'self:properties_metadata';
export const OPTIONAL_PROPERTY_DEPS_METADATA = 'optional:properties_metadata';
export const ROUTE_ARGS_METADATA = '__routeArguments__';
export const CUSTOM_ROUTE_ARGS_METADATA = '__customRouteArgs__';
export const FILTER_CATCH_EXCEPTIONS = '__filterCatchExceptions__';

export const PIPES_METADATA = '__pipes__';
export const INTERCEPTORS_METADATA = '__interceptors__';
export const EXCEPTION_FILTERS_METADATA = '__exceptionFilters__';
export const ENHANCER_KEY_TO_SUBTYPE_MAP = {
  [GUARDS_METADATA]: 'guard',
  [INTERCEPTORS_METADATA]: 'interceptor',
  [PIPES_METADATA]: 'pipe',
  [EXCEPTION_FILTERS_METADATA]: 'filter',
} as const;

export const MESSAGE_MAPPING_METADATA = 'websockets:message_mapping';
export const MESSAGE_METADATA = 'message';
export const GATEWAY_SERVER_METADATA = 'websockets:is_socket';
export const GATEWAY_METADATA = 'websockets:is_gateway';
export const NAMESPACE_METADATA = 'namespace';
export const PORT_METADATA = 'port';
export const GATEWAY_OPTIONS = 'websockets:gateway_options';
export const PARAM_ARGS_METADATA = ROUTE_ARGS_METADATA;

export type EnhancerSubtype =
  (typeof ENHANCER_KEY_TO_SUBTYPE_MAP)[keyof typeof ENHANCER_KEY_TO_SUBTYPE_MAP];

export const RENDER_METADATA = '__renderTemplate__';
export const HTTP_CODE_METADATA = '__httpCode__';
export const HEADERS_METADATA = '__headers__';
export const RESPONSE_PASSTHROUGH_METADATA = '__responsePassthrough__';
export const SSE_METADATA = '__sse__';
export const VERSION_METADATA = '__version__';
export const INJECTABLE_WATERMARK = '__injectable__';
export const CONTROLLER_WATERMARK = '__controller__';
export const CATCH_WATERMARK = '__catch__';
export const ENTRY_PROVIDER_WATERMARK = '__entryProvider__';

export const CONNECTION_EVENT = 'connection';
export const DISCONNECT_EVENT = 'disconnect';
export const CLOSE_EVENT = 'close';
export const ERROR_EVENT = 'error';