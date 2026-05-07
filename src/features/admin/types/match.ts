export type Match = {
    id: string;
    title: string;
    isLocked: boolean;
    buyWindowOpenAt: Date | null;
    buyWindowCloseAt: Date | null;
    squadLockAt: Date | null;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
    updatedAt: Date;
}