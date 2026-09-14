# DDS-05B – TESTBUILD 1 Identity / Cache-Buster Implementation Authorization

Status: AUTHORIZED

## Basis

Implementation Scope Reconciliation commit: `914a676f5f76b70a7af1544811f0be55ea04ed46`

## Authorized target identity

- Visible build label: `DDS-05B · TESTBUILD 1`
- Canonical/cache build id: `DDS-05B-TB1`

## Exact authorized file scope

Only these three existing files may be changed:

1. `index.html`
2. `src/dds-04f/browser-app.mjs`
3. `tests/dds-05a/testbuild-cache-busting.test.mjs`

## Authorized changes

### index.html
Replace the active DDS-05A TESTBUILD 3.1 identity/cache references with DDS-05B TESTBUILD 1 consistently in the visible title/header, `data-build-id`, CSS cache-buster, and browser entry cache-buster.

### src/dds-04f/browser-app.mjs
Replace the active expected build id and active module-import cache ids from `DDS-05A-TB3.1` to `DDS-05B-TB1`. Preserve the existing build-id derivation and propagation behavior.

### tests/dds-05a/testbuild-cache-busting.test.mjs
Update only the existing build-identity/cache-busting contract assertions and example URLs from TESTBUILD 3.1 / `DDS-05A-TB3.1` to TESTBUILD 1 / `DDS-05B-TB1`, while retaining the existing behavioral coverage.

## Explicitly unchanged / not authorized

- no construction controller changes
- no visible-grid geometry or styling changes
- no FLOOR footprint, scale, anchor, snap or placement correction
- no WALL correction
- no atlas manifest/image changes
- no sprite-presentation changes
- no projection changes
- no workflow/CI changes
- no additional capability
- no DDS-05C+ work

The supplied iPhone screenshots are evidence for the upcoming separate FLOOR/Grid Footprint Calibration: adjacent logical FLOOR targets currently render with excessive visual spacing. That observation is recorded as follow-up context only and is not authorized for correction in this identity step.

## Required result of later implementation

After the separately executed implementation, an iPhone reload must visibly identify the active page as `DDS-05B · TESTBUILD 1`, and the active CSS/browser/module/atlas request chain must consistently propagate `DDS-05B-TB1`. Regression must then be re-run before this identity change is considered verified.
