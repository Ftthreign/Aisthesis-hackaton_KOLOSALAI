"use client";

import { Store, ShoppingBag, Instagram } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyBlock } from "@/components/ui/copy-button";
import type { Marketplace } from "@/lib/api/types";

interface MarketplaceCardProps {
  marketplace: Marketplace;
}

export function MarketplaceCard({ marketplace }: MarketplaceCardProps) {
  const shopeeDesc = marketplace.shopee_desc ?? "";
  const tokopediaDesc = marketplace.tokopedia_desc ?? "";
  const instagramDesc = marketplace.instagram_desc ?? "";

  const hasContent = shopeeDesc || tokopediaDesc || instagramDesc;

  // Determine default tab based on available content
  const defaultTab = shopeeDesc
    ? "shopee"
    : tokopediaDesc
      ? "tokopedia"
      : instagramDesc
        ? "instagram"
        : "shopee";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Marketplace Descriptions
        </CardTitle>
        <CardDescription>
          Platform-optimized product descriptions ready to use
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasContent ? (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="shopee"
                className="flex items-center gap-2"
                disabled={!shopeeDesc}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Shopee</span>
              </TabsTrigger>
              <TabsTrigger
                value="tokopedia"
                className="flex items-center gap-2"
                disabled={!tokopediaDesc}
              >
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Tokopedia</span>
              </TabsTrigger>
              <TabsTrigger
                value="instagram"
                className="flex items-center gap-2"
                disabled={!instagramDesc}
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </TabsTrigger>
            </TabsList>

            {shopeeDesc && (
              <TabsContent value="shopee" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShoppingBag className="h-4 w-4 text-orange-500" />
                    <span>Optimized for Shopee marketplace</span>
                  </div>
                  <CopyBlock text={shopeeDesc} maxHeight="300px" />
                </div>
              </TabsContent>
            )}

            {tokopediaDesc && (
              <TabsContent value="tokopedia" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Store className="h-4 w-4 text-green-500" />
                    <span>Optimized for Tokopedia marketplace</span>
                  </div>
                  <CopyBlock text={tokopediaDesc} maxHeight="300px" />
                </div>
              </TabsContent>
            )}

            {instagramDesc && (
              <TabsContent value="instagram" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Instagram className="h-4 w-4 text-pink-500" />
                    <span>Optimized for Instagram posts</span>
                  </div>
                  <CopyBlock text={instagramDesc} maxHeight="300px" />
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No marketplace descriptions available yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
