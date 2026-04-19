import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type ClearCartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function ClearCartModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearCartModalProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <h2 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
          Remove all items from your cart?
        </h2>
      </Modal.Header>
      <Modal.Body>
        <p className="text-sm leading-7 text-[#5b463d]">
          This will clear your bag and remove every product from the order
          summary.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} type="button" variant="ghost">
          Cancel
        </Button>
        <Button onClick={onConfirm} type="button" variant="danger">
          Clear Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ClearCartModal;
