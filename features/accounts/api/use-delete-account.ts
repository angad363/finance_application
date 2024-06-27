import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async() => {
            const response = await client.api.accounts[":id"]["$delete"]({
                param: {id}
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account Deleted");
            queryCLient.invalidateQueries({queryKey: ["accounts", {id}]});
            queryCLient.invalidateQueries({queryKey: ["accounts"]});
            // TODO: Invalidate Summary and Transaction
        },
        onError: () => {
            toast.error("Failed to delete Account");
        }
    });
    return mutation;
}