import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { useNewTransaction } from "../hooks/use-new-transaction";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { UseCreateTransaction } from "../api/use-create-transaction";
import { UseCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { UseCreateAccount } from "@/features/accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

export const NewTransactionSheet = () => {

    const {isOpen, onClose} = useNewTransaction();

    const createMutation = UseCreateTransaction();

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

    const formSchema = insertTransactionSchema.omit({
        id: true
     })
    
    type FormValues = z.input<typeof formSchema>;

    

    const isPending = 
        createMutation.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending;
    
    const isLoading = 
    categoryQuery.isLoading ||
    accountQuery.isLoading;


    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    }
    return(
        <Sheet open = {isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Create a new transaction.
                    </SheetDescription>
                </SheetHeader>
                {isLoading
                ? (
                    <div className="absolute inset-0 flex items-center">
                        <Loader2 className="size-4 text-mutated-foreground animate-spin" />
                    </div>
                )
                : (
                    <TransactionForm
                        onSubmit={onSubmit}
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
    )
}