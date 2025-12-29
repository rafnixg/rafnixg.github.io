---
description: Update source documents (proposal, tasks, design, specs) based on the detailed design.
---

$ARGUMENTS
<!-- OPENSPEC:START -->
**Guardrails**
- Use the provided `detailed-design.md` as the source of truth.
- Do NOT invent new requirements that are not in the detailed design.
- Do NOT output the file content in the chat. Instead, use file editing tools to update the files directly.
- After updating the files, ask the user to review the changes.

**Steps**
1. Read the provided inputs: `detailed-design.md` (Source of Truth) and current `proposal.md`, `tasks.md`, `design.md`, and delta specs.
2. Compare the `detailed-design.md` with the other documents to identify discrepancies.
3. For each file that needs updating (`proposal.md`, `tasks.md`, `design.md`, `specs/**/spec.md`):
   - Explain what is outdated or missing.
   - Update the file using the appropriate tool.
   - Ensure the content aligns with the `detailed-design.md`.
<!-- OPENSPEC:END -->
