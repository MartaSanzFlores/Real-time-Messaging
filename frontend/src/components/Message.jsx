function Message() {
    return (
      <>
        {/* Message reçu */}
        <div className="container mx-auto flex items-start gap-2.5 m-8">
          <div className="border-2 border-[#fbb03b] p-2 rounded-full">MS</div>
          <div className="flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div>
            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">That's awesome. I think our users will really appreciate the improvements.</p>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
          </div>
        </div>

        {/* Message envoyé */}
        <div className="container mx-auto flex items-start gap-2.5 justify-end m-8">
          <div className="border-2 border-[#633bfb] p-2 rounded-full order-2">MS</div>
          <div className="flex flex-col w-full max-w-[500px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-s-xl rounded-br-xl dark:bg-gray-700 order-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
            </div>
            <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">That's awesome. I think our users will really appreciate the improvements.</p>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
          </div>
        </div>
      </>
    );
  }
  
  export default Message;
  