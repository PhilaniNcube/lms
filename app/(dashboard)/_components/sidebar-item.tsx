"use client"
import {usePathname, useRouter} from "next/navigation"
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  href: string;
  label: string;
}

const SidebarItem = ({icon:Icon, href, label}:SidebarItemProps) => {

  const pathname = usePathname()
  const router = useRouter()

   const isActive =
     (pathname === "/" && href === "/") ||
     pathname === href ||
     pathname?.startsWith(`${href}/`);

    const onClick = () => {
      router.push(href)
    }

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      type="button"
      className={cn(
        "flex justify-start items-center gap-x-2 text-slate-500 text-sm font-[500] relative pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 absolute right-0 top-0 bottom-0 h-full transition-all",
          isActive && "opacity-100"
        )}
      ></div>
    </Button>
  );
};
export default SidebarItem;
