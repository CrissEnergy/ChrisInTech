import type { SVGProps } from 'react';
import Image from 'next/image';

const HTML5 = (props: { className?: string }) => (
  <Image src="https://cdn0.iconfinder.com/data/icons/social-network-9/50/22-512.png" alt="HTML5 logo" width={32} height={32} {...props} />
);

const CSS3 = (props: { className?: string }) => (
  <Image src="https://cdn-icons-png.flaticon.com/512/919/919826.png" alt="CSS3 logo" width={32} height={32} {...props} />
);

const JavaScript = (props: { className?: string }) => (
  <Image src="https://static.vecteezy.com/system/resources/previews/027/127/560/non_2x/javascript-logo-javascript-icon-transparent-free-png.png" alt="JavaScript logo" width={32} height={32} {...props} />
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

const Git = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M22.04 8.73l-6.79-6.79a3.59 3.59 0 0 0-5.08 0l-6.79 6.79a3.59 3.59 0 0 0 0 5.08l6.79 6.79a3.59 3.59 0 0 0 5.08 0l6.79-6.79a3.59 3.59 0 0 0 0-5.08zM12 19.4a1.79 1.79 0 1 1 1.27-3.06 1.79 1.79 0 0 1-1.27 3.06zm0-8.98a1.79 1.79 0 1 1 1.27-3.06A1.79 1.79 0 0 1 12 10.42zm4.24-5.32A1.8 1.8 0 1 1 17.5 8a1.8 1.8 0 0 1-1.27-2.9zM12 14.88a.56.56 0 0 1-.56-.56v-3.23a.56.56 0 0 1 1.12 0v3.23c0 .31-.25.56-.56.56z" /></svg>
);

const Webpack = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M21.57 5.253L12.503.44l-.24-.125c-.24-.125-.599-.125-.84 0l-.239.125-9.068 4.813a.92.92 0 0 0-.457.812V17.94a.92.92 0 0 0 .457.813l9.068 4.812.24.125c.24.125.6.125.84 0l.24-.125L21.57 18.75a.92.92 0 0 0 .457-.81v-11.88a.92.92 0 0 0-.457-.81zm-9.563 15.63V11.25L5.75 8.133l6.258 3.31zm0-11.43V3.19l6.257 3.31-6.257 3.313zM4.125 16.51L12 12.19l7.875 4.31v-8.63L12 3.562l-7.875 4.32v8.625z" /></svg>
);

const Figma = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M15.5 5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" /><path d="M8.5 5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" /><path d="M8.5 13.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" /><path d="M15.5 13.5a2.5 2.5 0 1 1 5 0 2.5 2.5-0 0 1-5 0z" /><path d="M8.5 21.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0z" /></svg>
);

const RestAPI = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M6 8v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M12 12v4"/><path d="M12 20h.01"/>
  </svg>
);

const WordPress = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.182 8.448c-1.956-3.424-5.28-5.6-8.862-5.6-2.92 0-5.74 1.488-7.53 3.936L12 21.132l8.182-12.684zm-8.226 9.936c-2.52-.3-4.584-2.58-4.584-5.232 0-1.044.312-2.016.864-2.832l-3.336-5.16c-2.46 2.832-2.856 6.888-.936 10.128 1.92 3.24 5.232 5.256 8.868 5.256.072 0 .144 0 .216 0l2.352-11.412-3.444 9.252zM0 12c0-1.08.168-2.136.48-3.144L5.652 19.5c-.3.264-.624.504-.96.72-1.392.888-3.024 1.344-4.692 1.344C0 21.564 0 12 0 12zm8.59-8.4c-.048 0-.096.024-.144.024-3.552 0-6.72 2.016-8.304 5.088l6.384 9.912L13.116 0c-1.44-.384-3- R.6-4.524-.6z"/></svg>
);

export const SkillIcons = { HTML5, CSS3, JavaScript, React: ReactLogo, VueJS, NodeJS, Python, PHP, SQL, Git, Webpack, Figma, RestAPI, WordPress };
