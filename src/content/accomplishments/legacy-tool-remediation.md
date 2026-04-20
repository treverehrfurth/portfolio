---
title: "Legacy Security Tool Remediation & Account Lockout Resolution"
summary: "Tracked down unexpected account disablements — including one hitting the VP of Sales mid-travel — to an undecommissioned MSP security tool, and fully retired it from the tenant."
date: "Apr 20, 2025"
tags:
  - Security
  - Incident Response
  - Identity
---

Even after modernizing Conditional Access, users kept getting unexpectedly disabled — new Brazil hires, the VP of Sales on hotel Wi-Fi — with behavior that didn't match the new policies. Led the investigation and cleanup:

- Traced disablement events through Entra sign-in logs and tenant audit history
- Identified SaaS Alerts, a legacy MSP-installed tool, as the system manipulating accounts
- Confirmed it had never been decommissioned when the MSP transitioned to Huntress for IDTR
- Removed the integration and coordinated with the MSP to fully retire the legacy tooling

Result: eliminated a hidden control that was disrupting user access, restored predictable identity governance under Conditional Access, and ensured only approved platforms manage account enforcement.
