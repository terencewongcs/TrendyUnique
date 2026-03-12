import { Outlet } from "react-router-dom";
import Header from '../components/Header';
import Footer from "../components/Footer";
import Loading from "../components/Loading.tsx";
import Toast from "../components/Toast.tsx";
import { useAppSelector } from "../app/hooks.ts";

const App = () => {
  const showLoading = useAppSelector((state) => state.global.isLoading);
  const showToast = useAppSelector((state) => state.global.showMessage);
  const msg = useAppSelector((state) => state.global.messageText);
  const msgType = useAppSelector((state) => state.global.messageType);

  return (
    <>
      <div className="w-full h-full flex flex-col overflow-hidden">
        <Header/>
        <div className="flex-1 flex justify-center items-center overflow-y-auto">
          <Outlet/>
        </div>
        <Footer/>
      </div>
      {showLoading && <Loading />}
      {showToast && <Toast msg={msg} type={msgType}/>}
    </>
  )
}

export default App
