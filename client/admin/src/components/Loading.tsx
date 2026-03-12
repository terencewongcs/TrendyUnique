import Portal from './Portal';

const Loading = () => {
  return (
    <Portal>
      <div className="w-full h-full inset-0 fixed flex justify-center items-center flex-col">
        <div className="w-full h-full absolute inset-0 bg-black opacity-20"></div>
        <div className="animate-spin w-12 h-12 border-4 border-blue border-t-transparent rounded-circle z-10"></div>
        <p className="text-blue text-lg mt-2 z-10">Processing...</p>
      </div>
    </Portal>
  );
};

export default Loading;
