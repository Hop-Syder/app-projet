-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'PREPARER', 'STOCK_MANAGER', 'ORDER_MANAGER', 'DELIVERY_DRIVER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "SaleMode" AS ENUM ('FIXED_WEIGHT', 'PER_KG', 'VARIABLE_WEIGHT', 'LIVE_ANIMAL', 'PIECE');

-- CreateEnum
CREATE TYPE "ConservationType" AS ENUM ('FRESH', 'FROZEN', 'CHILLED', 'AMBIENT');

-- CreateEnum
CREATE TYPE "AnimalType" AS ENUM ('BOEUF', 'MOUTON', 'CHEVRE', 'PORC', 'LAPIN', 'VOLAILLE', 'POISSON', 'AUTRE');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'EXPIRED', 'LOST', 'ADJUSTED');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('RETAIL', 'RESTAURANT', 'DELIVERY', 'TAKEAWAY');

-- CreateEnum
CREATE TYPE "ConsumptionMode" AS ENUM ('DINING_IN', 'TAKEAWAY', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'PREPARING', 'CUTTING', 'PACKAGING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'INITIATED', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'WALLET');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'RETURNED');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_DELIVERY');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_CONFIRMED', 'ORDER_PREPARING', 'ORDER_READY', 'ORDER_OUT_FOR_DELIVERY', 'ORDER_DELIVERED', 'ORDER_CANCELLED', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED', 'PROMOTION', 'GENERAL');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PERMISSION_CHANGE', 'ORDER_STATUS_CHANGE', 'PAYMENT_PROCESS', 'STOCK_ADJUSTMENT', 'PRICE_CHANGE', 'EXPORT_DATA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultAddressId" TEXT,
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Bénin',
    "phone" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deliveryInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseFee" DECIMAL(10,2) NOT NULL,
    "feePerKm" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minOrderAmount" DECIMAL(10,2),
    "maxDeliveryDistance" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "estimatedTimeMin" INTEGER NOT NULL DEFAULT 30,
    "estimatedTimeMax" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZoneAddress" (
    "id" TEXT NOT NULL,
    "deliveryZoneId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryZoneAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "AnimalType" NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "categoryId" TEXT NOT NULL,
    "animalId" TEXT,
    "saleMode" "SaleMode" NOT NULL DEFAULT 'FIXED_WEIGHT',
    "price" DECIMAL(10,2) NOT NULL,
    "pricePerKg" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "minWeight" DECIMAL(8,3),
    "maxWeight" DECIMAL(8,3),
    "weightStep" DECIMAL(8,3) DEFAULT 0.1,
    "defaultWeight" DECIMAL(8,3),
    "weightTolerance" DECIMAL(8,3) DEFAULT 0.1,
    "conservationType" "ConservationType" NOT NULL DEFAULT 'FRESH',
    "storageTempMin" DECIMAL(5,2),
    "storageTempMax" DECIMAL(5,2),
    "shelfLifeDays" INTEGER,
    "origin" TEXT,
    "producer" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "orderCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceModifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CutOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagingOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceModifier" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PackagingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVideo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "lotId" TEXT,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "status" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "productionDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "bestBeforeDate" TIMESTAMP(3),
    "location" TEXT,
    "batchNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "animalId" TEXT,
    "origin" TEXT,
    "producer" TEXT,
    "productionDate" TIMESTAMP(3) NOT NULL,
    "slaughterDate" TIMESTAMP(3),
    "processingDate" TIMESTAMP(3),
    "veterinaryCert" TEXT,
    "qualityCert" TEXT,
    "initialQuantity" DECIMAL(10,3) NOT NULL,
    "currentQuantity" DECIMAL(10,3) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "reason" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "performedBy" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "openingHours" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "rating" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantTable" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "tableNumber" TEXT NOT NULL,
    "name" TEXT,
    "qrCode" TEXT NOT NULL,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenu" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenuItem" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "seasoningOptions" JSONB,
    "sideOptions" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdById" TEXT,
    "orderType" "OrderType" NOT NULL DEFAULT 'RETAIL',
    "consumptionMode" "ConsumptionMode" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "deliveryAddressId" TEXT,
    "restaurantId" TEXT,
    "tableId" TEXT,
    "deliveryZoneId" TEXT,
    "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deliveryInstructions" TEXT,
    "scheduledDeliveryAt" TIMESTAMP(3),
    "estimatedDeliveryAt" TIMESTAMP(3),
    "actualDeliveryAt" TIMESTAMP(3),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "totalEstimatedWeight" DECIMAL(10,3),
    "totalActualWeight" DECIMAL(10,3),
    "weightDifference" DECIMAL(10,3),
    "finalAmount" DECIMAL(10,2),
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "paymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "couponCode" TEXT,
    "couponDiscount" DECIMAL(10,2),
    "customerNotes" TEXT,
    "internalNotes" TEXT,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "inventoryItemId" TEXT,
    "cutOptionId" TEXT,
    "cutOptionName" TEXT,
    "packagingOptionId" TEXT,
    "packagingOptionName" TEXT,
    "seasoning" JSONB,
    "sides" JSONB,
    "requestedWeight" DECIMAL(10,3),
    "estimatedWeight" DECIMAL(10,3) NOT NULL,
    "actualWeight" DECIMAL(10,3),
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "pricePerUnit" DECIMAL(10,2) NOT NULL,
    "pricePerKg" DECIMAL(10,2),
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "estimatedSubtotal" DECIMAL(10,2) NOT NULL,
    "finalSubtotal" DECIMAL(10,2),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XOF',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "provider" TEXT,
    "providerData" JSONB,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "deliveryZoneId" TEXT,
    "driverId" TEXT,
    "assignedAt" TIMESTAMP(3),
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "distance" DECIMAL(10,2),
    "estimatedDuration" INTEGER,
    "trackingData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "minOrderAmount" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "perUserLimit" INTEGER,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applicableCategories" TEXT[],
    "applicableProducts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionProduct" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "promotionId" TEXT,
    "customerId" TEXT,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "usedByOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT,
    "restaurantId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "comment" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "adminResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "channels" "NotificationChannel"[],
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "Customer_userId_idx" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");

-- CreateIndex
CREATE INDEX "Address_city_idx" ON "Address"("city");

-- CreateIndex
CREATE INDEX "DeliveryZone_name_idx" ON "DeliveryZone"("name");

-- CreateIndex
CREATE INDEX "DeliveryZoneAddress_deliveryZoneId_idx" ON "DeliveryZoneAddress"("deliveryZoneId");

-- CreateIndex
CREATE INDEX "DeliveryZoneAddress_addressId_idx" ON "DeliveryZoneAddress"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZoneAddress_deliveryZoneId_addressId_key" ON "DeliveryZoneAddress"("deliveryZoneId", "addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Animal_slug_key" ON "Animal"("slug");

-- CreateIndex
CREATE INDEX "Animal_slug_idx" ON "Animal"("slug");

-- CreateIndex
CREATE INDEX "Animal_type_idx" ON "Animal"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_slug_idx" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_animalId_idx" ON "Product"("animalId");

-- CreateIndex
CREATE INDEX "Product_isAvailable_idx" ON "Product"("isAvailable");

-- CreateIndex
CREATE INDEX "Product_saleMode_idx" ON "Product"("saleMode");

-- CreateIndex
CREATE INDEX "CutOption_productId_idx" ON "CutOption"("productId");

-- CreateIndex
CREATE INDEX "PackagingOption_productId_idx" ON "PackagingOption"("productId");

-- CreateIndex
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");

-- CreateIndex
CREATE INDEX "ProductVideo_productId_idx" ON "ProductVideo"("productId");

-- CreateIndex
CREATE INDEX "InventoryItem_productId_idx" ON "InventoryItem"("productId");

-- CreateIndex
CREATE INDEX "InventoryItem_lotId_idx" ON "InventoryItem"("lotId");

-- CreateIndex
CREATE INDEX "InventoryItem_status_idx" ON "InventoryItem"("status");

-- CreateIndex
CREATE INDEX "InventoryItem_expirationDate_idx" ON "InventoryItem"("expirationDate");

-- CreateIndex
CREATE UNIQUE INDEX "Lot_lotNumber_key" ON "Lot"("lotNumber");

-- CreateIndex
CREATE INDEX "Lot_lotNumber_idx" ON "Lot"("lotNumber");

-- CreateIndex
CREATE INDEX "Lot_animalId_idx" ON "Lot"("animalId");

-- CreateIndex
CREATE INDEX "StockMovement_inventoryItemId_idx" ON "StockMovement"("inventoryItemId");

-- CreateIndex
CREATE INDEX "StockMovement_movementType_idx" ON "StockMovement"("movementType");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE INDEX "Restaurant_slug_idx" ON "Restaurant"("slug");

-- CreateIndex
CREATE INDEX "Restaurant_city_idx" ON "Restaurant"("city");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTable_qrCode_key" ON "RestaurantTable"("qrCode");

-- CreateIndex
CREATE INDEX "RestaurantTable_restaurantId_idx" ON "RestaurantTable"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantTable_qrCode_idx" ON "RestaurantTable"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantTable_restaurantId_tableNumber_key" ON "RestaurantTable"("restaurantId", "tableNumber");

-- CreateIndex
CREATE INDEX "RestaurantMenu_restaurantId_idx" ON "RestaurantMenu"("restaurantId");

-- CreateIndex
CREATE INDEX "RestaurantMenuItem_menuId_idx" ON "RestaurantMenuItem"("menuId");

-- CreateIndex
CREATE INDEX "RestaurantMenuItem_productId_idx" ON "RestaurantMenuItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_orderNumber_idx" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentStatus_idx" ON "Order"("paymentStatus");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_consumptionMode_idx" ON "Order"("consumptionMode");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- CreateIndex
CREATE INDEX "Delivery_orderId_idx" ON "Delivery"("orderId");

-- CreateIndex
CREATE INDEX "Delivery_driverId_idx" ON "Delivery"("driverId");

-- CreateIndex
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");

-- CreateIndex
CREATE INDEX "Promotion_code_idx" ON "Promotion"("code");

-- CreateIndex
CREATE INDEX "Promotion_isActive_idx" ON "Promotion"("isActive");

-- CreateIndex
CREATE INDEX "PromotionProduct_promotionId_idx" ON "PromotionProduct"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionProduct_productId_idx" ON "PromotionProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionProduct_promotionId_productId_key" ON "PromotionProduct"("promotionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_customerId_idx" ON "Coupon"("customerId");

-- CreateIndex
CREATE INDEX "Review_orderId_idx" ON "Review"("orderId");

-- CreateIndex
CREATE INDEX "Review_customerId_idx" ON "Review"("customerId");

-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Review_isApproved_idx" ON "Review"("isApproved");

-- CreateIndex
CREATE INDEX "Favorite_customerId_idx" ON "Favorite"("customerId");

-- CreateIndex
CREATE INDEX "Favorite_productId_idx" ON "Favorite"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_customerId_productId_key" ON "Favorite"("customerId", "productId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryZoneAddress" ADD CONSTRAINT "DeliveryZoneAddress_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryZoneAddress" ADD CONSTRAINT "DeliveryZoneAddress_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CutOption" ADD CONSTRAINT "CutOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagingOption" ADD CONSTRAINT "PackagingOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVideo" ADD CONSTRAINT "ProductVideo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantTable" ADD CONSTRAINT "RestaurantTable_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenu" ADD CONSTRAINT "RestaurantMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenuItem" ADD CONSTRAINT "RestaurantMenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "RestaurantMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenuItem" ADD CONSTRAINT "RestaurantMenuItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "RestaurantTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
