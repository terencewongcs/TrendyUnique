import youtube from '../assets/youtube.svg';
import twitter from '../assets/twitter.svg';
import facebook from '../assets/facebook-fill.svg';

const Footer = () => {
  return (
    <footer className="bg-black-common flex flex-col items-center py-5 lg:flex-row lg:justify-between lg:px-12 lg:py-7">
      <div className="flex">
        <img src={youtube} alt="" className="cursor-pointer w-7"/>
        <img src={twitter} alt="" className="cursor-pointer w-5 mx-1.5"/>
        <img src={facebook} alt="" className="cursor-pointer w-5"/>
      </div>
      <div className="py-2 lg:order-last">
        <a className="text-base font-medium text-white cursor-pointer">Contact us</a>
        <a className="text-base font-medium text-white cursor-pointer mx-3.5">Privacy Policies</a>
        <a className="text-base font-medium text-white cursor-pointer">Help</a>
      </div>
      <p className="text-base font-medium text-white lg:order-first">©2022 All Rights Reserved.</p>
    </footer>
  )
}

export default Footer;
