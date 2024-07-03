import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const UseCreateTransaction = () => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.transactions.$post({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction Created");
            queryCLient.invalidateQueries({queryKey: ["transactions"]});
            queryCLient.invalidateQueries({queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("Failed to create Transaction");
        }
    });
    return mutation;
}