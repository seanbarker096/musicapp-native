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
    RequestParametersType: TagsCreateRequestApi;
    ResultType: TagsCreateResultApi;
    ErrorType: {};
  };
}

export interface TagsCreateRequestApi {
  tagged_entity_type: TaggedEntityType;
  tagged_entity_id: number;
  tagged_in_entity_type: TaggedInEntityType;
  tagged_in_entity_id: number;
  creator_type: TagCreatorType;
  creator_id: number;
}

export interface TagCreateRequest {
  taggedEntityType: TaggedEntityType;
  taggedEntityId: number;
  taggedInEntityType: TaggedInEntityType;
  taggedInEntityId: number;
  creatorType: TagCreatorType;
  creatorId: number;
}

export interface TagsCreateResultApi {
  tag: TagApi;
}

export interface Tag {
  id: number;
  taggedEntityType: string;
  taggedEntityId: number;
  taggedInEntityType: string;
  taggedInEntityId: number;
  creatorType: string;
  creatorId: number;
  createTime: number;
}

export interface TagApi {
  id: number;
  tagged_entity_type: TaggedEntityType;
  tagged_entity_id: number;
  tagged_in_entity_type: TaggedInEntityType;
  tagged_in_entity_id: number;
  creator_type: TagCreatorType;
  creator_id: number;
  create_time: number;
}

export enum TaggedEntityType {
  ARTIST = 'artist',
  USER = 'user',
}

export enum TaggedInEntityType {
  POST = 'post',
}

export enum TagCreatorType {
  USER = 'user',
}
