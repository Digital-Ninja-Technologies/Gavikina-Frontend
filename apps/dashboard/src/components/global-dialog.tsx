import { useSelector } from "@tanstack/react-store"
import { AdminDialog } from "@/modules/admins/components/admin-dialog"
import { ResetAdminPasswordDialog } from "@/modules/admins/components/reset-password-dialog"
import { ApplianceDialog } from "@/modules/calculator-settings/components/appliance-dialog"
import { TierDialog } from "@/modules/calculator-settings/components/tier-dialog"
import { ProjectDialog } from "@/modules/projects/components/project-dialog"
import { closeDialog, dialogStore, resetDialog } from "@/store/dialog-store"

export function GlobalDialog() {
  const { isOpen, view, data } = useSelector(dialogStore, (state) => state)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog()
      setTimeout(() => {
        resetDialog()
      }, 300)
    }
  }

  if (!view) return null

  switch (view) {
    case "PROJECT_FORM":
      return (
        <ProjectDialog
          open={isOpen}
          onOpenChange={handleOpenChange}
          projectId={data?.projectId}
        />
      )

    case "APPLIANCE_FORM":
      return (
        <ApplianceDialog
          open={isOpen}
          onOpenChange={handleOpenChange}
          applianceId={data?.applianceId}
        />
      )

    case "TIER_FORM":
      return (
        <TierDialog
          open={isOpen}
          onOpenChange={handleOpenChange}
          tierId={data?.tierId}
        />
      )

    case "ADMIN_FORM":
      return <AdminDialog open={isOpen} onOpenChange={handleOpenChange} />

    case "RESET_ADMIN_PASSWORD":
      return (
        <ResetAdminPasswordDialog
          open={isOpen}
          onOpenChange={handleOpenChange}
          adminId={data?.adminId}
          adminEmail={data?.adminEmail}
          adminName={data?.adminName}
        />
      )

    default:
      return null
  }
}
