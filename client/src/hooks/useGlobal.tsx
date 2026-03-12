import { useAppDispatch } from '../app/hooks.ts';
import { updateLoading, updateMessage } from '../app/slice/global.ts';

export const useGlobal = () => {
  const dispatch = useAppDispatch();

  const showLoading = (isShow: boolean) => {
    dispatch(updateLoading(isShow));
  };

  const showMessage = (msg: string, type= "failed", delay = 2000) => {
    dispatch(updateMessage({show: true, msg: msg, type: type}));
    setTimeout(() => {
      dispatch(updateMessage({show: false, msg: '', type: type}));
    }, delay);
  };

  return { showLoading, showMessage };
};
