import { queryOptions } from "@tanstack/react-query"
import { getAdmins } from "./api"

export const adminsKeys = {
  all: ["admins"] as const,
  lists: () => [...adminsKeys.all, "list"] as const,
}

export const adminsListQueryOptions = () =>
  queryOptions({
    queryKey: adminsKeys.lists(),
    queryFn: getAdmins,
  })
