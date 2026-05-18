-- CreateTable
CREATE TABLE "ServiceAppointmentOnCategory" (
    "appointmentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ServiceAppointmentOnCategory_pkey" PRIMARY KEY ("appointmentId","categoryId")
);

-- AddForeignKey
ALTER TABLE "ServiceAppointmentOnCategory" ADD CONSTRAINT "ServiceAppointmentOnCategory_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "ServiceAppointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceAppointmentOnCategory" ADD CONSTRAINT "ServiceAppointmentOnCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
