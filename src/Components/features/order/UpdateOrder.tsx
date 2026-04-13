import type { ActionFunctionArgs } from 'react-router-dom';
import { useFetcher } from 'react-router-dom';

import { updateOrder } from '@/Components/services/helper';
import Button from '@/Components/ui/Button';

function UpdateOrder(): JSX.Element {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

export async function action({
  params,
}: ActionFunctionArgs): Promise<null> {
  const data = { priority: true };
  if (params.orderId) {
    await updateOrder(params.orderId, data);
  }
  return null;
}
