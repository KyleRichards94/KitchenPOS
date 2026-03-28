export { ApiError, apiFetch, healthCheck, parseApiError } from './client';
export type { ApiFetchOptions, ApiResult } from './client';
export { fetchMe, login, logout } from './auth';
export type { AuthUser, LoginResponse, MeResponse, UserRole } from './auth';

//API EXPORTS

//Users
export {
    CreateUser,
    GetUser,
    GetUsers
} from './client.users';

export type { GetUsersResponse } from './client.users';

// Tagging
export {
    CreateTagType,
    GetTagTypes,
    GetTagType,
    UpdateTagType,
    DeleteTagType,
    CreateTag,
    GetTags,
    GetTag,
    UpdateTag,
    DeleteTag
} from './client.tags'

export type {
    CreateTagTypeRequest,
    CreateTagTypeResponse,
    GetTagTypesResponse,
    UpdateTagTypeRequest,
    CreateTagRequest,
    CreateTagResponse,
    GetTagResponse,
    UpdateTagRequest
} from './client.tags'

export type {
    Tag
} from './client.domainEntities'