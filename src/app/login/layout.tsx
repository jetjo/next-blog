export default function Layout({ children }: any) {
  return (
    <div className="px-7 flex flex-col place-items-end justify-around h-screen">
      <div className=" w-96 p-5  ring-red-50  bg-gray-100 dark:bg-gray-50 rounded">
        {children}
      </div>
    </div>
  );
}
