import { FaucetRequestSuccessResponse } from '../shared/models/types';
import ls from 'localstorage-slim';

const CLIENT_REQUEST_ID_PREFIX = 'alch_faucet_storage_v1_';

interface FaucetRequestItem {
  requestTime: Date;
  clientRequestId: string;
  toAddress: string;
  response: FaucetRequestSuccessResponse;
}

const FaucetLocalStorage = {
  EXPIRE_PERIOD_MILLISECONDS: 86400000,
  getRequests(): FaucetRequestItem[] {
    const items: FaucetRequestItem[] = [];
    const minRenderDate = new Date(
      Date.now() - this.EXPIRE_PERIOD_MILLISECONDS
    ).getTime();
    Object.keys(localStorage).forEach(function (key) {
      if (
        !key.includes(CLIENT_REQUEST_ID_PREFIX) ||
        !ls.get(key) ||
        typeof ls.get(key) !== 'object'
      ) {
        return;
      }
      const request: FaucetRequestItem = ls.get(key) as FaucetRequestItem;
      if (typeof request.requestTime === 'string') {
        request.requestTime = new Date(request.requestTime);
      }
      if (request.requestTime.getTime() > minRenderDate) {
        items.push(request);
      }
    });
    items.sort((a: FaucetRequestItem, b: FaucetRequestItem) => {
      return a.requestTime > b.requestTime ? -1 : 1;
    });
    return items;
  },
  addRequest(item: FaucetRequestItem): boolean {
    ls.set(item.clientRequestId, item, {
      ttl: this.EXPIRE_PERIOD_MILLISECONDS / 1000,
    });
    return true;
  },
};

export default FaucetLocalStorage;
