import { Home } from "pages/Home";
import { Login } from "pages/auth/Login";
import { Register } from "pages/auth/Register";
import { Dashboard } from "pages/Dashboard";
import { UserManagement } from "pages/admin/UserManagement";
import { CategoryManagement } from "pages/admin/CategoryManagement";
import NewArticle from "pages/articles/create";
import EditArticle from "pages/articles/create/Edit";
import Reviews from "pages/articles/reviews/Reviews";
import ReviewByRole from "pages/articles/reviews/ReviewByRole";
import { ArticleDetail } from "pages/articles/detail/ArticleDetail";
import { VolumesAndIssues } from "pages/VolumesAndIssues";
import Account from "pages/auth/Account";
import ForgotPassword from "pages/ForgotPassword";
import ChangePassword from "pages/ChangePassword";

export const RouteTypes = {
  ALL: 0,
  ONLY_PRIVATE: 1,
  ONLY_PUBLIC: 2,
};

export const routes = [
  {
    path: "/",
    component: Home,
    exact: true,
    type: RouteTypes.ALL,
  },
  {
    path: "/auth/register",
    component: Register,
    exact: true,
    type: RouteTypes.ONLY_PUBLIC,
  },
  {
    path: "/auth/login",
    component: Login,
    exact: true,
    type: RouteTypes.ONLY_PUBLIC,
  },
  {
    path: "/auth/forgot-password",
    component: ForgotPassword,
    exact: true,
    type: RouteTypes.ONLY_PUBLIC,
  },
  {
    path: "/dashboard",
    component: Dashboard,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/admin/users",
    component: UserManagement,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/admin/categories",
    component: CategoryManagement,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/articles/new",
    component: NewArticle,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/articles/:role/management",
    component: Reviews,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/articles/:role/reviews/:id",
    component: ReviewByRole,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/articles/:id",
    component: ArticleDetail,
    exact: true,
    type: RouteTypes.ALL,
  },
  {
    path: "/articles/:id/edit",
    component: EditArticle,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/volumes-and-issues",
    component: VolumesAndIssues,
    exact: true,
    type: RouteTypes.ALL,
  },
  {
    path: "/account",
    component: Account,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
  {
    path: "/account/change-password",
    component: ChangePassword,
    exact: true,
    type: RouteTypes.ONLY_PRIVATE,
  },
];
