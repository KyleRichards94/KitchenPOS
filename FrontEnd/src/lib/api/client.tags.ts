import type { UUID } from "crypto";
import { apiFetch, ApiRequest } from "./client";

// Tag Types
export type CreateTagTypeRequest = {
    name: string,
    color: string
}

export type CreateTagTypeResponse = {
    name: string;
    id: string | UUID;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
}

export type GetTagTypesResponse = {
    tags: {
        name: string;
        id: string | UUID;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
        tagTypeId: string;
    }[];
    name: string;
    id: string | UUID;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
}

export type UpdateTagTypeRequest = {
    id: string | UUID,
    name?: string,
    color?: string
}

export async function CreateTagType(request: CreateTagTypeRequest): Promise<CreateTagTypeResponse> {
    return apiFetch<CreateTagTypeResponse>('/tagtypes/', ApiRequest.POST, { body: JSON.stringify(request) })
}

export async function GetTagTypes(): Promise<GetTagTypesResponse[]> {
    return apiFetch<GetTagTypesResponse[]>('/tagtypes/', ApiRequest.GET)
}

export async function GetTagType(id: string | UUID): Promise<GetTagTypesResponse> {
    return apiFetch<GetTagTypesResponse>(`/tagtypes/${id}`, ApiRequest.GET)
}

export async function UpdateTagType(request: UpdateTagTypeRequest): Promise<GetTagTypesResponse> {
    return apiFetch<GetTagTypesResponse>(`/tagtypes/${request.id}`, ApiRequest.PUT, { body: JSON.stringify({ color: request.color, name: request.name }) })
}

export async function DeleteTagType(id: string | UUID): Promise<{ ok: boolean }> {
    return apiFetch<{ ok: boolean }>(`/tagtypes/${id}`, ApiRequest.DELETE)
}

// Tags 
export type CreateTagRequest = {
    name: string;
    color: string | null;
    tagTypeId: string | UUID;
}

export type CreateTagResponse = {
    tagType: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    tagTypeId: string;
}

export type GetTagResponse = {
    tagType: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        color: string | null;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    color: string | null;
    tagTypeId: string;
}

export type UpdateTagRequest = {
    id: string | UUID;
    name: string | null;
    color: string | null;
    tagTypeId: string | UUID | null;
}

export async function CreateTag(request: CreateTagRequest): Promise<CreateTagResponse> {
    return apiFetch<CreateTagResponse>('/tags/', ApiRequest.POST, { body: JSON.stringify(request) })
}

export async function GetTags(): Promise<GetTagResponse[]> {
    return apiFetch<GetTagResponse[]>('/tags/', ApiRequest.GET)
}

export async function GetTag(id: string | UUID): Promise<GetTagResponse> {
    return apiFetch<GetTagResponse>(`/tags/${id}`, ApiRequest.GET)
}

export async function UpdateTag(request: UpdateTagRequest): Promise<GetTagResponse> {
    return apiFetch<GetTagResponse>(`/tags/${request.id}`, ApiRequest.PUT, { body: JSON.stringify({ colour: request.color, name: request.name }) })
}

export async function DeleteTag(id: string | UUID): Promise<{ ok: boolean }> {
    return apiFetch<{ ok: boolean }>(`/tags/${id}`, ApiRequest.DELETE)
}
