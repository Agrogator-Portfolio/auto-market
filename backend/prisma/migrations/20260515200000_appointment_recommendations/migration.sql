-- CreateTable
CREATE TABLE "ServiceAppointmentRecommendation" (
    "appointmentId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceAppointmentRecommendation_pkey" PRIMARY KEY ("appointmentId","productId")
);

-- AddForeignKey
ALTER TABLE "ServiceAppointmentRecommendation" ADD CONSTRAINT "ServiceAppointmentRecommendation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "ServiceAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointmentRecommendation" ADD CONSTRAINT "ServiceAppointmentRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
