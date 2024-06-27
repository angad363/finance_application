import { toast } from "sonner";

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {client} from "@/lib/hono"

type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id?: string) => {
    const queryCLient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async(json) => {
            const response = await client.api.categories[":id"]["$patch"]({
                json,
                param: {id}
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Category Updated");
            queryCLient.invalidateQueries({queryKey: ["category", {id}]});
            queryCLient.invalidateQueries({queryKey: ["categories"]});
            // TODO: Invalidate Summary and Transaction
        },
        onError: () => {
            toast.error("Failed to edit Category");
        }
    });
    return mutation;
}