import api from './api';

export const serverStatus = () => {
  return api.get('/status/server');
};

export const dataBaseStatus = () => {
  return api.get('/status/mongo');
};
