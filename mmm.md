# MMSD Case Manager Workstation

> A centralized, profile-driven workstation designed to support MMSD Case Managers from Initial Review through Delivery and post-issue processing.

## Project Status

**Current stage:** Wireframe and prototype development
**Selected workstation design:** Option 1, Merged Workstation
**Presentation status:** Ready for stakeholder review
**Production status:** Not deployed
**Current prototype framework:** Flask, HTML, CSS, JavaScript, and Python
**Intended hosting:** Private MassMutual server

> [!IMPORTANT]
> The screens in this project are clickable wireframes and working concepts. Nothing on the live site has been changed.

---

## Table of Contents

- #project-overview
- #project-vision
- #business-goals
- #project-scope
- #view-the-wireframes
- #sitemap
- #shared-application-layout
- #workstation-experience
- #core-features
- #project-timeline-and-decision-history
- #technology-and-implementation-direction
- #data-privacy-and-security
- #open-decisions
- #implementation-plan
- #testing-strategy
- #success-criteria
- #presentation-summary

---

# Project Overview

The MMSD Case Manager Workstation is a centralized platform designed to bring Case Manager workflows, tools, case information, forms, references, automation, and team collaboration into one application.

The project began because Case Managers currently need to move between multiple systems, tools, documents, emails, spreadsheets, and Quest resources to process a case. The workstation is intended to reduce that friction by presenting the right workflow, tool, form, or processing guidance at the time it is needed.

This is not intended to replace Quest.

Quest remains the authoritative source of record. The workstation links to relevant Quest content and uses that content to support the Case Manager's workflow without copying or replacing the official source.

The long-term goal is to create an intelligent operational workspace that supports a case from Initial Review through Interim, Issue, Delivery, and post-issue processing.

---

# Project Vision

My vision for this project is to create one place where an MMSD Case Manager can open a case, identify what applies, complete the appropriate workflow, generate the required output, and access the right tools without continuously moving between unrelated systems.

The workstation should be useful for both new and experienced Case Managers.

A newer Case Manager should be able to use Guided Mode to understand:

- What action is required
- Why the action is required
- What information triggered the action
- Which forms or tools are needed
- Where the supporting Quest guidance is located

An experienced Case Manager should be able to use Expert Mode to move quickly through:

- Condensed checklists
- Required actions
- Relevant tools
- Forms
- Case output

The workstation should adapt to the case instead of requiring the Case Manager to search through every possible workflow and decide what applies.

---

# Business Goals

The goals of the MMSD Case Manager Workstation are to:

- Reduce missed requirements
- Reduce inconsistent processing
- Reduce repetitive case setup
- Reduce time spent looking for forms and procedures
- Reduce movement between disconnected tools
- Support newer Case Managers through guided workflows
- Allow experienced Case Managers to work more efficiently
- Improve the consistency of requirements, amendments, and emails
- Support complex cases without overwhelming the user
- Improve case handoffs between Case Managers
- Make relevant Quest content easier to find
- Create a reusable foundation for additional MMSD tools
- Provide an opportunity for document extraction and workflow automation

---

# Project Scope

## Included

The workstation begins at Initial Review and continues through the remaining stages of the case lifecycle:

1. Initial Review
2. Interim
3. Issue
4. Delivery
5. Post-Issue Processing

The project includes:

- Case setup
- Case profile creation
- Initial Review workflows
- Interim workflows
- Issue workflows
- Delivery and post-issue workflows
- Requirements
- Amendments
- Email generation
- Illustration validation
- Save Age processing
- Forms management
- State-specific processing
- Firm-specific processing
- Replacement processing
- 1035 exchange processing
- Joint and survivorship processing
- Change-after-approval processing
- Reissue processing
- Internal case notes
- Shared case access
- Team handoffs
- Case history
- User personalization
- Manager insights
- Quest reference links
- Questy assistance

## Out of Scope

The following are not part of the current Case Manager workstation scope:

- Pre-Initial Review processing performed by a separate team
- Full Account Manager workflows
- MMFA operational workflows
- Replacing Quest as the source of record
- Public internet hosting

Certain tools may eventually be available to Account Managers, but the main workstation is being designed for the MMSD Case Manager workflow.

---

# View the Wireframes

The wireframes can be opened directly by opening:

```text
docs/wireframes/index.html
```

The main `index.html` file can also be opened by double-clicking it in File Explorer.

If the Flask application is running, the wireframes can be viewed at:

```text
/docs/wireframes/index.html
```

Example local startup command:

```bash
python app.py
```

These wireframes are intended to:

- Demonstrate the proposed layout
- Test navigation
- Compare workstation options
- Demonstrate conditional workflows
- Support stakeholder presentations
- Collect feedback before production development

---

# Sitemap

## Complete Sitemap

| Group | Screen | File | Status or Purpose |
|---|---|---|---|
| Entry | Wireframe index | `index.html` | Main starting point for the wireframes |
| Work | Home | `home.html` | Main launch page and personalized dashboard |
| Work | MMSD Workstation, Option 1 Merged | `workstation-merge.html` | Selected workstation design |
| Work | MMSD Workstation, Option 2 Side-by-Side | `workstation-side.html` | Retired design retained for reference |
| Work | IR Workbench | `ir-workbench.html` | Retired with Option 2; retained for reference |
| Work | My Cases | `case-queue.html` | Shared case queue and saved case access |
| Work | My Wins | `my-wins.html` | Private morale, badges, streaks, and personal trends |
| User | Profile & Settings | `cm-profile.html` | User profile, training, coverage, and preferences |
| Management | Team Insights | `mgmt-insights.html` | Manager-only operational and training insights |
| Tools | Tools Hub | `tools-hub.html` | Central launcher for standalone tools |
| Tools | Verbiage Center | `tool-*.html` | Requirement and processing language |
| Tools | Amendment Builder | `tool-*.html` | Amendment generation |
| Tools | Email Generator | `tool-*.html` | Case email generation |
| Tools | Illustration Validator | `tool-*.html` | Application and illustration comparison |
| Tools | Save Age | `tool-*.html` | Save Age calculation and output |
| Tools | State Forms | `tool-*.html` | State-specific forms and notices |
| Tools | Reissue Tool | `tool-reissue.html` | Change-after-approval and reissue processing |
| Reference | Forms Library | `ref-*.html` | Searchable forms and state versions |
| Reference | Underwriting | `ref-*.html` | Underwriting resources and guide links |
| Reference | Firm Directory | `ref-firm-directory.html` | Firm, Account Manager, backup, and DocuSign data |

## Selected Navigation Structure

The final navigation direction uses a collapsible left sidebar with the following groups:

### Work

- Home
- MMSD Workstation
- My Cases
- My Wins

### Tools

- Tools Hub
- Verbiage Center
- Amendment Builder
- Email Generator
- Illustration Validator
- Save Age
- State Forms
- Reissue Tool

### Reference

- Forms Library
- Underwriting
- Firm Directory

### Management

- Team Insights

The Management group is only displayed to users identified as managers in the roster.

---

# Shared Application Layout

## Top Bar

The navy top bar includes:

- MassMutual wordmark
- Global search
- Case timer
- Streak indicator
- Customize option
- User name and settings menu

The user menu includes:

- Profile & Settings
- Working As
- Customize
- My Wins

## Sidebar

The workstation uses a collapsible left sidebar.

The sidebar can collapse into an icon rail by using the menu control in the top bar.

The user's sidebar state is remembered.

Users can also personalize the sidebar by:

- Pinning tools to **My Shortcuts**
- Hiding tools they do not use
- Restoring previously hidden tools
- Reordering personalized sections

The bottom sidebar action is:

```text
✎ Customize sidebar
```

There is only one collapse control, located in the top bar.

## Page Header

Each page follows a shared page-header structure containing:

- Breadcrumb
- Page title
- Case or user profile pills
- Primary actions
- Contextual page controls

## Shared Tool Layout

Standalone tools use a consistent structure:

```text
Inputs | Output
```

Standard actions include:

- Copy
- Send to Case Output
- Open in Workstation

This layout is intended to make each tool feel like part of the same application rather than a collection of separate pages.

---

# Workstation Experience

## Case Profile

The workstation builds a profile for each case.

The case profile may include:

- Product
- Processing system
- Signature method
- BOT status
- State
- Owner type
- Replacement status
- Funding method
- Financing status
- Firm
- Related policies
- Payment method
- Delivery method
- Dating information
- Firm or agency number
- Account Manager
- Insured structure
- Underwriting approval status
- Policy design details

The previously proposed **Case Type** field was removed because the workstation is designed for new business.

## Conditional Profile Questions

Some profile questions appear only when relevant.

Examples:

| Condition | Field or Behavior |
|---|---|
| eSigned case | BOT-related question appears |
| Replacement is not None | Funding and financing fields appear |
| VUL product | MMLIS field appears |
| Issue stage | Underwriting approval field appears |
| Joint case | Additional insured information appears |
| Save Age requested | Save Age information and calculation appear |

## Workflow Stages

The case lifecycle is organized into four main tabs:

```text
IR → Interim → Issue → Delivery
```

Each stage includes a chevron-style path showing the phases within that stage.

## Conditional Step Cards

Each workflow action is displayed as a step card.

Every card has a show-and-hide rule that is driven by the case profile.

Conditional cards:

- Use a gold accent
- Identify the profile answer that triggered the card
- Explain the requirement in Guided Mode
- Display only the action in Expert Mode

Examples:

| Profile Answer | Workstation Response |
|---|---|
| BOT = Yes | Displays “Act on BOT note” and hides the manual requirement sweep |
| Owner = Trust | Adds F6734 trustee review steps |
| Funding = 1035 with loan | Adds the loan qualification table |
| Firm = EDJ | Adds the Edward Jones processing overlay |
| Insureds = Joint | Adds joint-insured forms and indexing steps |
| State = New York | Adds applicable New York review logic |
| Product = VUL | Adds applicable VUL and MMLIS processing |

## Guided Mode

Guided Mode is intended for:

- New Case Managers
- Newly trained Case Managers
- Infrequent case types
- Complex cases
- Cases outside the user's training profile

Guided Mode displays:

- The required action
- Why the action is needed
- The condition that triggered it
- Watch-outs
- Supporting tools
- Quest links
- Additional processing context

## Expert Mode

Expert Mode is intended for experienced Case Managers.

Expert Mode displays:

- Required checkboxes
- Condensed actions
- Tool buttons
- Forms
- Relevant case output

Quest links are removed from the individual step cards and grouped in the **Quest for This Case** panel.

## Right Rail

The right rail contains information filtered to the current case profile, including:

- Watch-outs
- Email templates
- Relevant tools
- Quest content
- Firm-specific reminders
- State-specific reminders

## Quest Links

In Guided Mode, the Quest link appears directly beside the step and explanatory note.

In Expert Mode, the Quest links are grouped by stage in the **Quest for This Case** section.

Quest remains the official source of record.

## Case Output Drawer

The Case Output drawer collects generated content into one package.

The package may include:

- Requirements
- Amendments
- Initial Review note
- Save Age result
- Attached forms
- Generated email
- Policy information
- Related policy details

The **Open Draft in Outlook** action is intended to generate a prepared email containing:

- To recipients
- CC recipients
- Subject
- Email body
- Form attachments

A fallback process provides:

- Copy Email
- Download Forms

## Document Drop and Pre-Fill

The workstation accepts:

- Part 1 application PDFs
- Illustration PDFs

The documents are used to pre-fill the case profile.

Every extracted value:

- Identifies its source document
- Identifies its source page
- Requires a verification click

The system does not treat extracted information as confirmed until it has been reviewed by the Case Manager.

---

# Core Features

## My Cases

The case queue provides access to cases entered into the workstation.

Planned capabilities include:

- Saved cases
- Case ownership
- Team visibility
- Case handoffs
- Autosave
- Last edited by
- Case history
- Related policies
- Internal notes

The entire Case Manager team can view and edit saved cases so that work can be handed off when necessary.

## Illustration Validator

The existing Python validator currently reads or compares information such as:

- Plan
- Face amount
- Payment frequency
- Insured information
- Signature date

The planned expansion includes:

- Date of birth
- State
- Owner
- Replacement or 1035 information
- Payment or PAC information
- Save Age request
- Additional policy design information

The application and illustration will eventually be used to pre-fill the case profile.

## Save Age

If Save Age is requested, the workstation is intended to:

1. Read the insured's date of birth
2. Read the Part 1 application date
3. Perform the Save Age calculation
4. Display the result
5. Generate applicable case output

For a joint case, Save Age may apply to either insured.

## Forms Library

The Forms Library supports searches using common names such as:

- Part 1
- Owner Form
- ODF
- HIPAA
- HIV
- PAC
- POA
- Trust Certificate
- Beneficiary Form
- Bene Form

Planned search behavior includes:

- Typo tolerance
- One result per form
- State selection
- Pinned frequently used forms
- Automatic state-version selection

Every requirement should map to the correct supporting form or forms.

## Verbiage Center

The Verbiage Center supports standardized generation of:

- Requirements
- Amendments
- Emails
- Initial Review output
- Case documentation

Generated language can be added directly to the Case Output package.

## Reissue Tool

The Reissue Tool is designed for Case Managers and Account Managers.

Supported scenarios include:

- Change after approval
- 90-day reissue using F6126
- Home-office error or internal correction

The tool uses the same decision rules and communication templates as the main workstation.

## Joint and Survivorship Cases

The profile contains:

```text
Insureds: Single / Joint
```

When Joint is selected, the workstation adds:

- A1001 processing
- One insured-signed form per insured
- TreX re-indexing for the second insured's images
- Save Age review for either insured

## Linked Policies

Linked policy behavior depends on the relationship.

### Same Insured

Policies for the same insured can use one combined Initial Review email listing all policy numbers.

The combined email is saved within each linked case.

### Family Relationship

Family-related policies are linked and visible in the concurrent-policy list, but separate emails are generated.

## Change After Approval

The Change After Approval workflow:

- Displays the design before and after the requested change
- Applies Quest underwriting referral rules for non-New York cases
- Applies underwriting and Regulation 187 review rules for New York cases
- Includes LifeBA suitability considerations
- Lists REDESIGN and HOLD system actions
- Uses the user's Outlook templates
- Creates an urgent Outlook draft
- Applies the approved design after approval
- Starts applicable amendments

## Internal Notes

Internal notes are:

- Optional
- Timestamped
- Team visible
- Pinnable
- Excluded from external emails

## CM Profile

The Case Manager profile includes:

- Name
- CM team
- Email
- Time zone
- Remote, hybrid, or office status
- Role
- Out-of-office status
- Backup Case Manager
- Email signature
- Default workstation mode
- Training matrix

The training matrix may include:

- Trust cases
- Corporate cases
- Internal replacements
- External replacements
- 1035 exchanges with loans
- VUL
- New York Regulation 60
- New York Regulation 187
- Unadmitted replacements
- Joint cases
- UL Guard
- Reissues

Cases outside the Case Manager's training profile automatically open in Guided Mode.

When a case is reassigned, the workstation suggests trained Case Managers first.

## Firm Directory

The Firm Directory maps the firm or agency number to:

- Account Manager
- Backup contact
- DocuSign approval status

Managers and Account Manager team leads can edit the directory through the site.

Existing spreadsheet or report data can be imported with a preview before changes are applied.

The workstation uses the directory to:

- Fill in the Account Manager
- Identify backup contacts
- Warn when a firm is not approved for DocuSign

## Questy

Questy is a friendly assistant available from every page.

The intended experience is:

1. The Case Manager asks a processing question.
2. Questy provides a short answer.
3. Questy provides a link to the supporting Quest content.

Example:

> How do I determine the contract state?

The wireframe currently uses sample answers. The production concept is to search available Quest content stored or indexed on the private server.

## Case Timer

The Case Timer was added in response to a management request.

The timer:

- Starts when a case is opened
- Tracks time by checklist stage
- Allows pausing with a reason
- Automatically pauses after inactivity
- Logs corrections
- Stops when **Mark IR Complete** is selected
- Saves timing records with the case

Timer privacy was approved during Round 5.

## Team Insights

Team Insights is available to managers only.

The wireframe includes:

- Average Initial Review time
- Median Initial Review time
- Weekly trends
- New-hire and experienced-CM views
- Time by workflow stage
- Newly trained skill tracking
- CSV export

The newly trained skill view measures Initial Review activity beginning with the recorded **trained since** date.

The purpose of Team Insights is coaching, training support, and process improvement.

It is not intended to create public employee leaderboards.

## My Wins

My Wins is a private page containing:

- Personal badges
- Streak information
- Personal Initial Review time trends
- Peer kudos
- A small celebration after Initial Review completion

Users can turn these features off in Settings.

No public leaderboards are included.

---

# Project Timeline and Decision History

## Project Foundation

### Date

**Exact date not separately documented in the original project notes.**

### Focus

The original project concept established the need for:

- A centralized MMSD Case Manager workstation
- Initial Review support
- Guided processing
- Standalone tools
- Quest links
- A shared visual design
- A case profile capable of driving workflow rules

### Initial Decisions

- The platform should be a workstation rather than a help site.
- Quest should remain the source of record.
- Initial Review should be the starting point.
- The experience should eventually support Interim, Issue, and Delivery.
- New Case Managers should receive guidance.
- Experienced Case Managers should retain fast access to standalone tools.
- The tools should share a consistent input-and-output layout.

---

## Round 1: Initial Workstation Concept

### Date

**Exact date not separately documented in the original project notes.**

### Focus

Round 1 established the first overall workstation structure.

### Decisions and Additions

- Introduced the workstation concept.
- Established Initial Review as the first workflow.
- Identified the need to connect existing tools.
- Established Guided and Expert experiences.
- Introduced stage-based processing.
- Began defining a common application shell.
- Established Quest as a linked source rather than copied content.

---

## Round 2: Dynamic Workflow and Case Output

### Date

**Exact date not separately documented in the original project notes.**

### Focus

Round 2 expanded the workstation from a navigation concept into a profile-driven workflow.

### Decisions and Additions

- Introduced the dynamic Case Profile.
- Added conditional questions.
- Added profile-driven step cards.
- Added visual indicators for conditional steps.
- Added the right rail for profile-specific watch-outs.
- Added the Case Output drawer.
- Added document drop and profile pre-fill.
- Added source-page tagging for extracted values.
- Required user verification for pre-filled values.
- Created two workstation layout options:
  - Option 1: Merged
  - Option 2: Side-by-Side

### Workstation Options

| Option | Description | Trade-Off |
|---|---|---|
| Option 1: Merged | One page and one profile; the existing IR Workbench is rebuilt into workstation steps | More development work, but one continuous experience |
| Option 2: Side-by-Side | Reuses the current IR Workbench and keeps it beside the broader workstation | Less immediate development, but users move between two pages |

At this stage, both options remained under consideration.

---

## Foundation Decisions

### Date

**October 16, 2026**

### Hosting Decision

The proposed production environment is a private MassMutual server.

The Flask application will serve:

- The website
- Application APIs
- Server-side processing

The application will not be publicly hosted.

### Saved Case Decision

Saved cases will use a database on the same private server.

Planned case controls include:

- Windows sign-in
- Full CM-team view and edit access
- Autosave
- Case owner
- Last edited by
- Case history

Full team access supports case handoffs.

### Email Recipient Decision

The initial email-recipient approach will use an editable firm contact list keyed by firm or agency number.

The generated email will:

- Use the firm contact list
- CC the Account Manager

The Account Manager-to-firm mapping was not yet finalized. Account Manager information would be entered manually until that mapping was available.

### Outlook Decision

Both classic Outlook and new Outlook must be supported.

The primary approach is:

```text
Open Draft in Outlook
```

The intended draft includes:

- To
- CC
- Subject
- Email body
- Form PDF attachments

The fallback is:

```text
Copy Email + Download Forms
```

### Form Attachment Decision

Every generated requirement should map to its supporting form or forms.

The workstation should:

- Select the correct state version
- Attach the appropriate forms automatically
- Keep copies of commonly used form PDFs on the private server

### Forms Search Decision

Forms search should support:

- Common form nicknames
- Typo-tolerant searching
- One result per form
- State selection
- Pinned frequently used forms

### Document Pre-Fill Decision

The existing `pdf_validator.py` should be extended.

The existing reader already handles:

- Plan
- Face amount
- Frequency
- Insured
- Signature date

The planned extension includes:

- Date of birth
- State
- Owner
- Replacement or 1035 indicators
- Payment or PAC information
- Save Age requests

When Save Age is requested, the workstation should calculate it using the date of birth and Part 1 date.

---

## Round 3: User Profiles and Advanced Case Types

### Date

**October 16, 2026**

### Focus

Round 3 expanded the workstation to support Case Manager profiles, training, joint business, linked policies, changes after approval, and reissues.

### Decisions and Additions

#### CM Profile

Added `cm-profile.html`.

The profile includes:

- Name
- CM team
- Email
- Time zone
- Work location type
- Role
- Out-of-office information
- Backup coverage
- Email signature
- Default mode
- Training matrix

A **Working As** selector was added to the top bar and Home page to stand in for SSO during the prototype stage.

Cases outside a Case Manager's training profile open in Guided Mode.

Reassignment suggestions prioritize trained Case Managers.

#### Joint and Survivorship Cases

Added:

```text
Insureds: Single / Joint
```

Joint cases add:

- A1001 processing
- One signed form per insured
- TreX re-indexing for the second insured's images
- Save Age review for either insured

#### Linked Policies

For the same insured:

- A combined Initial Review email can list all policy numbers.
- The combined email is saved to each case.

For family-related cases:

- Cases are linked and visible.
- Policies appear in the concurrent-policy list.
- Separate emails are created.

#### Policy Design and Change After Approval

The workstation reads the current policy design from the illustration.

The Change After Approval workflow:

- Displays before-and-after design information
- Applies non-New York underwriting referral rules
- Applies New York underwriting and Regulation 187 rules
- Includes LifeBA suitability review
- Lists REDESIGN and HOLD actions
- Uses the user's two Outlook templates
- Opens an urgent Outlook draft
- Applies the new design after approval
- Begins applicable amendments

#### Reissue Tool

Added `tool-reissue.html`.

The Reissue Tool supports:

- Change after approval
- 90-day reissue using F6126
- Home-office or internal-error correction

The tool is intended for both Case Managers and Account Managers.

#### Internal Notes

Added optional internal notes that are:

- Timestamped
- Team visible
- Pinnable
- Excluded from emails

#### Underwriting Reference

Added a reference link to the Underwriting Requirements Guide ebook.

#### Research Documentation

Supporting research was documented in:

```text
docs/handoff/research/digest-change-after-approval-reissue-joint.md
```

---

## Round 4: Navigation, Branding, Timing, Insights, and Morale

### Date

**October 17, 2026**

### Focus

Round 4 established the navigation direction, visual foundation, case timing, management insights, morale features, and roster behavior.

### Decisions and Additions

#### Navigation

The left sidebar was selected as the navigation structure.

The sidebar:

- Collapses to an icon rail
- Remembers its state
- Separates Work, Tools, Reference, and Management

The CM Profile moved to the settings menu under the user's name in the top-right corner.

#### MassMutual Brand Direction

The prototype uses the following brand colors:

| Token | Value |
|---|---|
| Navy | `#002F6C` |
| Sky | `#4EC8EB` |
| Link | `#0065EE` |
| Dark Gray | `#676869` |
| Medium Gray | `#B3B2B3` |
| Light Gray | `#DBD9D6` |

Additional visual decisions:

- Century Gothic headings
- Navy hero banners
- Sky dot pattern
- Brand icon library stored in `icons/`
- A total of 39 available brand icons in the prototype assets

The colors and visual direction were taken from the available brand icon deck theme because the SharePoint brand guide was not reachable from the development environment.

#### Case Timer

Added a Case Timer based on a management request.

The timer:

- Starts when a case opens
- Tracks each checklist stage
- Supports pause reasons
- Automatically pauses after inactivity
- Logs corrections
- Stops when Initial Review is marked complete
- Saves timing records with the case

#### Team Insights

Added `mgmt-insights.html`.

Team Insights is manager-only and includes:

- Average Initial Review time
- Median Initial Review time
- Weekly trend
- New-hire and experienced-CM views
- CM view sorted by name
- Newly trained skill tracking
- Time by stage
- CSV export

The intended purpose is coaching and process improvement.

#### My Wins

Added `my-wins.html`.

My Wins includes:

- Private badges
- Streak information
- Personal Initial Review timing trend
- Peer kudos
- A small celebration when Initial Review is completed

No public leaderboards are included.

All morale features can be disabled in Settings.

#### Roster

The prototype roster includes:

- CM Team 1
- CM Team 2
- Leadership
- MMSD Account Managers
- MMFA Account Managers
- Listed India GCC associates

The roster supports the **Working As** control.

Private roster information is stored in:

```text
instance/roster.json
roster.local.js
```

These files are:

- Git-ignored
- Excluded from the Docker image

Users with `isManager` in the roster can access Team Insights.

---

## Round 5: Final Workstation Selection and Personalization

### Date

**October 17, 2026**

### Focus

Round 5 finalized the primary workstation design, sidebar behavior, customization, Questy, timer privacy, and Firm Directory.

### Final Decisions

#### Workstation Option Selected

**Option 1, Merged Workstation, was selected.**

Option 2 and the separate IR Workbench were retired.

The retired designs remain in the project for historical reference and comparison.

#### Timer Privacy

Timer privacy was approved.

#### Missing Roster Emails

Missing roster emails will remain blank until confirmed.

They will not be guessed or populated with placeholder addresses.

#### Sidebar Collapse Control

The interface will use one collapse control:

```text
☰
```

The control is located in the top bar.

The former bottom sidebar button was changed to:

```text
✎ Customize sidebar
```

#### Personal Sidebar

Users can:

- Pin tools to **My Shortcuts**
- Hide tools they do not use
- Restore hidden tools
- Save settings by person

#### Customization

Customization can be accessed through the top bar or the user's name menu.

Appearance settings include:

- Light theme
- Dark theme
- High-contrast theme
- Accent color
- Text size

Accessibility settings include:

- Compact mode
- Reduce motion
- Underline links
- Strong focus indicators
- Readable font
- Disable celebrations

Per-page layout settings allow users to:

- Show sections
- Hide sections
- Reorder sections

#### Questy

Added **Ask Quest**, represented by Questy.

Questy appears on every page.

The intended response format is:

- Short answer
- Supporting Quest link

Wireframes use sample answers.

The production concept is to search available Quest pages from the private server.

#### Firm Directory

Added `ref-firm-directory.html`.

The Firm Directory maps the firm or agency number to:

- Account Manager
- Backup contact
- DocuSign-approved status

Editing access is intended for:

- Managers
- Account Manager team leads

The directory supports importing the existing spreadsheet or report with a preview before applying changes.

The workstation uses the directory to:

- Fill in the Account Manager
- Identify backup contacts
- Warn when the firm is not DocuSign approved

---

# Technology and Implementation Direction

## Current Prototype Stack

The current concept uses:

- Python
- Flask
- HTML
- CSS
- JavaScript
- JSON-based prototype data
- Python-based PDF processing
- OCR and document extraction components

## Existing Python Components

The current validator architecture includes:

```text
app.py
pdf_validator.py
```

The Flask application provides the web layer and API routes.

The PDF validator handles document reading, extraction, and comparison logic.

## Production Hosting Direction

The selected direction is:

- Private MassMutual server
- Internal access only
- Windows authentication
- Flask-hosted frontend and APIs
- Database stored on the same approved server

The final infrastructure remains subject to IT and security approval.

## Saved Case Data

Planned saved-case data includes:

- Case profile
- Case owner
- Workflow stage
- Completed steps
- Generated requirements
- Generated amendments
- Case output
- Attached forms
- Internal notes
- Edit history
- Last edited by
- Timer records
- Related policies

## User Data

Planned user-level data includes:

- Profile
- Training matrix
- Default mode
- Sidebar preferences
- Hidden tools
- Pinned shortcuts
- Theme
- Accessibility settings
- Page layout preferences
- My Wins preferences

## Firm Data

Planned firm data includes:

- Firm or agency number
- Firm name
- Account Manager
- Backup contact
- Email recipients
- DocuSign approval status
- Firm-specific processing indicators

---

# Data Privacy and Security

The production design may store client information, including:

- Client names
- Dates of birth
- Policy numbers
- Case processing information
- Uploaded documents
- Generated case records

Before the application can move to production, IT and security must confirm:

- Approved hosting location
- Windows authentication approach
- CM team security group
- Role-based access
- Data retention requirements
- Document retention rules
- Audit expectations
- Backup requirements
- Database security
- File storage security

Uploaded PDFs are processed on the server.

They should not be retained unless they are intentionally attached to a saved case.

Private roster data must not be committed to the repository or included in the Docker image.

---

# Open Decisions

## DocuSign Workflow Behavior

The workstation currently warns when a firm is not approved for DocuSign.

A final decision is still needed:

1. Should the workstation display a warning only?
2. Should it also change the checklist automatically?
3. Should it add wet-signature steps?
4. Should it add mailing steps?
5. Should it prevent eSignature-related actions?

## Missing Roster Information

The following roster information remains incomplete:

- CM Team 1 director email
- MMFA Account Manager emails

The Round 5 decision was to leave these values blank until the correct information is confirmed.

## Account Manager Mapping

The original foundation decision allowed the Account Manager to be typed manually until the firm-to-Account Manager mapping was finalized.

The Firm Directory now provides the intended location for that mapping, but the source data and maintenance process still require final validation.

## Questy Content Access

The wireframe currently uses sample responses.

The production approach still requires confirmation of:

- Which Quest content can be indexed
- Where content can be stored
- How content updates will be synchronized
- How links will continue to point to the official source
- Which access controls must be preserved

## Production Infrastructure

The private-server direction has been selected, but final approval is still needed for:

- Server ownership
- Deployment process
- Authentication
- Database
- Backups
- Monitoring
- Support ownership

---

# Implementation Plan

## Phase 1: Approve the Experience

- Review the complete sitemap
- Review the Merged Workstation
- Confirm the shared layout
- Confirm Guided and Expert behavior
- Confirm the case profile
- Confirm conditional workflows
- Confirm manager access
- Resolve remaining open decisions

## Phase 2: Create the Production Design System

- Convert prototype colors into reusable CSS variables
- Build the approved layouts in `wireframe.css`
- Standardize buttons
- Standardize cards
- Standardize forms
- Standardize tool output
- Standardize responsive behavior
- Apply accessibility settings
- Apply approved MassMutual brand direction

## Phase 3: Build Workflow Data

Create the workstation step data in:

```text
scripts/mmsd-guide-data.js
```

The `steps` structure should be built from the research digests stored in:

```text
docs/handoff/research/
```

Each step should identify:

- Stage
- Phase
- Title
- Required action
- Guided explanation
- Show rule
- Hide rule
- Triggering profile value
- Applicable state
- Applicable product
- Applicable owner type
- Applicable firm
- Quest link
- Tool link
- Output behavior
- Required forms

## Phase 4: Build the Workstation Renderer

The renderer should:

- Read the case profile
- Determine which steps apply
- Display the selected workflow
- Separate Guided and Expert behavior
- Track completion
- Add generated content to Case Output
- Save progress
- Restore saved cases
- Support case handoffs

## Phase 5: Integrate Existing Tools

Integrate and re-skin:

- Verbiage Center
- Amendment Builder
- Email Generator
- Illustration Validator
- Save Age
- State Forms
- Forms Library
- Reissue Tool
- Firm Directory

## Phase 6: Expand Document Extraction

Extend `pdf_validator.py` to extract:

- Date of birth
- State
- Owner information
- Replacement indicators
- 1035 indicators
- Loan information
- Payment method
- PAC selection
- Save Age request
- Additional policy design values

Extracted values must:

- Identify the source document
- Identify the page
- Require verification
- Preserve the original source value
- Avoid silently overwriting confirmed user entries

## Phase 7: Add Data Persistence

Implement storage for:

- Saved cases
- Case history
- User profiles
- Training data
- User settings
- Firm Directory
- Internal notes
- Timer data
- Linked policies

## Phase 8: Add Outlook Output

Implement the approved email approach:

1. Open a prepared Outlook draft when supported.
2. Include To, CC, subject, body, and applicable attachments.
3. Provide Copy Email and Download Forms as the fallback.
4. Support both classic and new Outlook environments.

## Phase 9: Add Questy

Replace sample answers with an approved Quest content search.

Questy must:

- Provide a short answer
- Link to the official Quest source
- Respect access permissions
- Avoid positioning the workstation as the source of record

---

# Testing Strategy

## Unit Tests

Unit tests should cover:

- Conditional workflow rules
- Case profile rules
- State rules
- Product rules
- Owner rules
- Replacement rules
- 1035-with-loan rules
- Joint case rules
- Save Age calculations
- Form mapping
- Email output
- Requirement output
- Amendment output

## Document Extraction Tests

Document tests should verify:

- Correct page selection
- Plan extraction
- Face amount extraction
- Insured extraction
- Signature-date extraction
- Date-of-birth extraction
- State extraction
- Owner extraction
- Replacement extraction
- PAC extraction
- Save Age request extraction
- Application-to-illustration comparison

## Save Age Smoke Tests

Smoke tests should include:

- Single insured
- Joint insured
- Save Age for first insured
- Save Age for second insured
- Missing date of birth
- Missing Part 1 date
- Invalid extracted date
- User-corrected value
- No Save Age requested

## Workflow Click-Through

The click-through test should verify:

1. Open Home.
2. Open or create a case.
3. Upload documents.
4. Verify extracted fields.
5. Complete Initial Review.
6. Generate requirements.
7. Generate amendments.
8. Add applicable forms.
9. Open Case Output.
10. Create the email draft.
11. Save the case.
12. Reopen the case.
13. Confirm history and ownership.
14. Hand the case to another Case Manager.
15. Continue through Interim, Issue, and Delivery.

## Accessibility Testing

Accessibility testing should include:

- Keyboard navigation
- Focus indicators
- High-contrast mode
- Reduced-motion mode
- Text resizing
- Underlined links
- Readable font mode
- Screen-reader labeling
- Color contrast
- Responsive layouts

## Security Testing

Before production, testing should include:

- Authentication
- Authorization
- Manager-only access
- Data isolation
- Uploaded-file handling
- File retention
- Database access
- Audit history
- Roster file exclusion
- Docker image review
- Error-message review

---

# Success Criteria

The project will be considered successful if it:

- Reduces missed requirements
- Reduces repetitive data entry
- Reduces time spent searching for forms
- Reduces movement between unrelated systems
- Improves the consistency of requirements and amendments
- Helps new Case Managers process unfamiliar work
- Allows experienced Case Managers to work efficiently
- Supports complex case types
- Improves case handoffs
- Provides one consistent Case Manager experience
- Maintains Quest as the source of record
- Supports approved privacy and security requirements

---

# Presentation Summary

The MMSD Case Manager Workstation is designed to bring together the tools and information Case Managers already use and organize them around the actual lifecycle of a case.

The workstation creates one profile for the case and uses that profile to determine:

- Which steps apply
- Which forms are needed
- Which watch-outs should appear
- Which Quest references are relevant
- Which requirements and amendments should be generated
- Which information should be included in the email

The selected design is the **Merged Workstation**, finalized on **October 17, 2026**.

This design keeps the case profile, workflow, tools, guidance, references, and output in one experience.

The project progressed from a basic Initial Review concept into a broader workstation that now includes:

- Dynamic workflow rules
- Document pre-fill
- Guided and Expert modes
- Case collaboration
- Joint and linked-policy support
- Change-after-approval processing
- Reissue processing
- Firm-specific processing
- Case timing
- Manager insights
- Personalization
- Accessibility
- Questy
- Firm Directory
- Outlook output

The next major milestone is to move from approved wireframes into production-oriented styling, structured workflow data, tool integration, persistence, and testing.

---

# Project Summary

This project started with a straightforward question:

> How can the daily Case Manager experience be made easier, faster, and more consistent without replacing the systems and official resources already in place?

The answer developed into the MMSD Case Manager Workstation.

It is intended to become a practical workspace where Case Managers can manage a case, understand what applies, complete the correct actions, use the appropriate tools, and produce consistent output from Initial Review through Delivery.