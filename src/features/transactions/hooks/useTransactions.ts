import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TransactionService } from "../services/transaction.service";
import type { TransactionFilters, TransactionSort } from "@/types";
import { useState } from "react";
import { PAGINATION } from "@/constants";

export const useTransactions = (initialFilters?: TransactionFilters) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE);
    const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {});
    const [sort, setSort] = useState<TransactionSort>({ field: 'date', direction: 'desc' });

    const query = useQuery({
        queryKey: ['transactions', page, pageSize, filters, sort],
        queryFn: () => TransactionService.getTransactions(page, pageSize, filters, sort),
        placeholderData: keepPreviousData,
    });

    return {
        ...query,
        page,
        setPage,
        pageSize,
        setPageSize,
        filters,
        setFilters,
        sort,
        setSort
    };
};
