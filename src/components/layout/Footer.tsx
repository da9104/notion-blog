'use client'
// import { LogoSvg } from './header/logo-svg';
// import { ShopLinks } from './shop-links';
// import { SidebarLinks } from './sidebar/product-sidebar-links';
// import { getCollections } from '@/lib/shopify';

export function Footer() {

  return (
    <footer className="p-sides ">
      <div className="w-full md:h-[532px] h-[250px] p-sides md:p-11 text-background bg-black rounded-[12px] flex flex-col justify-between max-md:gap-8">
        <div className="flex flex-col justify-between md:flex-row">
          <p className="md:text-[10rem] text-7xl font-bold shrink-0 text-white">©DAMI UI</p>
          {/* <ShopLinks collections={collections} className="max-md:hidden" align="right" /> */}
          {/* <span className="mt-3 italic font-semibold md:hidden text-white">Refined. Minimal. Never boring.</span> */}
        </div>
        <div className="flex justify-between max-md:contents ">
          {/* <SidebarLinks className="max-w-[450px] w-full max-md:flex-col" size="base" invert /> */}
          <p className="text-base text-white">{new Date().getFullYear()} — All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
