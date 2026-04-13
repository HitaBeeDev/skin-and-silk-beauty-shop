import type { ActionFunctionArgs } from 'react-router-dom';
import { useFetcher } from 'react-router-dom';

import type { Order } from '@/types';

import Button from '../../ui/Button';
import { updateOrder } from '../../services/helper';

type UpdateOrderProps = {
  order: Order;
};

function UpdateOrder({ order }: UpdateOrderProps) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({ params }: ActionFunctionArgs) {
  const data = { priority: true };
  if (params.orderId) {
    await updateOrder(params.orderId, data);
  }
  return null;
}
