import type { ActionFunctionArgs } from 'react-router-dom';
import { useFetcher } from 'react-router-dom';

import { upgradeOrderPriority } from '@/components/features/order/ordersSlice';
import Button from '@/components/ui/Button';
import store from '@store';

function UpdateOrder(): JSX.Element {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH">
      <Button variant="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({
  params,
}: ActionFunctionArgs): Promise<null> {
  if (params.orderId) {
    await store.dispatch(upgradeOrderPriority(params.orderId)).unwrap();
  }
  return null;
}
