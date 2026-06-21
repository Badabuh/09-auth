// proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

type CookieSetOptions = {
  expires?: Date;
  path?: string;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

function parseSetCookieHeader(setCookie: string): {
  name: string;
  value: string;
  options: CookieSetOptions;
} | null {
  const parts = setCookie.split(";").map((p) => p.trim());
  const [nameValue, ...attributes] = parts;

  if (!nameValue) return null;

  const separatorIndex = nameValue.indexOf("=");
  if (separatorIndex === -1) return null;

  const name = nameValue.slice(0, separatorIndex);
  const value = nameValue.slice(separatorIndex + 1);
  const options: CookieSetOptions = {};

  for (const attribute of attributes) {
    const eqIndex = attribute.indexOf("=");
    const key = (eqIndex === -1 ? attribute : attribute.slice(0, eqIndex)).toLowerCase();
    const attrValue = eqIndex === -1 ? "" : attribute.slice(eqIndex + 1);

    if (key === "expires" && attrValue) {
      const expiresDate = new Date(attrValue);
      if (!Number.isNaN(expiresDate.getTime())) {
        options.expires = expiresDate;
      }
      continue;
    }

    if (key === "path" && attrValue) {
      options.path = attrValue;
      continue;
    }

    if (key === "max-age" && attrValue) {
      const maxAge = Number(attrValue);
      if (Number.isFinite(maxAge)) {
        options.maxAge = maxAge;
      }
      continue;
    }

    if (key === "domain" && attrValue) {
      options.domain = attrValue;
      continue;
    }

    if (key === "secure") {
      options.secure = true;
      continue;
    }

    if (key === "httponly") {
      options.httpOnly = true;
      continue;
    }

    if (key === "samesite") {
      const sameSite = attrValue.toLowerCase();
      if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
        options.sameSite = sameSite;
      }
    }
  }

  return { name, value, options };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!accessToken) {
    if (refreshToken) {
      const data = await getSession();
      const setCookie = data.headers["set-cookie"];

      if (setCookie) {
        const response = isPublicRoute
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsedCookie = parseSetCookieHeader(cookieStr);
          if (!parsedCookie) continue;

          if (parsedCookie.name === "accessToken") {
            response.cookies.set("accessToken", parsedCookie.value, parsedCookie.options);
          }
          if (parsedCookie.name === "refreshToken") {
            response.cookies.set("refreshToken", parsedCookie.value, parsedCookie.options);
          }
        }

        if (isPublicRoute) {
          return response;
        }
        if (isPrivateRoute) {
          return response;
        }
      }
    }
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // приватний маршрут — дозволяємо доступ
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
