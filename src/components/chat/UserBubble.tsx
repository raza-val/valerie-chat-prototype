import { AttachmentCard, type Attachment } from './Attachments'

/** The user's question, right-aligned; any files sent with it sit just above it, right-aligned too. */
export function UserBubble({ text, files }: { text: string; files?: Attachment[] }) {
  return (
    <div className="flex flex-col items-end gap-2">
      {!!files?.length && <div className="flex max-w-[540px] flex-wrap justify-end gap-2">{files.map((f) => <AttachmentCard key={f.id} file={f} inThread />)}</div>}
      <p className="max-w-[540px] rounded-2xl rounded-br-md bg-surface px-4 py-3 shadow-hairline text-base leading-6">{text}</p>
    </div>
  )
}
