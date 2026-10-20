import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/signin/",
        "/profile/",
        "/orders/",
        "/live/",
        "/s/",
        "/peserta",
        "/daftarkey13",
        "/events/*/checkout",
        "/events/*/qna",
        "/events/*/poll",
        "/events/*/scan/",
        "/donations/status/",
        "/shop/cart",
        "/shop/orders/",
      ],
    },
    sitemap: "https://ynsolo.id/sitemap.xml",
    host: "https://ynsolo.id",
  };
}
