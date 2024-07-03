import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id?: string) => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.transactions[":id"]["$patch"]({
                json,
                param: {id}
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction Updated");
            queryCLient.invalidateQueries({queryKey: ["transaction", {id}]});
            queryCLient.invalidateQueries({queryKey: ["transactions"]});
            queryCLient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to edit Transaction");
        }
    });
    return mutation;
}