const Footer = () => {
  return (
    <footer className="bg-black-common flex flex-col items-center py-5 lg:flex-row lg:justify-between lg:px-12 lg:py-7">
      <p className="text-base font-medium text-white lg:order-first">©2024 TrendyUnique. All Rights Reserved.</p>
      <div className="py-2 lg:order-last">
        <a className="text-base font-medium text-white cursor-pointer">Contact us</a>
        <a className="text-base font-medium text-white cursor-pointer mx-3.5">Privacy Policies</a>
        <a className="text-base font-medium text-white cursor-pointer">Help</a>
      </div>
    </footer>
  );
};

export default Footer;
