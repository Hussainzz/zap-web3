-- CreateTable
CREATE TABLE `flowActionLogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowId` INTEGER NOT NULL,
    `flowActionId` INTEGER NOT NULL,
    `status` VARCHAR(20) NULL,
    `resultPayload` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `flowActionLogs` ADD CONSTRAINT `flowActionLogs_flowId_fkey` FOREIGN KEY (`flowId`) REFERENCES `flows`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flowActionLogs` ADD CONSTRAINT `flowActionLogs_flowActionId_fkey` FOREIGN KEY (`flowActionId`) REFERENCES `flowActions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
