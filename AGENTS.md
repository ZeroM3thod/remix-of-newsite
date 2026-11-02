<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The whole app UI lives in src/components/BorojajApp.tsx (imported from a Figma Make export) with in-page state navigation; keep it as one client-state component unless real routes are requested — it mirrors the source structure.
- Keep `@lovable.dev/vite-tanstack-config` in package.json pinned to the version in bun.lock (currently 2.25.3); raising it to 2.26.5 makes install fail with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` because the newer manifest can't be downloaded here.
