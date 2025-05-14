import { ResolvedMetadata } from "next";
import { MetaFilter } from "./generate/meta";
import {
  AppleWebAppMeta,
  BasicMeta,
  FacebookMeta,
  FormatDetectionMeta,
  ItunesMeta,
  PinterestMeta,
  VerificationMeta,
} from "./generate/basic";
import { AlternatesMetadata } from "./generate/alternate";
import {
  AppLinksMeta,
  OpenGraphMetadata,
  TwitterMetadata,
} from "./generate/opengraph";
import { IconsMetadata } from "./generate/icons";

export function createMetadataElements(metadata: ResolvedMetadata) {
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
