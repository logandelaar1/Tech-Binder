import { createBrowserRouter } from "react-router"

import { BinderPage } from "@/routes/BinderPage"
import { PrintPage } from "@/routes/PrintPage"

const basename = import.meta.env.BASE_URL.replace(/\/$/, "")

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BinderPage />,
  },
  {
    path: "/print",
    element: <PrintPage />,
  },
], {
  basename: basename || undefined,
})
