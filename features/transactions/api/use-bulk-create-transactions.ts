import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

export const UseBulkCreateTransactions = () => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.transactions["bulk-create"].$post({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transactions Created");
            queryCLient.invalidateQueries({queryKey: ["transactions"]});
            queryCLient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to create multiple Transactions");
        }
    });
    return mutation;
}