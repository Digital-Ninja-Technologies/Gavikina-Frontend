import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { FormInput } from "@workspace/ui/components/form-fields"
import { toast } from "@workspace/ui/components/toast"
import { Loader2 } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { closeDialog } from "@/store/dialog-store"
import { changeAdminPassword } from "../api"
import { CredentialsReveal } from "./credentials-reveal"

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

interface ResetPasswordDialogProps extends ComponentProps<typeof Dialog> {
  adminId?: string
  adminEmail?: string
  adminName?: string
}

interface ResetCredentialsState {
  email: string
  password: string
  name?: string
}

export function ResetAdminPasswordDialog({
  adminId,
  adminEmail,
  adminName,
  ...props
}: ResetPasswordDialogProps) {
  const [resetData, setResetData] = useState<ResetCredentialsState | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: changeAdminPassword,
    onSuccess: (res, variables) => {
      toast.add({
        title: "Password Updated",
        description: "Make sure to copy the new credentials.",
        type: "success",
      })

      setResetData({
        email: res?.email || adminEmail || "",
        password: variables.newPassword,
        name: adminName,
      })
    },
    onError: (error) => {
      toast.add({
        title: "Reset Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not change the administrator password.",
        type: "error",
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate({
      adminId,
      email: adminEmail,
      newPassword: values.newPassword,
    })
  })

  const handleClose = () => {
    setResetData(null)
    form.reset()
    closeDialog()
  }

  return (
    <Dialog
      {...props}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {resetData ? "Password Updated" : "Reset Admin Password"}
          </DialogTitle>
          <DialogDescription>
            {resetData
              ? "Save these updated credentials now. The password will not be shown again."
              : `Set a new password for ${adminName || adminEmail || "this admin"}. Former password is not required.`}
          </DialogDescription>
        </DialogHeader>

        {resetData ? (
          <CredentialsReveal
            name={resetData.name}
            email={resetData.email}
            password={resetData.password}
            onDone={handleClose}
          />
        ) : (
          <>
            <form
              id="reset-password-form"
              onSubmit={onSubmit}
              className="flex flex-col gap-4 py-2"
            >
              <FormInput
                control={form.control}
                name="newPassword"
                type="password"
                label="New password"
                placeholder="Minimum 6 characters"
                disabled={mutation.isPending}
              />

              <FormInput
                control={form.control}
                name="confirmPassword"
                type="password"
                label="Confirm new password"
                placeholder="Re-enter password"
                disabled={mutation.isPending}
              />
            </form>

            <DialogFooter className="flex items-center gap-2 sm:justify-end">
              <DialogClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={mutation.isPending}
                  />
                }
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                form="reset-password-form"
                size="sm"
                disabled={!form.formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
