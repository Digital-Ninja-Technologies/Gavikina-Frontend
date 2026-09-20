import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/toast"
import { AlertTriangle, Check, Copy, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface CredentialsRevealProps {
  email: string
  password: string
  name?: string
  onDone: () => void
}

export function CredentialsReveal({
  email,
  password,
  name,
  onDone,
}: CredentialsRevealProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<
    "email" | "password" | "all" | null
  >(null)

  const copyToClipboard = async (
    text: string,
    field: "email" | "password" | "all"
  ) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.add({
        title: "Copied to clipboard",
        type: "success",
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.add({
        title: "Failed to copy",
        description: "Please copy manually from the input.",
        type: "error",
      })
    }
  }

  const handleCopyAll = () => {
    const text = [
      `Admin Account Credentials`,
      name ? `Name: ${name}` : null,
      `Email: ${email}`,
      `Password: ${password}`,
      `Login URL: ${window.location.origin}/login`,
    ]
      .filter(Boolean)
      .join("\n")

    copyToClipboard(text, "all")
  }

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* One-time Warning Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-navy">
            Copy credentials now
          </span>
          <p className="text-xs leading-relaxed text-navy/70">
            For security reasons, this password will not be shown again. Copy
            both the email and password and deliver them securely to the admin.
          </p>
        </div>
      </div>

      {/* Read-Only Fields with Copy Actions */}
      <div className="flex flex-col gap-3">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
            Admin Email
          </span>
          <div className="flex items-center justify-between rounded-xl border border-navy/10 bg-cream/40 px-3 py-2">
            <span className="truncate text-sm font-medium text-navy select-all">
              {email}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 text-navy/60 hover:text-navy"
              onClick={() => copyToClipboard(email, "email")}
            >
              {copiedField === "email" ? (
                <Check className="size-3.5 text-green" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
            Temporary Password
          </span>
          <div className="flex items-center justify-between rounded-xl border border-navy/10 bg-cream/40 px-3 py-2">
            <span className="truncate font-mono text-sm font-medium text-navy select-all">
              {showPassword ? password : "••••••••••••"}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-navy/60 hover:text-navy"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 text-navy/60 hover:text-navy"
                onClick={() => copyToClipboard(password, "password")}
              >
                {copiedField === "password" ? (
                  <Check className="size-3.5 text-green" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full gap-2 sm:w-auto"
          onClick={handleCopyAll}
        >
          {copiedField === "all" ? (
            <Check className="size-3.5 text-green" />
          ) : (
            <Copy className="size-3.5" />
          )}
          Copy All Credentials
        </Button>

        <Button
          type="button"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onDone}
        >
          Done
        </Button>
      </div>
    </div>
  )
}
