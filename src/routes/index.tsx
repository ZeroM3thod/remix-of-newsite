import { createFileRoute } from "@tanstack/react-router";
import BorojajApp from "@/components/BorojajApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "বরজাজ — সঞ্চয় ও আয়" },
      { name: "description", content: "বরজাজ: আপনার সঞ্চয়, কাজ, প্যাকেজ ও দলের আয় এক জায়গায়।" },
      { property: "og:title", content: "বরজাজ — সঞ্চয় ও আয়" },
      { property: "og:description", content: "বরজাজ: আপনার সঞ্চয়, কাজ, প্যাকেজ ও দলের আয় এক জায়গায়।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BorojajApp,
});
