-- CreateEnum
CREATE TYPE "ServiceAppointmentStatus" AS ENUM ('pending', 'scheduled', 'rejected');

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "workSchedule" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoServiceOnCategory" (
    "autoServiceId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "AutoServiceOnCategory_pkey" PRIMARY KEY ("autoServiceId","categoryId")
);

-- CreateTable
CREATE TABLE "ServiceAppointment" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "garageVehicleId" TEXT NOT NULL,
    "autoServiceId" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "status" "ServiceAppointmentStatus" NOT NULL DEFAULT 'pending',
    "scheduledAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceAppointment_number_key" ON "ServiceAppointment"("number");

-- CreateIndex
CREATE INDEX "AutoService_city_idx" ON "AutoService"("city");

-- CreateIndex
CREATE INDEX "ServiceAppointment_userId_idx" ON "ServiceAppointment"("userId");

-- CreateIndex
CREATE INDEX "ServiceAppointment_status_idx" ON "ServiceAppointment"("status");

-- CreateIndex
CREATE INDEX "ServiceAppointment_autoServiceId_idx" ON "ServiceAppointment"("autoServiceId");

-- AddForeignKey
ALTER TABLE "AutoServiceOnCategory" ADD CONSTRAINT "AutoServiceOnCategory_autoServiceId_fkey" FOREIGN KEY ("autoServiceId") REFERENCES "AutoService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoServiceOnCategory" ADD CONSTRAINT "AutoServiceOnCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_garageVehicleId_fkey" FOREIGN KEY ("garageVehicleId") REFERENCES "GarageVehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointment" ADD CONSTRAINT "ServiceAppointment_autoServiceId_fkey" FOREIGN KEY ("autoServiceId") REFERENCES "AutoService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
