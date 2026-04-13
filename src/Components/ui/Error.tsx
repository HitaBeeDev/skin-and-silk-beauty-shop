import { useRouteError } from 'react-router-dom';
import LinkButton from './LinkButton';

function hasStringProp(
  value: unknown,
  key: 'data' | 'message'
): value is Record<typeof key, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    key in value &&
    typeof (value as Record<string, unknown>)[key] === 'string'
  );
}

function Error(): JSX.Element {
  const error = useRouteError();
  const message =
    hasStringProp(error, 'data')
      ? error.data
      : hasStringProp(error, 'message')
        ? error.message
        : 'Something went wrong.';

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{message}</p>

      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
