"use client";

import { useState } from "react";

import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useSearchProspects } from "@/core/hooks/prospects/useProspect";
import { Check, ChevronsUpDown, Loader2, Phone } from "lucide-react";
import { cn } from "@/core/lib/utils";


interface Props {
    value?: string;
    onChange: (value: string) => void;
}
export default function ProspectPhoneSearch({
    value,
    onChange,
}: Props) {

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data = [], isLoading } = useSearchProspects(search);

    const selected = data.find((p) => p.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen} >

            <PopoverTrigger >

                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >

                    {selected
                        ? `${selected.full_name} • ${selected.phone}`
                        : "Rechercher un prospect..."}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />

                </Button>

            </PopoverTrigger>

            <PopoverContent className="w-full p-0">

                <Command shouldFilter={false}>

                    <CommandInput
                        placeholder="Tapez le numéro..."
                        value={search}
                        onValueChange={setSearch}
                    />

                    <CommandList>

                        {search.length < 5 && (
                            <CommandEmpty>
                                Saisissez au moins 5 chiffres.
                            </CommandEmpty>
                        )}

                        {isLoading && (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        )}

                        {!isLoading && search.length >= 5 && data.length === 0 && (
                            <CommandEmpty>
                                Aucun prospect trouvé.
                            </CommandEmpty>
                        )}

                        <CommandGroup>

                            {data.map((prospect) => (

                                <CommandItem
                                    key={prospect.id}
                                    value={prospect.id}
                                    onSelect={() => {

                                        onChange(prospect.id);

                                        setOpen(false);

                                    }}
                                >

                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === prospect.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />

                                    <div className="flex flex-col">

                                        <span className="font-medium">
                                            {prospect.full_name}
                                        </span>

                                        <span className="flex items-center gap-2 text-xs text-muted-foreground">

                                            <Phone className="h-3 w-3" />

                                            {prospect.phone}

                                            {/* {prospect.quartier &&
                                                ` • ${prospect.quartier}`} */}

                                        </span>

                                    </div>

                                </CommandItem>

                            ))}

                        </CommandGroup>

                    </CommandList>

                </Command>

            </PopoverContent>

        </Popover>
    );
}