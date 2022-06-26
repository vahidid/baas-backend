import * as Docker from 'dockerode';

export const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export const AuthInfo = {
  username: 'vahidid',
  password: 'V@#!d1377',
};
