import Image from 'next/image';

export const Whatsapp = ({ className }: { className?: string }) => (
  <Image
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png"
    alt="WhatsApp Icon"
    width={24}
    height={24}
    className={className}
  />
);
