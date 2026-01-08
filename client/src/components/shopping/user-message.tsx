interface UserMessageProps {
  message: string;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end" data-testid="user-message">
      <div className="bg-gray-100 rounded-3xl px-5 py-3 max-w-md">
        <p className="text-gray-900">{message}</p>
      </div>
    </div>
  );
}
