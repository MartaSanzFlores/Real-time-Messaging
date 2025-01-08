import { jwtDecode } from "jwt-decode";

function Message({ senderName, date, content, status, senderId }) {

  // Get the initials of the sender
  const initials = senderName.split(' ').map((n) => n[0]).join('');

  // Get the user ID from the token
  const token = localStorage.getItem("token");
  const userId = jwtDecode(token).userId;


  return (
    <>
      <div className={"container mx-auto flex items-start gap-2.5 m-8" + (senderId == userId ? " justify-end" : "")}>
        <div className={"flex items-center justify-center text-center text-sm font-bold w-10 h-10 border-2 rounded-full" + (senderId == userId ? " border-[#633bfb] order-2" : " border-[#fbb03b] order-1")}>{initials}</div>
        <div className={"flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 dark:bg-gray-700" + (senderId == userId ? " order-1 rounded-tl-xl rounded-br-xl rounded-bl-xl" : " order-2 rounded-tr-xl rounded-br-xl rounded-bl-xl")}>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{senderName}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{date}</span>
          </div>
          <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{content}</p>
          {senderId == userId && (
            <span className="text-xs text-right text-gray-500 dark:text-gray-400">{status}</span>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
