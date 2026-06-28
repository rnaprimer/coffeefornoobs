<USER_REQUEST>
# CoffeeForNoobs — Phase 4 Implementation Plan (Admin Panel & CMS Foundation)

## Goal

Transform CoffeeForNoobs from a database-driven website into a fully manageable content platform by introducing a secure Admin Panel and CMS.

At the end of Phase 4:

* Every content type can be managed through the Admin Panel.
* No manual editing in Supabase is required for day-to-day content updates.
* The public website reads only published content.
* The architecture is prepared for Cloudflare R2, Homepage CMS, Rich Text Editor, and Media Library in future phases.

This phase is focused on **content management**, not adding new public-facing features.

---

# Phase 4 Scope

## Included

```text
Supabase Authentication

Role-Based Authorization

Profiles System

Row Level Security (RLS)

Admin Dashboard

Admin Layout

Products CMS

Brands CMS

Categories CMS

Guides CMS

Beans CMS

Roasters CMS

Comparisons CMS

Settings CMS

Server Actions

React Hook Form

Zod Validation

CRUD Operations

Draft / Published Workflow

Search

Filters

Pagination

Toast Notifications

Reusable Admin Components
```

---

## Explicitly Excluded

Do NOT implement:

```text
Cloudflare R2

Media Uploads

Media Library

Homepage CMS

Rich Text Editor

Version History

Comments

Workflow Approvals

Analytics Dashboard

Newsletter

Affiliate Click Tracking

Search Engine

Public User Accounts
```

---

# Phase Objective

Current workflow:

```text
Supabase Dashboard

↓

Edit Row

↓

Save
```

Target workflow:

```text
Admin Login

↓

Products

↓

Edit

↓

Save

↓

Website Updated
```

The Admin Panel becomes the single place where content is managed.

---

# Pre-Implementation Database Review

Before writing any admin code, verify the Phase 3 database.

---

## Profiles Table

Create:

```text
profiles
```

Fields:

```text
id
email
full_name
avatar_url
role
created_at
updated_at
```

Roles:

```text
admin
editor
```

Purpose:

* Authorization
* Audit trail
* User information

---

## Audit Fields

Every editable table should contain:

```text
created_by
updated_by
created_at
updated_at
```

Apply to:

```text
products
brands
categories
guides
beans
roasters
comparisons
```

---

## Status Field

Every content table should contain:

```text
status
```

Supported values:

```text
draft
published
archived
```

The public website should only query:

```text
published
```

---

## Featured Field

Every content type should support:

```text
featured BOOLEAN
```

Used later by Homepage CMS.

---

## Display Order

Add:

```text
display_order
```

to:

```text
categories

products

guides

beans
```

Allows manual ordering later.

---

## Soft Delete

Instead of deleting rows permanently:

Add:

```text
deleted_at
```

Deleted content is hidden but recoverable.

---

## Database Indexes

Ensure indexes exist for:

```text
slug

status

featured

display_order
```

---

# Row Level Security

Enable RLS on every content table.

---

## Public

Allowed:

```text
SELECT

status = published
```

Only.

---

## Editor

Allowed:

```text
SELECT

INSERT

UPDATE
```

No user management.

---

## Admin

Allowed:

```text
Full CRUD

Manage Users

Manage Settings
```

---

# Authentication

Use:

```text
Supabase Auth
```

Authentication method:

```text
Email

Password
```

No:

```text
Google

GitHub

Magic Link
```

---

# Route Structure

```text
src/app

(public)

(admin)

│

├── admin

│   ├── login

│   │

│   ├── page.tsx

│   │

│   ├── products

│   │   ├── page.tsx

│   │   ├── new

│   │   └── [id]

│   │       └── edit

│   │

│   ├── brands

│   ├── categories

│   ├── guides

│   ├── beans

│   ├── roasters

│   ├── comparisons

│   └── settings
```

---

# Admin Layout

Create:

```text
AdminLayout
```

Contains:

```text
Sidebar

Top Navigation

Breadcrumbs

Search

Profile Menu

Content Area
```

---

# Sidebar Navigation

```text
Dashboard

Products

Brands

Categories

Guides

Beans

Roasters

Comparisons

Settings

Logout
```

---

# Dashboard

Display:

```text
Products Count

Guides Count

Beans Count

Comparisons Count

Draft Content

Published Content

Recent Updates
```

Keep it lightweight.

---

# CMS Modules

---

## Products

Routes

```text
/admin/products

/admin/products/new

/admin/products/[id]/edit
```

Fields

```text
Name

Slug

Brand

Category

Short Description

Description

Price

Rating

Pros

Cons

Specifications

Affiliate Links

Featured

Status

SEO Title

SEO Description
```

Features

```text
Search

Filters

Sorting

Create

Edit

Delete

Draft

Publish
```

---

## Brands

Fields

```text
Name

Slug

Description

Featured

Status
```

CRUD only.

---

## Categories

Fields

```text
Name

Slug

Description

Display Order

Featured

Status
```

---

## Guides

Fields

```text
Title

Slug

Excerpt

Content

Reading Time

Related Products

Featured

Status

SEO Title

SEO Description
```

Use textarea.

Rich Text Editor comes later.

---

## Beans

Fields

```text
Name

Slug

Roaster

Origin

Process

Roast Level

Tasting Notes

Featured

Status

SEO
```

---

## Roasters

Fields

```text
Name

Slug

Website

Description

Featured

Status
```

---

## Comparisons

Fields

```text
Title

Slug

Product A

Product B

Winner

Content

Featured

Status

SEO
```

---

## Settings

Fields

```text
Site Name

Tagline

Footer Text

Support Email

Instagram

YouTube

Twitter

Default SEO Title

Default SEO Description
```

---

# Form Architecture

Every form must use:

```text
React Hook Form

+

Zod
```

Validation happens before database writes.

---

# Validation Layer

Create:

```text
src/lib/validations
```

Files:

```text
product.ts

guide.ts

bean.ts

comparison.ts

brand.ts

category.ts

roaster.ts

settings.ts
```

---

# Server Actions

Create:

```text
src/actions
```

Structure:

```text
products

brands

categories

guides

beans

roasters

comparisons

settings
```

Each module should expose:

```text
create

update

delete

publish

archive
```

Pages and forms must never call Supabase directly.

---

# Reusable Admin Components

Create:

```text
components/admin

DataTable

FormCard

PageHeader

SearchInput

FilterBar

StatusBadge

DeleteDialog

ConfirmDialog

EmptyState

Pagination

FormActions
```

---

# UI Features

Every CMS listing page should support:

```text
Search

Filtering

Sorting

Status Badge

Pagination

Edit

Delete

Bulk Selection (optional)

Empty States
```

---

# Notifications

Use:

```text
Sonner
```

Display:

```text
Created

Updated

Deleted

Published

Archived

Validation Errors
```

---

# Slug Management

Automatically generate slugs from titles.

Allow manual editing.

Prevent duplicates.

---

# Public Site Integration

Modify public queries so they only fetch:

```sql
status = 'published'
```

Drafts must never appear publicly.

---

# Error Handling

Support:

```text
Unauthorized

Forbidden

404

Duplicate Slug

Validation Errors

Database Errors
```

Use proper error boundaries where appropriate.

---

# Development Order

## Step 1

Review and finalize database schema.

* Profiles table
* Audit fields
* Status fields
* Featured fields
* Soft deletes
* Indexes

---

## Step 2

Enable Row Level Security.

Create policies for:

* Public
* Editor
* Admin

---

## Step 3

Implement Supabase Authentication.

---

## Step 4

Create Admin Layout.

---

## Step 5

Create Dashboard.

---

## Step 6

Build Products CMS.

---

## Step 7

Build Brands CMS.

---

## Step 8

Build Categories CMS.

---

## Step 9

Build Guides CMS.

---

## Step 10

Build Beans CMS.

---

## Step 11

Build Roasters CMS.

---

## Step 12

Build Comparisons CMS.

---

## Step 13

Build Settings CMS.

---

## Step 14

Implement Validation Layer.

---

## Step 15

Implement Server Actions.

---

## Step 16

Connect Public Website to Published Content Only.

---

## Step 17

Responsive Testing.

---

## Step 18

Production Build.

```bash
npm run build
```

---

# Verification Criteria

Phase 4 is complete only if:

```text
✓ Supabase Authentication works

✓ Profiles table implemented

✓ RLS enabled

✓ Admin routes protected

✓ Dashboard functional

✓ Products CMS complete

✓ Brands CMS complete

✓ Categories CMS complete

✓ Guides CMS complete

✓ Beans CMS complete

✓ Roasters CMS complete

✓ Comparisons CMS complete

✓ Settings CMS complete

✓ CRUD operations work

✓ Validation works

✓ Draft / Published workflow works

✓ Public site only shows published content

✓ Toast notifications work

✓ Responsive Admin UI

✓ Build succeeds

✓ No Cloudflare R2

✓ No Media Library

✓ No Homepage CMS
```

---

# Expected Deliverable

At the end of Phase 4, CoffeeForNoobs should operate as a professional content platform with a secure, role-based Admin Panel and reusable CMS modules. Editors should be able to manage products, guides, beans, comparisons, brands, categories, roasters, and site settings without accessing Supabase directly.

This creates the foundation for **Phase 5**, where Cloudflare R2, the Media Library, Homepage CMS, and richer content editing capabilities can be added with minimal architectural changes.

</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-06-26T21:04:01+05:30.

The user's current state is as follows:
Active Document: /Users/debashismohanty/Downloads/coffeefornoobs/.env.local (LANGUAGE_UNSPECIFIED)
Cursor is on line: 1
Other open documents:
- /Users/debashismohanty/Downloads/coffeefornoobs/src/components/layout/Footer.tsx (LANGUAGE_TSX)
- /Users/debashismohanty/Downloads/coffeefornoobs/src/app/page.tsx (LANGUAGE_TSX)
- /Users/debashismohanty/Downloads/coffeefornoobs/src/components/home/FeaturesStrip.tsx (LANGUAGE_TSX)
- /Users/debashismohanty/Downloads/coffeefornoobs/src/components/home/GuidesSection.tsx (LANGUAGE_TSX)
- /Users/debashismohanty/Downloads/coffeefornoobs/.env.local (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.5 Flash (Low) to Gemini 3.1 Pro (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>
