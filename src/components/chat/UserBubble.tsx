export function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[540px] rounded-[18px] rounded-br-md bg-muted px-4 py-3 text-base leading-6">{text}</p>
    </div>
  )
}
