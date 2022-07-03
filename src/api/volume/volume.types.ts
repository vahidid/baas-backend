export enum VolumeStatus {
  Created = 'created',
  Connected = 'connected',
  Mounted = 'mounted',
}

export interface ICreateVolumeArgs {
  title: string;
}
