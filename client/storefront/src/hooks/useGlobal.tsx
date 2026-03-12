import { useAppDispatch } from '../app/hooks';
import { updateLoading, updateMessage } from '../app/slice/global';

export const useGlobal = () => {
  const dispatch = useAppDispatch();

  const showLoading = (isShow: boolean) => {
    dispatch(updateLoading(isShow));
  };

  const showMessage = (msg: string, type = 'failed', delay = 2000) => {
    dispatch(updateMessage({ show: true, msg, type }));
    setTimeout(() => {
      dispatch(updateMessage({ show: false, msg: '', type }));
    }, delay);
  };

  return { showLoading, showMessage };
};
