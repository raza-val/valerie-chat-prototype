export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[540px] rounded-2xl rounded-br-md bg-surface px-4 py-3 shadow-hairline text-base leading-6">{text}</p>
    </div>
  )
}
