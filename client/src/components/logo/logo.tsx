import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../../assets/images/hp.jfif";

const Logo = (props: { url?: string }) => {
  return (
    <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2">
  <img
  src={logo}
  alt="EverydayFin Logo"
  className="h-13 w-13 object-cover rounded"
/>

    <span className="font-semibold text-lg">EverydayFin</span>
  </Link>
  )
}

export default Logo