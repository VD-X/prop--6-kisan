**Scope**
- Add unit selection for crop quantity, min order quantity, and price per unit in the Farmer add flow.
- Support common units: kg, quintal (100 kg), ton (1000 kg), gram (0.001 kg).
- Normalize values to kg internally for consistency while preserving chosen units as metadata.

**Data Model**
- Update listing type in [types.ts](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/types.ts):
  - quantityUnit: 'kg' | 'quintal' | 'ton' | 'gram'
  - minOrderQuantityUnit: same union
  - priceUnit: 'per_kg' | 'per_quintal' | 'per_ton' | 'per_gram'
- Keep existing numeric fields as kg-normalized when publishing: quantity, availableQuantity in kg; pricePerKg as price normalized to per kg.

**Conversion Helpers**
- Add pure helpers in [App.tsx](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx):
  - toKg(value, unit)
  - fromKg(valueKg, unit)
  - priceToPerKg(value, priceUnit)
  - priceFromPerKg(valuePerKg, priceUnit)

**Farmer UI Changes (Step 2)**
- Replace labels:
  - "Available Quantity (KG)" → Quantity input + unit select
  - "Expected Price (₹/KG)" → Price input + unit select
  - "Min. Order Qty (KG)" → Input + unit select
- Show dynamic hint under inputs displaying the kg-normalized equivalent for clarity.
- Files to modify: [App.tsx:Step 2 inputs](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx#L1866-L1960)

**Publish Flow**
- In publishListing in [App.tsx](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx#L832-L881):
  - Convert quantity and minOrderQuantity to kg via toKg before assigning to listing fields.
  - Convert price to per_kg via priceToPerKg.
  - Persist selected units in new fields (quantityUnit, minOrderQuantityUnit, priceUnit).

**Edit Flow**
- When editing an existing listing:
  - Pre-populate inputs using fromKg and priceFromPerKg with stored units; default units to 'kg' if missing.
  - Maintain unit selectors and live conversion hints.

**Display**
- My Crops cards in [App.tsx](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx#L1240-L1315):
  - Show quantity in chosen unit (e.g., “5 Quintal”), and price as ₹/chosen unit.
  - Retain normalized data for calculations but format for UI using fromKg/priceFromPerKg.

**Validation**
- Inputs must be positive numbers; enforce minimums (e.g., > 0).
- Changing unit recalculates normalized preview without losing precision.
- Guard against nonsensical combinations (e.g., very large grams values causing overflow in kg).

**Migration / Defaults**
- Existing listings: assume unit 'kg' for quantity/minOrder and 'per_kg' for price when units are absent.

**Optional (Later)**
- Transporter capacity unit selector to match listing units for better UX.
- Server-side validation and conversions when backend exists.

**Testing**
- Manual verification: enter values across units, toggle units, ensure publish stores normalized kg and UI shows selected units.
- Edge cases: 0/empty values, unit changes after input, large ton values.

If approved, I will implement the unit selectors, conversion helpers, update types, wire publish/edit/display flows, and validate end-to-end in the running dev server.