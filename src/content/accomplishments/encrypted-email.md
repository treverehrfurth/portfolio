---
title: "Encrypted Email & Do Not Forward Protection"
summary: "Diagnosed and repaired a broken Exchange Online IRM ↔ Azure RMS binding to finally enable Purview Message Encryption and Do Not Forward protections tenant-wide."
date: "May 20, 2025"
tags:
  - Microsoft Purview
  - Security
  - Compliance
---

Encrypted email and Do Not Forward had been partially attempted in the past but never actually worked — leaving Finance and HR with no secure way to send sensitive communications. Fully enabled Purview Message Encryption and IRM:

- Diagnosed tenant-level failures preventing encryption workflows from running
- Repaired the Exchange Online IRM to Azure RMS binding so the licensor certificate, templates, and service endpoints loaded correctly
- Ran and validated IRM self-tests and end-to-end encryption workflows
- Coordinated with Microsoft Support to finalize activation after tenant remediation

Result: encrypted email and Do Not Forward protections are live for all users, giving Finance and HR a controlled, auditable way to protect sensitive communications from unauthorized sharing.
