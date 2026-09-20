import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
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
import { createAdmin } from "../api"
import { adminsKeys } from "../query-options"
import { CredentialsReveal } from "./credentials-reveal"

const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type CreateAdminFormValues = z.infer<typeof createAdminSchema>

interface CreatedAdminState {
  name: string
  email: string
  password: string
}

export function AdminDialog(props: ComponentProps<typeof Dialog>) {
  const queryClient = useQueryClient()
  const [createdAdmin, setCreatedAdmin] = useState<CreatedAdminState | null>(
    null
  )

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const mutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: (data, variables) => {
      toast.add({
        title: "Admin Created",
        description: "Account created. Make sure to copy the credentials.",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: adminsKeys.all })

      // Use returned password or fallback to entered password
      const returnedPassword =
        (data as unknown as { password?: string })?.password ||
        variables.password
      setCreatedAdmin({
        name: data.name,
        email: data.email,
        password: returnedPassword,
      })
    },
    onError: (error) => {
      toast.add({
        title: "Failed to Add Admin",
        description:
          error instanceof Error
            ? error.message
            : "Could not create admin account.",
        type: "error",
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  const handleClose = () => {
    setCreatedAdmin(null)
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
            {createdAdmin ? "Account Created" : "Add Platform Admin"}
          </DialogTitle>
          <DialogDescription>
            {createdAdmin
              ? "Save these credentials now. This is the only time the password is displayed."
              : "Create a new administrator account with dashboard access."}
          </DialogDescription>
        </DialogHeader>

        {createdAdmin ? (
          <CredentialsReveal
            name={createdAdmin.name}
            email={createdAdmin.email}
            password={createdAdmin.password}
            onDone={handleClose}
          />
        ) : (
          <>
            <form
              id="create-admin-form"
              onSubmit={onSubmit}
              className="flex flex-col gap-4 py-2"
            >
              <FormInput
                control={form.control}
                name="name"
                label="Full name"
                placeholder="e.g. Samuel Okon"
                disabled={mutation.isPending}
              />

              <FormInput
                control={form.control}
                name="email"
                type="email"
                label="Work email"
                placeholder="admin@gavikina.com"
                disabled={mutation.isPending}
              />

              <FormInput
                control={form.control}
                name="password"
                type="password"
                label="Initial password"
                placeholder="Minimum 6 characters"
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
                form="create-admin-form"
                size="sm"
                disabled={!form.formState.isValid || mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" /> Adding...
                  </span>
                ) : (
                  "Add Admin"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
