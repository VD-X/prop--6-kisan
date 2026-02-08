**Scope**
- Allow farmers to attach one short video (≤ 60s) when adding a crop listing.
- Enforce duration and size limits client-side, show preview and metadata, and persist alongside images.

**Data Model Changes**
- Extend CropListing with optional video fields in [types.ts](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/types.ts):
  - videoUrl (string)
  - videoDurationSec (number)
  - videoSizeBytes (number)
  - videoType ("video/mp4" | "video/webm")
  - videoThumbnail (string base64, optional)

**Farmer UI Changes**
- In FarmerDashboard add-flow (step where images are added) in [App.tsx](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx#L791-L830):
  - Add a file input for video: accept="video/mp4,video/webm" (limit one file).
  - Capture from camera on mobile ("capture" attribute where supported).
  - Show inline video preview and metadata (duration, size).
  - Allow remove/replace.

**Client Validation**
- On selection, create Object URL and load into a hidden HTMLVideoElement; wait for loadedmetadata:
  - Reject if duration > 60s and show an error.
  - Optionally limit size to ≤ 50MB (configurable).
  - Generate a thumbnail by seeking to ~1s and drawing to canvas, store as base64.

**State Additions**
- In FarmerDashboard state, add video state: { url, durationSec, sizeBytes, type, thumbnail }.
- Reset video state on publish/cancel like images.

**Publish Flow**
- Include video fields in listingData in publishListing in [App.tsx](file:///c:/Users/visha/OneDrive/Desktop/vdx-kisan/Prop--1-Kisan-main/App.tsx#L832-L856).
- Keep images flow unchanged; video is optional.

**Display**
- In My Crops/listing cards (existing views in FarmerDashboard), show video player if videoUrl exists; else show first image. Use poster=videoThumbnail.

**Production Notes**
- Current app is in-memory; for production, upload the video to a storage service (S3/Cloudinary) and save a CDN URL plus metadata.
- Sanitize file type/size server-side and transcode to H.264/mp4 or VP9/webm.

**Testing**
- Manual: try videos <60s and >60s to validate rejection.
- Edge cases: missing metadata, large files, mobile capture.

If you approve, I’ll implement these changes, wire up the UI, and verify in the running dev server.