import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CartItem } from "@/types";

type DeleteItemProps = {
  product: CartItem;
  onRemove: () => void;
};

function DeleteItem({ product, onRemove }: DeleteItemProps): JSX.Element {
  return (
    <button
      aria-label={`Remove ${product.name}`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#8d6a5c] transition-colors duration-150 ease-in hover:bg-[#f8efe7] hover:text-[#5a4034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5a4034] focus-visible:ring-offset-2"
      onClick={onRemove}
      type="button"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
  );
}

export default DeleteItem;
