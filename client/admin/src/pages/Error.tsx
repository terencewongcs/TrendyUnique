import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-4xl font-bold text-black-common">404</h1>
      <p className="text-gray">Page not found</p>
      <button className="bg-blue text-white rounded px-6 py-2 text-sm font-semibold"
        onClick={() => { navigate('/products'); }}>Go to Products</button>
    </div>
  );
};

export default ErrorPage;
