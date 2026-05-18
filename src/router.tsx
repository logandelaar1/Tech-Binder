import { createBrowserRouter } from "react-router"

import { BinderPage } from "@/routes/BinderPage"
import { PrintPage } from "@/routes/PrintPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BinderPage />,
  },
  {
    path: "/print",
    element: <PrintPage />,
  },
])
