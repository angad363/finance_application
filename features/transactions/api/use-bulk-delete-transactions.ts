import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const UseBulkDeleteTransactions = () => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.transactions["bulk-delete"].$post({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transactions Deleted");
            queryCLient.invalidateQueries({queryKey: ["transactions"]});
            // TODO: Also invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete Transactions");
        }
    });
    return mutation;
}