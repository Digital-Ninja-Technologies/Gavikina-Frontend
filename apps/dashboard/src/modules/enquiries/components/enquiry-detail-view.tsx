import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { Bot, Download, FileText, Info, Mail, Phone, Zap } from "lucide-react"
import type { Lead } from "#/lib/data"
import { naira } from "#/lib/data"
import { csvFor, download } from "#/lib/utils"
import { enquiryDetailQueryOptions } from "@/modules/enquiries/query-options"

function fieldsFor(open: Lead): [string, string][] {
  const fields: [string, string][] = []
  if (open.type === "Customer") {
    fields.push(["Property type", open.property || ""])
    fields.push(["Reason for solar", open.reason || "Not given"])
    fields.push([
      "What should the system power?",
      open.appliances?.length
        ? open.appliances.map((a) => a[0]).join(", ")
        : "Not reached",
    ])
    fields.push(["Backup duration", open.backup || "Not reached"])
    fields.push([
      "Monthly fuel spend",
      open.fuel ? naira(open.fuel) : "Not reached",
    ])
    fields.push(["Preferred payment", open.payment || "Not reached"])
    fields.push([
      "Site inspection",
      open.completed
        ? open.inspection
          ? "Requested"
          : "Not requested"
        : "Not reached",
    ])
    fields.push([
      "Phone",
      open.phone || "Not captured (dropped before contact step)",
    ])
    fields.push(["Email", open.email || "Not captured"])
  } else if (open.type === "Agent") {
    fields.push(["Location", open.area || ""])
    fields.push(["Occupation", open.occupation || ""])
    fields.push(["Phone", open.phone || ""])
    fields.push(["Email", open.email || ""])
    fields.push(["Why they applied", open.reason || ""])
  } else if (open.type === "Career") {
    fields.push(["Applying for", open.role || ""])
    fields.push(["Location", open.area || ""])
    fields.push(["Phone", open.phone || ""])
    fields.push(["Email", open.email || ""])
    fields.push([
      "CV",
      open.cv ? `(download available below)` : "Not attached",
    ])
    fields.push(["Relevant experience", open.about || ""])
  } else if (open.type === "Investor") {
    fields.push(["Phone", open.phone || "Not given"])
    fields.push(["Email", open.email || "Not given"])
    fields.push(["What they are looking for", open.message || ""])
  } else {
    fields.push(["Email or phone", open.contact || "Not given"])
    fields.push(["Message", open.message || ""])
  }
  fields.push(["Received", open.when])
  return fields
}

export function EnquiryDetailContent({
  id,
  view,
}: {
  id: string
  view: string
}) {
  const { data: open } = useSuspenseQuery(enquiryDetailQueryOptions(id, view))
  const detailFields = fieldsFor(open)

  const totalWatts = open.appliances
    ? open.appliances.reduce((n, a) => n + a[2], 0)
    : 0

  const downloadCv = () => {
    if (open.cv?.startsWith("http")) {
      window.open(open.cv, "_blank")
    } else {
      const body = `CV placeholder for ${open.name}\n\nRole applied for: ${open.role}\nLocation: ${open.area}\nPhone: ${open.phone}\nEmail: ${open.email}\nSubmitted: ${open.when}\n\n${open.about}`
      download(`${(open.cv || "cv").replace(/\.pdf$/, "")}.txt`, body)
    }
  }

  const detailMeta =
    open.type === "Customer"
      ? open.completed
        ? `Completed assessment · ${new Date(open.when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
        : `Abandoned assessment · last activity ${new Date(open.when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
      : `${open.type} enquiry · ${new Date(open.when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`

  const phoneHref = open.phone ? `tel:${open.phone.replace(/\s/g, "")}` : "#"
  const mailTarget =
    open.email || (open.contact?.includes("@") ? open.contact : "")
  const mailHref = mailTarget ? `mailto:${mailTarget}` : "#"

  const statusNote =
    open.phone || open.email || open.contact
      ? "Contact details captured. Reach out using the details below."
      : "No contact details were captured before drop-off. Only the entered assessment data is available."

  return (
    <div className="flex animate-gv-fade flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-semibold",
              open.type === "Customer" &&
                "border-green/20 bg-green/10 text-green",
              open.type === "Agent" &&
                "border-amber/30 bg-amber/15 text-amber-700",
              open.type === "Career" &&
                "border-purple-200 bg-purple-100 text-purple-700"
            )}
          >
            {open.type}
          </Badge>
          <h1 className="page-title mt-2">{open.name}</h1>
          <p className="mt-1.5 text-xs text-navy/60 sm:text-sm">{detailMeta}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => download(`gavikina-${open.id}.csv`, csvFor([open]))}
        >
          <Download /> Download CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main Content Column */}
        <div className="flex flex-col gap-6">
          {/* Customer Sizing Metrics */}
          {open.type === "Customer" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="border-navy/10 bg-cream/40 p-0 shadow-xs">
                <CardContent className="p-5">
                  <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
                    Calculated size
                  </span>
                  <div className="mt-1.5 text-2xl font-semibold tracking-tight text-navy">
                    {open.size}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-navy/10 bg-white p-0 shadow-xs">
                <CardContent className="p-5">
                  <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
                    Price range
                  </span>
                  <div className="mt-1.5 text-lg font-semibold tracking-tight text-amber">
                    {open.price}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-navy/10 bg-white p-0 shadow-xs">
                <CardContent className="p-5">
                  <span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
                    Fuel spend
                  </span>
                  <div className="mt-1.5 text-lg font-semibold tracking-tight text-navy">
                    {open.fuel ? `${naira(open.fuel)} / mo` : "Not reached"}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Primary Details Table */}
          <Card className="border-navy/10 shadow-xs">
            <CardHeader className="border-b border-navy/5 bg-muted/20">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-navy/60" />
                <CardTitle className="font-semibold text-navy">
                  Enquiry Details
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <dl className="divide-y divide-navy/5">
                {detailFields.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-cream/20 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <dt className="shrink-0 text-xs font-medium text-navy/60 sm:w-1/3">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-navy sm:text-right">
                      {label === "Property type" && value ? (
                        <Badge
                          variant="outline"
                          className="border-navy/20 text-navy/70 capitalize"
                        >
                          {value}
                        </Badge>
                      ) : label === "CV" ? (
                        <span className="max-w-40 truncate text-sm text-navy/70">
                          {value}
                        </span>
                      ) : label.includes("system power") &&
                        value !== "Not reached" ? (
                        <div className="flex flex-wrap gap-1.5 sm:justify-end">
                          {value.split(",").map((v) => {
                            const clean = v.trim()
                            if (!clean) return null
                            return (
                              <Badge
                                key={clean}
                                variant="secondary"
                                className="bg-navy/5 font-normal text-navy/80 hover:bg-navy/10"
                              >
                                {clean}
                              </Badge>
                            )
                          })}
                        </div>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* CV Attachment Block */}
          {open.cv && (
            <div className="flex flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/5 text-navy">
                  <FileText className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col">
                  <span className="max-w-78 truncate text-sm font-semibold text-navy">
                    {open.cv}
                  </span>
                  <span className="mt-0.5 text-xs text-navy/50">
                    CV attachment · {open.cvSize}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={downloadCv}
                className="w-full sm:w-auto"
              >
                <Download className="size-4" /> Download CV
              </Button>
            </div>
          )}

          {/* Appliance Selections Block */}
          {open.appliances && open.appliances.length > 0 && (
            <Card className="border-navy/10 shadow-xs">
              <CardHeader className="border-b border-navy/5 bg-muted/20">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-amber" />
                  <CardTitle className="text-sm font-semibold text-navy">
                    Appliances Selected
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="flex flex-col gap-3">
                  {open.appliances.map((a) => (
                    <li
                      key={a[0]}
                      className="flex items-center justify-between border-b border-navy/5 pb-3 text-sm last:border-b-0 last:pb-0"
                    >
                      <span className="font-medium text-navy">{a[0]}</span>
                      <div className="flex items-center gap-5">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-navy/50">
                          × {a[1]}
                        </span>
                        <span className="w-16 text-right font-semibold text-navy tabular-nums">
                          {a[2].toLocaleString()}W
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-navy/5 bg-cream/50 p-4">
                  <span className="text-sm font-semibold text-navy">
                    Total load
                  </span>
                  <span className="text-base font-bold text-green tabular-nums">
                    {totalWatts.toLocaleString()}W
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          {/* AI Insights Card */}
          {open.ai && (
            <Card className="gap-4 border-green/20 bg-[#F5F9F4] shadow-xs">
              <CardHeader className="flex items-center gap-2">
                <Bot className="size-4 text-green" />
                <span className="text-xs font-bold tracking-wider text-green-dark uppercase">
                  {open.type === "Agent"
                    ? "AI first read shown to applicant"
                    : open.type === "Customer"
                      ? "AI note shown to customer"
                      : "Note"}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-loose font-light text-navy italic">
                  {open.ai}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Status Card */}
          <Card className="border-navy/10 shadow-xs">
            <CardHeader className="border-b border-navy/5 bg-muted/20 pb-3">
              <CardTitle className="text-sm font-semibold text-navy">
                Action &amp; Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {open.phone || open.email || open.contact ? (
                    <Info className="size-4 text-amber" />
                  ) : (
                    <Info className="size-4 text-navy/40" />
                  )}
                </div>
                <p className="text-xs leading-relaxed text-navy/70">
                  {statusNote}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 border-t border-navy/5">
                <Button
                  nativeButton={false}
                  size="default"
                  className="w-full justify-start gap-3"
                  disabled={!!open.phone}
                  render={<a href={phoneHref} />}
                >
                  <Phone className="size-4 opacity-70" />
                  <span>Call {open.phone || "unavailable"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full justify-start gap-3"
                  nativeButton={false}
                  disabled={!!open.email}
                  render={<a href={mailHref} />}
                >
                  <Mail className="size-4 opacity-70" />
                  <span>Send an email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------

export function EnquiryDetailSkeleton() {
  return (
    <div className="mt-6 flex animate-gv-fade flex-col gap-6">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-20 rounded-md bg-navy/10" />
          <Skeleton className="h-9 w-64 bg-navy/10" />
          <Skeleton className="h-4 w-48 bg-navy/5" />
        </div>
        <Skeleton className="h-9 w-32 bg-navy/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          {/* Metric Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton layout
              <Skeleton key={i} className="h-24 w-full rounded-xl bg-navy/5" />
            ))}
          </div>

          {/* List Details Skeleton */}
          <Card className="border-navy/10 shadow-xs">
            <CardHeader className="border-b border-navy/5 bg-muted/20 pb-4">
              <Skeleton className="h-5 w-32 bg-navy/10" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-navy/5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton layout
                    key={i}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Skeleton className="h-4 w-1/4 bg-navy/10" />
                    <Skeleton className="h-4 w-2/5 bg-navy/5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-32 w-full rounded-2xl bg-green/10" />

          <Card className="border-navy/10 shadow-xs">
            <CardHeader className="border-b border-navy/5 bg-muted/20 pb-3">
              <Skeleton className="h-5 w-32 bg-navy/10" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5 pt-4">
              <Skeleton className="h-10 w-full bg-navy/5" />
              <div className="flex flex-col gap-2.5 border-t border-navy/5 pt-5">
                <Skeleton className="h-10 w-full bg-navy/10" />
                <Skeleton className="h-10 w-full bg-navy/5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
