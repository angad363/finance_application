"use client";

import { useState } from "react";
import { useMount } from "react-use";
import {usePlaidLink } from "react-plaid-link";

import { Button } from "@/components/ui/button";

import { useDeleteConnectedBank } from "../api/use-delete-connected-bank";
import { useConfirm } from "@/hooks/use-confirm";

export const PlaidDisConnect = () => {

    const [Dialog, confirm] = useConfirm(
        "Are you sure?",
        "This will disconnect your bank acocunt and remove associated data."
    )
    const deleteConnectedBank = useDeleteConnectedBank();

    const onClick = async () => {
        const ok = await confirm();

        if(ok){      
        deleteConnectedBank.mutate();
        }

    }
    
    return(
        <>
            <Dialog />
            <Button
            onClick={onClick}
            disabled={deleteConnectedBank.isPending}
            size="sm"
            variant="ghost"
            >
                Disconnect
            </Button>
        </>
        
    )
}