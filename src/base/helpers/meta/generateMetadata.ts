import { AlternatesMetadata } from "./generate/alternate";
import {
  AppleWebAppMeta,
  BasicMeta,
  FacebookMeta,
  FormatDetectionMeta,
  ItunesMeta,
  PinterestMeta,
  VerificationMeta,
} from "./generate/basic";
import { IconsMetadata } from "./generate/icons";
import { MetaFilter } from "./generate/meta";
import {
  AppLinksMeta,
  OpenGraphMetadata,
  TwitterMetadata,
} from "./generate/opengraph";
import { resolveMetadata } from "./resolver/resolve-metadata";
import { Metadata, ResolvedMetadata } from "./types/metadata-interface";

function createMetadataElements(metadata: ResolvedMetadata) {
  return MetaFilter([
    BasicMeta({ metadata }),
    AlternatesMetadata({ alternates: metadata.alternates }),
    ItunesMeta({ itunes: metadata.itunes }),
    FacebookMeta({ facebook: metadata.facebook }),
    PinterestMeta({ pinterest: metadata.pinterest }),
    FormatDetectionMeta({ formatDetection: metadata.formatDetection }),
    VerificationMeta({ verification: metadata.verification }),
    AppleWebAppMeta({ appleWebApp: metadata.appleWebApp }),
    OpenGraphMetadata({ openGraph: metadata.openGraph }),
    TwitterMetadata({ twitter: metadata.twitter }),
    AppLinksMeta({ appLinks: metadata.appLinks }),
    IconsMetadata({ icons: metadata.icons }),
  ]);
}

export function generateMetadata(metadata: Metadata) {
  const url = new URL(window.location.href);
  const resolvedMetadata = resolveMetadata(metadata, url);
  return createMetadataElements(resolvedMetadata);
}

// export async function getMetadata(metadata: Metadata) {
//   const selfurl = process.env.NEXT_PUBLIC_SELF_URL;
//   const headersStore = await headers();

//   // const url = new URL(headersStore.get("host") || selfurl);

//   const resolvedMetadata = resolveMetadata(metadata, url);
//   return createMetadataElements(resolvedMetadata);
// }
