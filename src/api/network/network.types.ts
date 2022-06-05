import { ICreateNodeResponse } from '../node/node.types';
import { Network } from './network.entity';

export interface ICreateNetworkReponse {
  network: Network;
  nodes: ICreateNodeResponse[];
}

export interface IGetNetworkReponse {
  network: Network;
  genesis: Record<string, never>;
}
