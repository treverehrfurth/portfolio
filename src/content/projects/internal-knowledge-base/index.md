---
title: "Internal Knowledge Base & Self-Service Platform"
summary: "Designed, built, and launched docs.strsi.com on Azure Static Web Apps with Entra ID SSO, replacing fragmented documentation with a searchable, markdown-based knowledge hub at roughly 1% the cost of per-seat SaaS alternatives."
date: "Jun 1, 2025"
draft: false
tags:
  - Azure
  - Documentation
  - Onboarding
  - Internal Tools
---

## Overview

Designed, built, and launched [docs.strsi.com](https://docs.strsi.com) as the company's centralized documentation and self-service platform, addressing onboarding friction and fragmented knowledge across a growing, distributed organization. Evaluated traditional SaaS options (Confluence, GitBook) and chose a lean architecture that scales cleanly across ~230 employees without per-seat cost pressure.

## What Was Done

- Built a markdown-based platform to keep content portable and migration-friendly
- Hosted on Azure Static Web Apps behind Microsoft Entra ID SSO so content stays private
- Set up CI/CD publishing through GitHub Actions for seamless authoring and deployment
- Organized and migrated critical documentation from scattered sources into a structured, searchable system
- Built self-service resources for common IT requests to reduce ticket volume
- Established governance standards for content ownership and maintenance

## Outcome

Delivered an enterprise-grade documentation experience at roughly $9/month (vs. thousands on per-seat SaaS tooling), while scaling onboarding efficiency, reducing dependency on IT for routine information requests, and creating a foundation for ongoing documentation standards.

## Stack

Azure Static Web Apps · Microsoft Entra ID (SSO) · GitHub Actions · Markdown · M365
