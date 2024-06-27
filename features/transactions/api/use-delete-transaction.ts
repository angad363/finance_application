import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

export const useDeleteTransaction = (id?: string) => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async() => {
            const response = await client.api.transactions[":id"]["$delete"]({
                param: {id}
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction Deleted");
            queryCLient.invalidateQueries({queryKey: ["transaction", {id}]});
            queryCLient.invalidateQueries({queryKey: ["transactions"]});
            // TODO: Invalidate Summary
        },
        onError: () => {
            toast.error("Failed to delete Transaction");
        }
    });
    return mutation;
}