import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";

import { useConfirm } from "@/hooks/use-confirm";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { UseCreateCategory } from "@/features/categories/api/use-create-category";
import { UseCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";

export const EditTransactiontSheet = () => {

    const {isOpen, onClose, id} = useOpenTransaction();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this transaction."
    )

    const transactionQuery = useGetTransaction(id);

    const editMutation = useEditTransaction(id);

    const deleteMutation = useDeleteTransaction(id);

    const categoryMutation = UseCreateCategory();

    const categoryQuery = useGetCategories();

    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    });

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const accountMutation = UseCreateAccount();

    const accountQuery = useGetAccounts();

    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));


    const isPending = 
        editMutation.isPending ||
        deleteMutation.isPending ||
        transactionQuery.isLoading ||
        categoryMutation.isPending ||
        accountMutation.isPending;

    const isLoading = 
        transactionQuery.isLoading ||
        categoryQuery.isLoading ||
        accountQuery.isLoading;

    const formSchema = insertTransactionSchema.omit({
        id: true
     })
    
     type FormValues = z.input<typeof formSchema>;

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",


    };

    const onDelete = async () =>{
        const ok = await confirm();

        if(ok){
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }
    };
        


    return(
        <>
            <ConfirmDialog />
            <Sheet open = {isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading
                    ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) :
                    (
                        <TransactionForm
                            id={id} 
                            defaultValues={defaultValues}
                            onSubmit={onSubmit}
                            onDelete={onDelete}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )
                }
                </SheetContent>
            </Sheet>
        </>
    )
}