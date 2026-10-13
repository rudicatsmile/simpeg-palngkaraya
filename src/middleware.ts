import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Daftar rute publik yang bebas diakses tanpa autentikasi
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/tentang") ||
    pathname.startsWith("/fitur") ||
    pathname.startsWith("/panduan") ||
    pathname.startsWith("/kontak") ||
    pathname.startsWith("/kebijakan-privasi") ||
    pathname.startsWith("/syarat-ketentuan") ||
    pathname.startsWith("/verifikasi") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/aktivasi") ||
    pathname.startsWith("/lupa-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (isPublicRoute) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jika Supabase environment sudah terkonfigurasi nyata (bukan placeholder default)
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes("dummy-simpeg")) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Jika belum login dan mengakses area terproteksi
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Izinkan request diproses jika dalam mode simulator atau sesi terverifikasi
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.svg, .png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
