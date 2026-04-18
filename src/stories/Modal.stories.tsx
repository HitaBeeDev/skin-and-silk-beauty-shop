import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const meta = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
    onClose: () => undefined,
    open: true,
  },
  render: () => {
    function ModalStory(): JSX.Element {
      const [open, setOpen] = useState(true);

      return (
        <div className="min-h-[60vh]">
          <Button onClick={() => setOpen(true)} type="button">
            Open modal
          </Button>
          <Modal onClose={() => setOpen(false)} open={open}>
            <Modal.Header>
              <h2 className="font-['Playfair_Display',serif] text-3xl text-[#5a4034]">
                Remove all items?
              </h2>
            </Modal.Header>
            <Modal.Body>
              <p className="text-sm leading-7 text-[#5b463d]">
                This action removes every product from the bag.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpen(false)} type="button" variant="ghost">
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)} type="button" variant="danger">
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }

    return <ModalStory />;
  },
};
