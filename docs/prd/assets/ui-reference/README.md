# UI Reference Image Set

This folder contains AI-generated bitmap reference mockups for the temporary email frontend redesign PRD.

These images are visual references, not exact implementation screenshots. Use them to align layout, hierarchy, product states, and interaction surfaces before implementing Vue components.

## Images

1. `01-desktop-inbox-workspace.png`  
   Desktop inbox workspace: current mailbox card, active address, retention badge, plan usage, inbox list, and reader pane.

2. `02-create-mailbox-domain-quota.png`  
   Create mailbox flow: mailbox name, searchable domain selector, per-IP per-domain quota, random subdomain option, retention preview, and upgrade prompt.

3. `03-address-management-switching.png`  
   Multi-mailbox management: address library, current mailbox, retention states, copy/credential/switch/upgrade/unbind/delete/transfer actions.

4. `04-plans-permanent-upgrade.png`  
   Paid plans and permanent mailbox upgrade: Free/Plus/Pro comparison, retention timeline, and single-address permanent add-on.

5. `05-mobile-mailbox-flow.png`  
   Mobile reference: current mailbox, inbox list, switch mailbox drawer, message reader, and upgrade-to-permanent prompt.

6. `06-admin-retention-policies.png`  
   Admin retention and cleanup reference: daily cleanup, retention policies by plan, per-IP per-domain quota, role entitlements, and protected mailbox list.

## Design Notes

- Keep the product as a workbench, not a marketing landing page.
- Use the images for layout and hierarchy, but implement UI with project-native Vue and Naive UI components.
- Do not copy text blindly from generated images; use the PRD and i18n files as source of truth.
- Paid and permanent-mailbox states must be enforced by backend roles and retention policy, not by frontend-only state.
