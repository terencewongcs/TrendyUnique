import emailIcon from '../assets/email_send.svg';

const Email = () => {
  return (
    <div className="bg-white shadow rounded w-11/12 max-w-xl h-2/4 md:h-3/5 flex flex-col items-center justify-center px-16">
      <img src={emailIcon} alt="" className="w-20"/>
      <p className="text-sm md:text-base font-semibold text-center mt-2.5">We have sent the update password link to your email, please check that ！</p>
    </div>
  );
};

export default Email;