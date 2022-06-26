import { Container } from 'dockerode';
export interface ICreateDockerContainerResponse {
  container: Container;
  logs: string;
}
