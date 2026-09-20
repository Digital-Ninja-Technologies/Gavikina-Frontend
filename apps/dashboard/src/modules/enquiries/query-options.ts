import { queryOptions } from "@tanstack/react-query"
import type { Lead, LeadType } from "#/lib/data"
import type { EnquiriesSearch } from "@/routes/_protected/enquiries/index"
import {
  getAbandonedAssessments,
  getAssessmentById,
  getEnquiries,
  getEnquiryById,
} from "./api"

import { cleanEmail, cleanPhone } from "./utils"

function mapToLead(apiItem: any): Lead {
  const d = apiItem.details || {}
  const isAssessment = Boolean(apiItem.sessionId)

  if (isAssessment) {
    const rawPhone = apiItem.customerDetails?.phone || d.phone
    const rawEmail = apiItem.customerDetails?.email || d.email

    return {
      id: apiItem.sessionId,
      type: "Customer" as LeadType,
      name: apiItem.customerDetails?.name || "Anonymous",
      email: cleanEmail(rawEmail),
      phone: cleanPhone(rawPhone),
      when: apiItem.updatedAt || apiItem.createdAt,
      completed: false,
      property: apiItem.propertyType || d.propertyType,
      inspection:
        apiItem.requestSiteInspection || d.requestSiteInspection || false,
      reason: apiItem.reason || d.reason,
      backup:
        apiItem.backupHours || d.backupHours
          ? `${apiItem.backupHours || d.backupHours} hours`
          : undefined,
      fuel: apiItem.fuelSpend || d.fuelSpend,
      size: apiItem.recommendation?.tier || d.preferredTier,
      ai: apiItem?.recommendation?.aiNote,
      price: apiItem.recommendation
        ? `₦${apiItem.recommendation.priceMin.toLocaleString()} - ₦${apiItem.recommendation.priceMax.toLocaleString()}`
        : undefined,
      appliances: (apiItem.appliances || d.appliances)?.map((a: any) => [
        a.name,
        a.quantity,
        a.wattage * a.quantity,
      ]),
    }
  }

  const cleanedEmail = cleanEmail(apiItem.email)
  const cleanedPhone = cleanPhone(apiItem.phone)

  const lead: Partial<Lead> = {
    id: apiItem._id,
    name: apiItem.name || "Anonymous",
    email: cleanedEmail,
    phone: cleanedPhone,
    message: apiItem.message,
    when: apiItem.createdAt,
    ai: apiItem?.details?.aiNote || apiItem.notes?.join("\n"),
  }

  let leadType: LeadType = "Contact"
  switch (apiItem.type) {
    case "customer":
      leadType = "Customer"
      lead.property = d.propertyType
      lead.size = d.preferredTier
      lead.fuel = d.fuelSpend
      lead.backup = d.backupHours ? `${d.backupHours} hours` : undefined
      lead.payment = d.paymentPreference
      lead.completed = true
      lead.price = d.priceRange?.formatted
      lead.reason = d.reason || apiItem.reason
      if (d.appliances) {
        lead.appliances = d.appliances.map((a: any) => [
          a.name,
          a.quantity,
          a.wattage * a.quantity,
        ])
      }
      break

    case "agent":
      leadType = "Agent"
      lead.area = d.territory
      lead.occupation = d.currentOccupation
      lead.reason = d.whyJoin
      break

    case "investor":
      leadType = "Investor"
      lead.message =
        d.whatAreYouLookingFor || d.investmentInterest || apiItem.message
      break

    case "careers":
      leadType = "Career"
      lead.role = d.roleAppliedFor
      lead.area = d.location
      lead.about = d.experience
      lead.cv = d.cvUrl || d.cv
      lead.cvSize = "PDF Document"
      break

    case "contact":
      leadType = "Contact"
      // Prioritizes whichever contact method was actually submitted
      lead.contact = cleanedEmail || cleanedPhone || undefined
      lead.message = d.message || apiItem.message
      break
  }

  lead.type = leadType
  return lead as Lead
}
// -----------------------------------------------------------------------------
// QUERY OPTIONS
// -----------------------------------------------------------------------------

function parseDateRange(dateFilter: string) {
  if (!dateFilter || dateFilter === "All dates") return {}

  const end = new Date()
  const start = new Date()
  start.setHours(0, 0, 0, 0)

  if (dateFilter === "Yesterday") {
    start.setDate(start.getDate() - 1)
    end.setDate(end.getDate() - 1)
    end.setHours(23, 59, 59, 999)
  } else if (dateFilter === "Last 3 days") {
    start.setDate(start.getDate() - 3)
  } else if (dateFilter === "Last 7 days") {
    start.setDate(start.getDate() - 7)
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  }
}

export const enquiriesKeys = {
  all: ["enquiries"] as const,
  lists: () => [...enquiriesKeys.all, "list"] as const,
  list: (params: EnquiriesSearch) =>
    [...enquiriesKeys.lists(), params] as const,
  details: () => [...enquiriesKeys.all, "detail"] as const,
  detail: (id: string) => [...enquiriesKeys.details(), id] as const,
}

export const enquiriesListQueryOptions = (params: EnquiriesSearch) =>
  queryOptions({
    queryKey: enquiriesKeys.list(params),
    queryFn: async () => {
      const dates = parseDateRange(params.date)
      const apiParams = {
        page: params.page,
        limit: params.limit,
        search: params.search,
        ...dates,
      }

      if (params.view === "abandoned") {
        const res = await getAbandonedAssessments(apiParams)
        return {
          data: res.data.map(mapToLead),
          meta: res.meta || {
            // @ts-expect-error
            total: res?.total,
            // @ts-expect-error
            page: res?.page,
            // @ts-expect-error
            limit: res?.limit,
          },
        }
      }

      let typeParam = params.view
      if (params.view === "all" && params.typeFilter !== "All types") {
        typeParam =
          params.typeFilter === "Career"
            ? "careers"
            : params.typeFilter.toLowerCase()
      } else {
        if (params.view === "customers") typeParam = "customer"
        if (params.view === "agents") typeParam = "agent"
        if (params.view === "investors") typeParam = "investor"
        if (params.view === "careers") typeParam = "careers"
      }

      const res = await getEnquiries({
        ...apiParams,
        type: typeParam === "all" ? undefined : typeParam,
      })

      return { data: res.data.map(mapToLead), meta: res.meta }
    },
  })

export const enquiryDetailQueryOptions = (id: string, view: string) =>
  queryOptions({
    queryKey: enquiriesKeys.detail(id),
    queryFn: async () => {
      if (view === "abandoned") {
        const res = await getAssessmentById(id)
        return mapToLead(res.data)
      }
      const res = await getEnquiryById(id)
      return mapToLead(res.data)
    },
  })
