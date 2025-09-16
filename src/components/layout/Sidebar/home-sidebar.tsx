import { ShopLinks } from '@/app/shop-links';

export function HomeSidebar() {
  return (
    <aside className="max-md:hidden col-span-4 h-screen sticky top-0 p-sides pt-top-spacing flex flex-col justify-between">
      <div>
        <p className="italic tracking-tighter text-base"></p>
        <div className="mt-25 text-xs leading-tight">
        <p>- Awarded 1st Prize at the Open Source Contest Korea 2024</p> 
        <p>- Regex Technical Code Writer - Python Machine Learning (한국어) @Tech Mahindra </p>  
        <p>- BSc Software Development for Business @Glasgow Caledonian University 2023</p>
        <p>- World Skill UK National Finalist Web Design & Web Development 2021</p>
        </div>
      </div>
      <ShopLinks className="pb-10" />
    </aside>
  );
}
