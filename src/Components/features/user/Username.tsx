import { useAppSelector } from '@/store/hooks';

function Username(): JSX.Element | null {
  const username = useAppSelector((state) => state.user.username);

  if (!username) return null;

  return (
    <div>{username}</div>
  );
}

export default Username;
