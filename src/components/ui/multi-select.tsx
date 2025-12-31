"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  className,
  disabled = false,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
    } else {
      if (maxSelected && selected.length >= maxSelected) {
        return;
      }
      onChange([...selected, value]);
    }
  };

  const handleRemove = (
    value: string,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-[40px] h-auto",
            !selected.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className='flex flex-wrap gap-1 flex-1'>
            {selected.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              selected.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return (
                  <Badge key={value} variant='secondary' className='mr-1'>
                    {option?.label}
                    <button
                      className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(value, e);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => handleRemove(value, e)}
                    >
                      <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                    </button>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className='max-h-64 overflow-auto'>
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
