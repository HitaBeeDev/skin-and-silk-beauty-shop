import Button from '@/components/ui/Button';

type UpdateOrderProps = {
  onUpgrade: () => void;
  disabled?: boolean;
};

function UpdateOrder({
  onUpgrade,
  disabled = false,
}: UpdateOrderProps): JSX.Element {
  return (
    <Button disabled={disabled} onClick={onUpgrade} variant="primary">
      Make priority
    </Button>
  );
}

export default UpdateOrder;
