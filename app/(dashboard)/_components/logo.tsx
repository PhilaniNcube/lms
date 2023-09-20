import Image from 'next/image'

const Logo = () => {
  return <Image src="/images/logo.png" alt="logo" width={200} height={200} className="h-16 w-16" />;
};
export default Logo;
