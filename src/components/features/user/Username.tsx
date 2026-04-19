import { selectUsername } from "@/components/features/user/userSlice";
import { useAppSelector } from "@store/hooks";

function Username(): JSX.Element | null {
  const username = useAppSelector(selectUsername);

  if (!username) return null;

  return <div>{username}</div>;
}

export default Username;
