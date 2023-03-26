import {
  Performer,
  PerformerApi,
  PerformerSearchPerformer,
  PerformerSearchPerformerApi,
} from './performers.types';

export function transformPerformerSearchPerformerApi(
  performerSearchPerformerApi: PerformerSearchPerformerApi,
): PerformerSearchPerformer {
  return {
    uuid: performerSearchPerformerApi.uuid,
    name: performerSearchPerformerApi.name,
    imageUrl: performerSearchPerformerApi.image_url,
  };
}

export function transformPerformerApi(performerApi: PerformerApi): Performer {
  return {
    id: performerApi.id,
    uuid: performerApi.uuid,
    name: performerApi.name,
    biography: performerApi.biography,
    createTime: performerApi.create_time,
    updateTime: performerApi.update_time,
    ownerId: performerApi.owner_id,
    imageUrl: performerApi.image_url,
  };
}
