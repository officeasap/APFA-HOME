CURRICULUM SOURCE LOCK

Purpose:
Pin upstream curriculum repositories to exact Git commits before ingestion.

Rules:
- Upstream repositories remain outside the APFA application repository.
- Production content is imported through the curriculum ingestion pipeline.
- Do not copy entire upstream repositories into the frontend.
- Do not import translations during the first English-content pass.
- Preserve upstream license and attribution metadata.
- Never modify upstream curriculum repositories.
