import dayjs, { Dayjs } from "dayjs";

export const DATE_RANGES: Record<string, [Dayjs, Dayjs]> = {
    Yesterday: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    Today: [dayjs(), dayjs()],
    'Last 3 Days': [dayjs().subtract(3, 'days'), dayjs()],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
    ],
    'This Year': [dayjs().startOf('year'), dayjs().endOf('year')],
};