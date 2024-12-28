import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { logout, setCredentials } from '@/features/auth/authSlice'
import { useLocation, matchRoutes, Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Notification } from "@/components/notification";
import { useGetUserDetailsQuery } from '@/app/services/auth/authService'
export const iframeHeight = "800px"
import { RootState } from "@/store";



export const description = "A sidebar that collapses to icons."

const routes = [
  { path: "/dashboard", breadcrumb: "Dashboard" },
  { path: "/settings", breadcrumb: "Settings" },
  { path: "/settings/account", breadcrumb: "Account" },
  { path: "/settings/profile", breadcrumb: "Profile" },
  // Add other routes as necessary
];

function generateBreadcrumbs(location) {
  const matchedRoutes = matchRoutes(routes, location);
  if (!matchedRoutes) return null;

  return matchedRoutes.map((match, index) => {
    const { breadcrumb, path } = match.route;
    const isLast = index === matchedRoutes.length - 1;

    return (
      <BreadcrumbItem key={path} className="hidden md:block">
        {isLast ? (
          <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink as={Link} to={path}>
            {breadcrumb}
          </BreadcrumbLink>
        )}
        {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
      </BreadcrumbItem>
    );
  });
}


export default function PrivateLayout() {
  const { loading, isLoggedIn, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data, isFetching, error } = useGetUserDetailsQuery('userDetails', {
    pollingInterval: 900000, // 15mins
  })

  useEffect(() => {
    if (data){
        dispatch(setCredentials(data))
    }else if (error && !loading) {
      if (error.originalStatus === 401) {
         dispatch(logout());
      }
    }
  }, [data, error, dispatch, isFetching]);

  if (!isLoggedIn) {
    return <Navigate to="/sigin" replace />;
  }


  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location);
  const organization = useSelector((state: RootState) => state.organization);

  console.log(organization, 'Private Layout')
  return (
    <SidebarProvider>
    {!userInfo ? (
      <>
     <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12" />
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
      </>
    ) : (
    <>
    <AppSidebar user={userInfo} organization={organization} />
      <SidebarInset>
         <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* Right side icons */}
          <div className="ml-auto flex items-center gap-4">
            <Notification />
            <ModeToggle /> {/* Theme selector */}

          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Outlet/>
          </div>
        </div>
      </SidebarInset></>)}
    </SidebarProvider>
  )
}