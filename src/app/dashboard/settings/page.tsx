import { SettingsGeneral } from "@/components/dashboard/settings/settingsGeneral";
import SettingsSidebar from "@/components/dashboard/settings/settingsSidebar";


export default function SettingsPage() {
  return (
    <SettingsSidebar>
        <SettingsGeneral />
    </SettingsSidebar>
  );
}