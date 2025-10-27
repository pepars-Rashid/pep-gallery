"use client";

import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller } from "react-hook-form";

interface SearchBarProps {
  onSubmit?: (data: { search: string; select: string }) => void;
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const { handleSubmit, control } = useForm({ // you should use watch later
    defaultValues: {
      search: "",
      select: "option1"
    }
  });

  const onFormSubmit = (data: { search: string; select: string }) => {
    onSubmit?.(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
      <FieldGroup>
        <FieldLabel htmlFor="search" className="sr-only">
          Search
        </FieldLabel>
        <div className="relative flex items-center">
          <Search className="absolute left-4 size-4 text-muted-foreground pointer-events-none z-10" />
          <Field orientation="horizontal">
            <Controller
              name="search"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="search"
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-28"
                />
              )}
            />
          </Field>
          <div className="absolute right-2">
            <Field orientation="horizontal">
              <Controller
                name="select"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </div>
      </FieldGroup>
    </form>
  );
}