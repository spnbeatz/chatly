import { Route } from "@/components/layout/Navigation/Navigation";

export const RouteItem = ({ route } : { route: Route }) => {
    return (
        <a key={route.name} className="text-sm font-light text-black/60" href={route.path} onClick={(e) => {
            e.preventDefault();
            route.onClick();
        }}>
            {route.name}
        </a>
    )
}