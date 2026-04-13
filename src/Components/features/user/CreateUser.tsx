import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { updateName } from '@/Components/features/user/userSlice';
import Button from '@/Components/ui/Button';
import { useAppDispatch } from '@/store/hooks';

function CreateUser(): JSX.Element {
  const [username, setUsername] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username) return;
    dispatch(updateName(username));
    navigate('/products-list');
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        👋 Welcome! Please start by telling us your name:
      </p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {username !== "" && (
        <div>
          <Button variant="primary" type="submit">
            Start ordering
          </Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
