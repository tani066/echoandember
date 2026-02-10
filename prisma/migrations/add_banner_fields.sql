-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "banner1Text" TEXT NOT NULL DEFAULT 'Welcome to Echo & Ember • Handcrafted Gifts • Made with Love',
ADD COLUMN IF NOT EXISTS "banner1Visible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "banner2Text" TEXT NOT NULL DEFAULT 'Free Shipping on all orders above ₹999 • Pan India Delivery',
ADD COLUMN IF NOT EXISTS "banner2Visible" BOOLEAN NOT NULL DEFAULT true;
