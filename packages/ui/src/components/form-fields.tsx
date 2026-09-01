import { cn } from "@workspace/ui/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useController } from "react-hook-form";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Input } from "./input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "./input-otp";
import { PasswordInput } from "./password-input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { Slider } from "./slider";
import { Textarea } from "./textarea";

interface BaseFormProps<T extends FieldValues> {
	control?: Control<T>;
	name: Path<T>;
	label?: string;
	description?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  FormInput                                 */
/* -------------------------------------------------------------------------- */

interface FormInputProps<T extends FieldValues>
	extends Omit<ComponentProps<"input">, "name">,
		BaseFormProps<T> {}

export function FormInput<T extends FieldValues>({
	control,
	name,
	label,
	className,
	description,
	...props
}: FormInputProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field data-invalid={fieldState.invalid}>
			{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
			<Input
				{...field}
				{...props}
				id={field.name}
				aria-invalid={fieldState.invalid}
				className={cn("", className)}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                              FormPasswordInput                             */
/* -------------------------------------------------------------------------- */

interface FormPasswordInputProps<T extends FieldValues>
	extends Omit<ComponentProps<typeof PasswordInput>, "name">,
		BaseFormProps<T> {}

export function FormPasswordInput<T extends FieldValues>({
	control,
	name,
	label,
	className,
	...props
}: FormPasswordInputProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field data-invalid={fieldState.invalid}>
			{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
			<PasswordInput
				{...field}
				{...props}
				id={field.name}
				aria-invalid={fieldState.invalid}
				className={className}
			/>
			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                                FormTextarea                                */
/* -------------------------------------------------------------------------- */

interface FormTextareaProps<T extends FieldValues>
	extends Omit<ComponentProps<"textarea">, "name">,
		BaseFormProps<T> {}

export function FormTextarea<T extends FieldValues>({
	control,
	name,
	label,
	className,
	description,
	...props
}: FormTextareaProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field data-invalid={fieldState.invalid}>
			{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
			<Textarea
				{...field}
				{...props}
				id={field.name}
				aria-invalid={fieldState.invalid}
				className={cn("resize-none", className)}
			/>
			{description && <FieldDescription>{description}</FieldDescription>}
			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                                FormCheckbox                                */
/* -------------------------------------------------------------------------- */

interface FormCheckboxProps<T extends FieldValues>
	extends Omit<
			ComponentProps<typeof Checkbox>,
			"name" | "checked" | "onCheckedChange"
		>,
		BaseFormProps<T> {}

export function FormCheckbox<T extends FieldValues>({
	control,
	name,
	label,
	className,
	...props
}: FormCheckboxProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field
			orientation="horizontal"
			data-invalid={fieldState.invalid}
			className={cn(className)}
		>
			<Checkbox
				{...props}
				id={field.name}
				ref={field.ref}
				checked={field.value}
				onCheckedChange={field.onChange}
				onBlur={field.onBlur}
				aria-invalid={fieldState.invalid}
			/>
			<div className="space-y-1 leading-none">
				{label && (
					<FieldLabel htmlFor={field.name} className="cursor-pointer">
						{label}
					</FieldLabel>
				)}
				<FieldError>{fieldState.error?.message}</FieldError>
			</div>
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                                 FormOtpInput                                */
/* -------------------------------------------------------------------------- */

interface FormOtpInputProps<T extends FieldValues> extends BaseFormProps<T> {
	maxLength?: number;
	onComplete?: (value: string) => void;
}

export function FormOtpInput<T extends FieldValues>({
	control,
	name,
	label,
	description,
	maxLength = 6,
	onComplete,
}: FormOtpInputProps<T>) {
	return (
		<Field>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Controller
				control={control}
				name={name}
				render={({ field, fieldState }) => (
					<>
						<div className="flex w-full justify-center">
							<InputOTP
								maxLength={maxLength}
								value={field.value}
								onChange={field.onChange}
								onComplete={onComplete}
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
								</InputOTPGroup>
								<InputOTPSeparator />
								<InputOTPGroup>
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						</div>
						{fieldState.error && (
							<FieldError className="text-center">
								{fieldState.error.message}
							</FieldError>
						)}
					</>
				)}
			/>
			{description && (
				<FieldDescription className="text-center">
					{description}
				</FieldDescription>
			)}
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                                 FormSelect                                 */
/* -------------------------------------------------------------------------- */

interface FormSelectProps<T extends FieldValues> extends BaseFormProps<T> {
	placeholder?: string;
	options: { label: string; value: string }[];
	className?: string;
	disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
	className,
	description,
	disabled,
}: FormSelectProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field data-invalid={fieldState.invalid}>
			{label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
			<Select
				name={field.name}
				value={field.value ?? ""}
				onValueChange={field.onChange}
				disabled={disabled ?? field.disabled}
			>
				<SelectTrigger
					id={field.name}
					ref={field.ref}
					onBlur={field.onBlur}
					aria-invalid={fieldState.invalid}
					className={cn("", className)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError>{fieldState.error?.message}</FieldError>
			{description && (
				<FieldDescription>
					{description}
				</FieldDescription>
			)}
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                                FormCombobox                                */
/* -------------------------------------------------------------------------- */

interface FormComboboxProps<T extends FieldValues> extends BaseFormProps<T> {
	placeholder?: string;
	options: string[];
	className?: string;
}

export function FormCombobox<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
	className,
}: FormComboboxProps<T>) {
	const [open, setOpen] = useState(false);
	const { field, fieldState } = useController({ name, control });

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			field.onBlur();
		}
	};

	return (
		<Field data-invalid={fieldState.invalid} className={className}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Popover open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger
					render={
						<Button
							ref={field.ref}
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className={cn(
								"w-full justify-between font-normal hover:bg-muted/20 rounded-md shadow-xs",
								!field.value && "text-muted-foreground",
							)}
						/>
					}
				>
					{field.value
						? options.find((opt) => opt === field.value)
						: placeholder || "Select option..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</PopoverTrigger>
				<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput
							placeholder={`Search ${label?.toLowerCase() ?? "option"}...`}
						/>
						<CommandList>
							<CommandEmpty>No result found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option}
										value={option}
										onSelect={(currentValue) => {
											field.onChange(
												currentValue === field.value ? "" : currentValue,
											);
											setOpen(false);
											field.onBlur();
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												field.value === option ? "opacity-100" : "opacity-0",
											)}
										/>
										{option}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}

/* -------------------------------------------------------------------------- */
/*                              FormMultiSelect                               */
/* -------------------------------------------------------------------------- */

interface FormMultiSelectProps<T extends FieldValues> extends BaseFormProps<T> {
	placeholder?: string;
	options: string[];
}

export function FormMultiSelect<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
}: FormMultiSelectProps<T>) {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);
	const { field, fieldState } = useController({ name, control });

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	const selected = (field.value as string[]) || [];

	const handleUnselect = (item: string) => {
		field.onChange(selected.filter((i) => i !== item));
	};

	const availableOptions = options.filter(
		(option) => !selected.includes(option),
	);

	return (
		<Field data-invalid={fieldState.invalid}>
			{label && <FieldLabel>{label}</FieldLabel>}
			<Command className="overflow-visible">
				<div className="group border border-transparent bg-muted/40 rounded-md px-3 py-1 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:bg-background transition-colors">
					<div className="flex flex-wrap gap-1 items-center">
						{selected.map((item) => (
							<Badge
								key={item}
								variant="secondary"
								className="bg-white group-focus-within:bg-primary group-focus-within:text-white hover:bg-white text-foreground pl-2 pr-1 h-6"
							>
								{item}
								<button
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(item);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(item)}
									type="button"
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						))}
						<CommandInput
							placeholder={selected.length > 0 ? "" : placeholder}
							value={inputValue}
							onValueChange={setInputValue}
							onBlur={() => {
								setOpen(false);
								field.onBlur();
							}}
							onFocus={() => setOpen(true)}
							className="placeholder:text-muted-foreground flex-1 min-w-25"
						/>
					</div>
				</div>
				<div className="relative mt-2">
					{open && availableOptions.length > 0 ? (
						<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
							<CommandList>
								<CommandGroup className="h-full overflow-auto max-h-60">
									{availableOptions.map((option) => (
										<CommandItem
											key={option}
											onSelect={() => {
												field.onChange([...selected, option]);
												setInputValue("");
											}}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											className="cursor-pointer"
										>
											{option}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</div>
					) : null}
				</div>
			</Command>
			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}

interface FormSliderProps<T extends FieldValues> extends BaseFormProps<T> {
	min?: number;
	max?: number;
	step?: number;
	className?: string;
}

/* -------------------------------------------------------------------------- */
/*                              FormSlider                                    */
/* -------------------------------------------------------------------------- */

export function FormSlider<T extends FieldValues>({
	control,
	name,
	label,
	description,
	min = 0,
	max = 5,
	step = 0.01,
	className,
}: FormSliderProps<T>) {
	const { field, fieldState } = useController({ name, control });

	const value =
		typeof field.value === "string" && field.value !== ""
			? Number(field.value)
			: typeof field.value === "number"
				? field.value
				: min;

	return (
		<Field data-invalid={fieldState.invalid}>
			<div className="space-y-3">
				<div className="flex items-center justify-between gap-4">
					{label && <FieldLabel>{label}</FieldLabel>}

					<span className="text-sm font-semibold tabular-nums text-foreground">
						{value.toFixed(2)}
					</span>
				</div>

				<Slider
					value={[value]}
					min={min}
					max={max}
					step={step}
					onValueChange={(values) => {
						const nextValue = Array.isArray(values) ? values[0] : values;

						field.onChange(
							nextValue === undefined ? undefined : nextValue.toFixed(2),
						);
					}}
					onBlur={field.onBlur}
					className={className}
					aria-invalid={fieldState.invalid}
				/>

				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>{min.toFixed(1)}</span>
					<span>{max.toFixed(1)}</span>
				</div>
			</div>

			{description && <FieldDescription>{description}</FieldDescription>}

			<FieldError>{fieldState.error?.message}</FieldError>
		</Field>
	);
}
