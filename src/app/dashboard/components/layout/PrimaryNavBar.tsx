/* eslint-disable @typescript-eslint/no-explicit-any */
import HelpIcon from "@/app/dashboard/components/ui/HelpIcon";
import Logo from "@/app/dashboard/components/ui/Logo";
import NavItem from "@/app/dashboard/components/ui/NavItem";
import Notifications, {
  Notification,
} from "@/app/dashboard/components/ui/Notifications";
import ShareIcon from "@/app/dashboard/components/ui/ShareIcon";
import WithRole, { ACTION } from "@/lib/auth/WithRole";
import User from "../ui/User";

export default function PrimaryNavBar({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <div className="bg-[#166EE1] flex items-center h-[50px] p-[20px] justify-between">
      <div className="flex items-center gap-[8px]">
        <Logo />
        <span className="text-[17px]/[24px] text-white font-[675]">
          Ess Stat Bank
        </span>

        <div>
          <NavItem label="Organization" link="/dashboard/organization" />
          <NavItem label="Data Types" link="/dashboard/field-type" />
          <NavItem label="Report Designer" link="/dashboard/template/reports" />
          <NavItem label="Import tool" link="/dashboard/reports" />
          <NavItem
            label="Publication"
            link="/dashboard/publication/list-view"
          />
          <WithRole role="ADMIN" action={ACTION.HIDE}>
            <NavItem label="User Management" link="/dashboard/users" />
          </WithRole>
        </div>
      </div>
      <div className="flex gap-[16px] items-center height-[100%]">
        <div className="flex items-center gap-[8px]">
          <HelpIcon />
          <ShareIcon />
        </div>
        <Notifications notifications={notifications} />

        <User />
      </div>
    </div>
  );
}
