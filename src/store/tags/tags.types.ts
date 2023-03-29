import { StoreSlice } from 'store/store.types';

export interface TagsStoreSlice extends StoreSlice {
  Name: 'tags';
  ObjectType: Tag;
  Get: {
    RequestParametersType: TagsGetFilterApi;
    ResultType: TagsGetResultApi;
    ErrorType: {};
  };
  Post: {
    RequestBodyType: TagsCreateRequestApi;
    ResultType: TagsCreateResultApi;
    ErrorType: {};
  };
}

export interface TagsCreateRequestApi {
  tagged_entity_type: TaggedEntityType;
  tagged_entity_id: number;
  tagged_in_entity_type: TaggedInEntityType;
  tagged_in_entity_id: number;
  creator_id: number;
}

export interface TagCreateRequest {
  taggedEntityType: TaggedEntityType;
  taggedEntityId: number;
  taggedInEntityType: TaggedInEntityType;
  taggedInEntityId: number;
  creatorId: number;
}

export interface TagsCreateResultApi {
  tag: TagApi;
}

export interface Tag {
  id: number;
  taggedEntityType: TaggedEntityType;
  taggedEntityId: number;
  taggedInEntityType: TaggedInEntityType;
  taggedInEntityId: number;
  creatorId: number;
  createTime: number;
}

export interface TagApi {
  id: number;
  tagged_entity_type: TaggedEntityType;
  tagged_entity_id: number;
  tagged_in_entity_type: TaggedInEntityType;
  tagged_in_entity_id: number;
  creator_id: number;
  create_time: number;
}

export enum TaggedEntityType {
  PERFORMER = 'performer',
  USER = 'user',
  PERFORMANCE = 'performance',
}

export enum TaggedInEntityType {
  POST = 'post',
}

export interface TagsGetFilterApi {
  tagged_entity_type?: TaggedEntityType;
  tagged_entity_id?: number;
}

export interface TagsGetFilter {
  taggedEntityType?: TaggedEntityType;
  taggedEntityId?: number;
}

export interface TagsGetResultApi {
  tags: TagApi[];
}