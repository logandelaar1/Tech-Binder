import { createBrowserRouter } from "react-router"

import { BinderPage } from "@/routes/BinderPage"
import { PrintPage } from "@/routes/PrintPage"
import { ManufacturingPrintPage } from "@/routes/ManufacturingPrintPage"

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
  {
    path: "/manufacturing-print",
    element: <ManufacturingPrintPage />,
  },
], {
  basename: basename || undefined,
})
