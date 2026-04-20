---
title: "Internal Documentation Platform (docs.strsi.com)"
summary: "Designed and launched a markdown-based, SSO-protected documentation site on Azure Static Web Apps — replacing fragmented SharePoint docs at roughly 1% the cost of per-seat SaaS alternatives."
date: "Jun 1, 2025"
tags:
  - Azure
  - Documentation
  - DevOps
---

Internal knowledge was scattered across SharePoint and informal channels, and per-user pricing for Confluence or GitBook didn't scale across ~230 employees. Designed, built, and launched [docs.strsi.com](https://docs.strsi.com) as the company knowledge hub:

- Built a markdown-based platform to keep content portable and migration-friendly
- Hosted on Azure Static Web Apps, locked behind Microsoft Entra ID SSO to block public access
- Set up CI/CD publishing through GitHub Actions for seamless updates
- Delivered an enterprise-grade experience for ~$9/month vs. thousands on per-seat SaaS tooling

Result: a secure, performant, and cost-effective documentation hub that centralizes IT processes, accelerates onboarding, and reduces support dependency across teams.
