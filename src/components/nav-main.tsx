"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { routes } from "@/app/routes";
import { Building2, CreditCard, FileText, Users } from "lucide-react";
import Link from "next/link";

export function NavMain() {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const menus = [
    {
      label: "Factures",
      href: routes.invoice(),
      Icon: FileText,
      active: pathname.startsWith(routes.invoice()),
    },
    {
      label: "Clients",
      href: routes.client(),
      Icon: Users,
      active: pathname.startsWith(routes.client()),
    },
    {
      label: "Prestataires",
      href: routes.provider(),
      Icon: Building2,
      active: pathname.startsWith(routes.provider()),
    },
    {
      label: "Modes de paiement",
      href: routes.paymentMode(),
      Icon: CreditCard,
      active: pathname.startsWith(routes.paymentMode()),
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {menus.map((el) => (
            <SidebarMenuItem key={el.label}>
              <SidebarMenuButton
                asChild
                isActive={el.active}
                tooltip={el.label}
                onClick={() => setOpenMobile(false)}
              >
                <Link href={el.href}>
                  <el.Icon className="h-4 w-4" />
                  {el.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
