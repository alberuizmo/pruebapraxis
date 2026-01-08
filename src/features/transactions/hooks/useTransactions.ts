import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TransactionService, type TransactionFilters, type TransactionSort } from "../services/transaction.service";
import { useState } from "react";

export const useTransactions = (initialFilters?: TransactionFilters) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
