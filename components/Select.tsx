"use client";

import * as React from "react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------
   TYPES
------------------------------------------------------------- */

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];

  /** For single select: string | null  
   *  For multi select: string[]  
   */
  selected: string | string[] | null;

  /** onChange handler */
  setSelected: (value: string | string[] | null) => void;

  /** Placeholder text */
  placeholder?: string;

  /** Enable multiselect */
  isMulti?: boolean;
}

/* -------------------------------------------------------------
   COMPONENT
------------------------------------------------------------- */

const Select: React.FC<SelectProps> = ({
  options,
  selected,
  setSelected,
  placeholder = "Select options",
  isMulti = false,
}) => {
  const [open, setOpen] = useState(false);

  /* -------------------------------------------------------------
     SELECTION HANDLERS
  ------------------------------------------------------------- */

  const handleSelect = (option: SelectOption) => {
    if (isMulti) {
      const selectedArray = Array.isArray(selected) ? selected : [];

      if (selectedArray.includes(option.value)) {
        setSelected(selectedArray.filter((s) => s !== option.value));
      } else {
        setSelected([...selectedArray, option.value]);
      }
    } else {
      setSelected(option.value);
      setOpen(false);
    }
  };

  const handleRemove = (
    value: string,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (Array.isArray(selected)) {
      setSelected(selected.filter((s) => s !== value));
    }
  };

  const handleClearAll = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setSelected(isMulti ? [] : null);
  };

  /* -------------------------------------------------------------
     RENDER SELECTED LABEL(S)
  ------------------------------------------------------------- */

  const renderSelected = () => {
    if (isMulti && Array.isArray(selected)) {
      if (selected.length === 0) return placeholder;

      return (
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value);
            if (!option) return null;

            return (
              <Badge key={value} className="me-2 flex items-center gap-1">
                {option.label}
                <XIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => handleRemove(value, e)}
                />
              </Badge>
            );
          })}
        </div>
      );
    }

    const option = options.find((o) => o.value === selected);
    return option?.label ?? placeholder;
  };

  /* -------------------------------------------------------------
     JSX
  ------------------------------------------------------------- */

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between dark:bg-card w-full"
        >
          {renderSelected()}

          <div className="flex items-center gap-2">
            {selected &&
              (Array.isArray(selected) ? selected.length > 0 : true) && (
                <XIcon
                  className="h-4 w-4 opacity-50 cursor-pointer"
                  onClick={handleClearAll}
                />
              )}

            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 w-[250px]">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option)}
                >
                  {option.label}

                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      isMulti
                        ? Array.isArray(selected) &&
                            selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                        : selected === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Select;
