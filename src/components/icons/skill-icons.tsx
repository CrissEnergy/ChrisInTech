import type { SVGProps } from 'react';
import Image from 'next/image';

const HTML5 = (props: { className?: string }) => (
  <Image src="https://cdn0.iconfinder.com/data/icons/social-network-9/50/22-512.png" alt="HTML5 logo" width={32} height={32} {...props} />
);

const CSS3 = (props: { className?: string }) => (
  <Image src="https://cdn-icons-png.flaticon.com/512/919/919826.png" alt="CSS3 logo" width={32} height={32} {...props} />
);

const JavaScript = (props: { className?: string }) => (
  <Image src="https://1000logos.net/wp-content/uploads/2020/09/JavaScript-Logo.png" alt="JavaScript logo" width={32} height={32} {...props} />
);

const ReactLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor" {...props}><title>React Logo</title><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>
);

const VueJS = (props: { className?: string }) => (
  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png" alt="Vue.js logo" width={32} height={32} {...props} />
);

const NodeJS = (props: { className?: string }) => (
  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/2560px-Node.js_logo.svg.png" alt="Node.js logo" width={32} height={32} {...props} />
);

const Python = (props: { className?: string }) => (
  <Image src="https://images.icon-icons.com/112/PNG/512/python_18894.png" alt="Python logo" width={32} height={32} {...props} />
);

const PHP = (props: { className?: string }) => (
  <Image src="https://cdn-icons-png.flaticon.com/512/919/919830.png" alt="PHP logo" width={32} height={32} {...props} />
);

const SQL = (props: { className?: string }) => (
  <Image src="https://icons.veryicon.com/png/o/application/designer-icon/sql-5.png" alt="SQL logo" width={32} height={32} {...props} />
);

const Git = (props: { className?: string }) => (
  <Image src="https://cdn.freebiesupply.com/logos/thumbs/2x/git-logo.png" alt="Git logo" width={32} height={32} {...props} />
);

const Webpack = (props: { className?: string }) => (
  <Image src="https://webpack.js.org/icon-pwa-512x512.934507c816afbcdb.png" alt="Webpack logo" width={32} height={32} {...props} />
);

const Figma = (props: { className?: string }) => (
  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1667px-Figma-logo.svg.png" alt="Figma logo" width={32} height={32} {...props} />
);

const RestAPI = (props: { className?: string }) => (
    <Image src="https://intrastage.com/wp-content/uploads/2019/09/rest-api-icon.png" alt="REST API logo" width={32} height={32} {...props} />
);

const WordPress = (props: { className?: string }) => (
    <Image src="https://cdn-icons-png.flaticon.com/512/174/174881.png" alt="WordPress logo" width={32} height={32} {...props} />
);

const AdobeXD = (props: { className?: string }) => (
    <Image src="https://cdn.iconscout.com/icon/free/png-256/free-adobe-xd-file-icon-svg-download-png-3516530.png" alt="Adobe XD logo" width={32} height={32} {...props} />
);

const Supabase = (props: { className?: string }) => (
    <Image src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/supabase.webp" alt="Supabase logo" width={32} height={32} {...props} />
);

const Firebase = (props: { className?: string }) => (
    <Image src="https://brandlogos.net/wp-content/uploads/2025/03/firebase_icon-logo_brandlogos.net_tcvck-512x646.png" alt="Firebase logo" width={32} height={32} {...props} />
);


export const SkillIcons = { HTML5, CSS3, JavaScript, React: ReactLogo, VueJS, NodeJS, Python, PHP, SQL, Git, Webpack, Figma, RestAPI, WordPress, AdobeXD, Supabase, Firebase };
