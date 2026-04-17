import * as z from "zod";
import { useEffect, useState } from "react";
import { Calendar, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import RecieptScanner from "./reciept-scanner";
import {
  _TRANSACTION_FREQUENCY,
  _TRANSACTION_TYPE,
  CATEGORIES,
  PAYMENT_METHODS,
} from "@/constant";
import { Switch } from "../ui/switch";
import CurrencyInputField from "../ui/currency-input";
import { SingleSelector } from "../ui/single-select";
import { AIScanReceiptData } from "@/features/transaction/transationType";
import {
  useCreateTransactionMutation,
  useGetSingleTransactionQuery,
  useUpdateTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { toast } from "sonner";
import { useTheme } from "@/context/theme-provider";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE]),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  paymentMethod: z
    .string()
    .min(1, { message: "Please select a payment method." }),
  isRecurring: z.boolean(),
  frequency: z
    .enum([
      _TRANSACTION_FREQUENCY.DAILY,
      _TRANSACTION_FREQUENCY.WEEKLY,
      _TRANSACTION_FREQUENCY.MONTHLY,
      _TRANSACTION_FREQUENCY.YEARLY,
    ])
    .nullable()
    .optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TransactionForm = (props: {
  isEdit?: boolean;
  transactionId?: string;
  onCloseDrawer?: () => void;
}) => {
  const { onCloseDrawer, isEdit = false, transactionId } = props;
  const { theme } = useTheme();
  const isHarryPotter = theme === "harry-potter";

  const [isScanning, setIsScanning] = useState(false);

  const { data, isLoading } = useGetSingleTransactionQuery(
    transactionId || "",
    { skip: !transactionId }
  );
  const editData = data?.transaction;

  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      type: _TRANSACTION_TYPE.INCOME,
      category: "",
      date: new Date(),
      paymentMethod: "",
      isRecurring: false,
      frequency: null,
      description: "",
      receiptUrl: "",
    },
  });

  useEffect(() => {
    if (isEdit && transactionId && editData) {
      form.reset({
        title: editData?.title,
        amount: editData.amount.toString(),
        type: editData.type,
        category: editData.category?.toLowerCase(),
        date: new Date(editData.date),
        paymentMethod: editData.paymentMethod,
        isRecurring: editData.isRecurring,
        frequency: editData.recurringInterval,
        description: editData.description,
      });
    }
  }, [editData, form, isEdit, transactionId]);

  const frequencyOptions = Object.entries(_TRANSACTION_FREQUENCY).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, value]) => ({
      value: value,
      label: value.replace("_", " ").toLowerCase(),
    })
  );

  const handleScanComplete = (data: AIScanReceiptData) => {
    form.reset({
      ...form.getValues(),
      title: data.title || "",
      amount: data.amount.toString(),
      type: data.type || _TRANSACTION_TYPE.EXPENSE,
      category: data.category?.toLowerCase() || "",
      date: new Date(data.date),
      paymentMethod: data.paymentMethod || "",
      isRecurring: false,
      frequency: null,
      description: data.description || "",
      receiptUrl: data.receiptUrl || "",
    });
  };

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // if (isCreating || isUpdating) return;
    console.log("Form submitted:", values);
    const payload = {
      title: values.title,
      type: values.type,
      category: values.category,
      paymentMethod: values.paymentMethod,
      description: values.description || "",
      amount: Number(values.amount),
      date: values.date.toISOString(),
      isRecurring: values.isRecurring || false,
      recurringInterval: values.frequency || null,
    };
    if (isEdit && transactionId) {
      updateTransaction({ id: transactionId, transaction: payload })
        .unwrap()
        .then(() => {
          onCloseDrawer?.();
          toast.success("Transaction updated successfully");
        })
        .catch((error) => {
          toast.error(error.data.message || "Failed to update transaction");
        });
      return;
    }
    createTransaction(payload)
      .unwrap()
      .then(() => {
        form.reset();
        onCloseDrawer?.();
        toast.success("Transaction created successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to create transaction");
      });
  };

  const labelColor = isHarryPotter ? "text-amber-200/90" : "text-gray-700";
  const inputBorder = isHarryPotter ? "border-amber-500/30" : "border-gray-300";
  const inputBg = isHarryPotter ? "bg-[#1a0a2e]/50" : "bg-white";
  const inputText = isHarryPotter ? "text-amber-100" : "text-gray-900";
  const inputPlaceholder = isHarryPotter ? "text-amber-400/50" : "text-gray-500";
  const borderColor = isHarryPotter ? "border-amber-500/20" : "border-gray-200";
  const radioSelected = isHarryPotter ? "!border-amber-500" : "!border-blue-500";
  const radioBg = isHarryPotter ? "bg-[#1a0a2e]/30" : "bg-gray-50";
  const switchBg = isHarryPotter ? "data-[state=checked]:bg-amber-500" : "data-[state=checked]:bg-blue-500";

  return (
    <div className={cn(
      "relative pb-10 pt-5 px-2.5",
      isHarryPotter ? "bg-gradient-to-b from-transparent to-[#1a0a2e]/20" : ""
    )}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
          <div className="space-y-6">
            {/* Receipt Upload Section */}
            {!isEdit && (
              <RecieptScanner
                loadingChange={isScanning}
                onLoadingChange={setIsScanning}
                onScanComplete={handleScanComplete}
              />
            )}

            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={labelColor}>Transaction Type</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-2"
                    disabled={isScanning}
                  >
                    <label
                      htmlFor={_TRANSACTION_TYPE.INCOME}
                      className={cn(
                        `text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md 
                        shadow-sm border p-2 flex-1 justify-center 
                        transition-all`,
                        field.value === _TRANSACTION_TYPE.INCOME && radioSelected,
                        radioBg,
                        inputBorder,
                        inputText
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.INCOME}
                        id={_TRANSACTION_TYPE.INCOME}
                        className={isHarryPotter ? "!border-amber-500" : "!border-blue-500"}
                      />
                      Income
                    </label>

                    <label
                      htmlFor={_TRANSACTION_TYPE.EXPENSE}
                      className={cn(
                        `text-sm font-normal leading-none cursor-pointer
                        flex items-center space-x-2 rounded-md 
                        shadow-sm border p-2 flex-1 justify-center 
                        transition-all`,
                        field.value === _TRANSACTION_TYPE.EXPENSE && radioSelected,
                        radioBg,
                        inputBorder,
                        inputText
                      )}
                    >
                      <RadioGroupItem
                        value={_TRANSACTION_TYPE.EXPENSE}
                        id={_TRANSACTION_TYPE.EXPENSE}
                        className={isHarryPotter ? "!border-amber-500" : "!border-blue-500"}
                      />
                      Expense
                    </label>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("!font-normal", labelColor)}>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Transaction title"
                      {...field}
                      disabled={isScanning}
                      className={cn(inputBorder, inputBg, inputText, inputPlaceholder)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelColor}>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CurrencyInputField
                        {...field}
                        disabled={isScanning}
                        onValueChange={(value) => field.onChange(value || "")}
                        placeholder="$0.00"
                        prefix="$"
                        className={cn(
                          inputBorder,
                          inputBg,
                          inputText,
                          inputPlaceholder,
                          isHarryPotter ? "[&>input]:text-amber-100" : ""
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelColor}>Category</FormLabel>
                  <SingleSelector
                    value={
                      CATEGORIES.find((opt) => opt.value === field.value) ||
                      field.value
                        ? { value: field.value, label: field.value }
                        : undefined
                    }
                    onChange={(option) => field.onChange(option.value)}
                    options={CATEGORIES}
                    placeholder="Select or type a category"
                    creatable
                    disabled={isScanning}
                    // themeAware={isHarryPotter}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={labelColor}>Date</FormLabel>
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal transition-all",
                            inputBorder,
                            inputBg,
                            inputText,
                            isHarryPotter ? "hover:border-amber-400/50" : ""
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className={inputPlaceholder}>Pick a date</span>
                          )}
                          <Calendar className={cn(
                            "ml-auto h-4 w-4",
                            isHarryPotter ? "text-amber-400/70" : "opacity-50"
                          )} />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className={cn(
                        "w-auto p-0 !pointer-events-auto",
                        isHarryPotter 
                          ? "bg-gradient-to-br from-[#0a0a1a] to-[#1a0a2e] border-amber-500/20"
                          : "bg-white"
                      )}
                      align="start"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          console.log(date);
                          field.onChange(date); // This updates the form value
                        }}
                        disabled={(date) => date < new Date("2023-01-01")}
                        initialFocus
                        className={isHarryPotter ? "bg-transparent" : ""}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelColor}>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isScanning}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger className={cn(inputBorder, inputBg, inputText)}>
                        <SelectValue 
                          placeholder="Select payment method" 
                          className={inputPlaceholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={cn(
                      isHarryPotter 
                        ? "bg-gradient-to-br from-[#0a0a1a] to-[#1a0a2e] border-amber-500/20 text-amber-100"
                        : "bg-white"
                    )}>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem 
                          key={method.value} 
                          value={method.value}
                          className={cn(
                            "cursor-pointer transition-colors",
                            isHarryPotter 
                              ? "hover:bg-amber-500/20 focus:bg-amber-500/20" 
                              : "hover:bg-gray-100"
                          )}
                        >
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className={cn(
                  "flex flex-row items-center justify-between rounded-lg border p-4",
                  borderColor
                )}>
                  <div className="space-y-0.5">
                    <FormLabel className={cn("text-[14.5px]", labelColor)}>
                      Recurring Transaction
                    </FormLabel>
                    <p className={cn(
                      "text-xs",
                      isHarryPotter ? "text-amber-300/70" : "text-gray-500"
                    )}>
                      {field.value
                        ? "This will repeat automatically"
                        : "Set recurring to repeat this transaction"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isScanning}
                      checked={field.value}
                      className={cn("cursor-pointer", switchBg)}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          form.setValue(
                            "frequency",
                            _TRANSACTION_FREQUENCY.DAILY
                          );
                        } else {
                          form.setValue("frequency", null);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("isRecurring") && form.getValues().isRecurring && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="recurring-control">
                    <FormLabel className={labelColor}>Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={isScanning}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className={cn(inputBorder, inputBg, inputText)}>
                          <SelectValue
                            placeholder="Select frequency"
                            className="!capitalize"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className={cn(
                        isHarryPotter 
                          ? "bg-gradient-to-br from-[#0a0a1a] to-[#1a0a2e] border-amber-500/20 text-amber-100"
                          : "bg-white"
                      )}>
                        {frequencyOptions.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className={cn(
                              "!capitalize cursor-pointer transition-colors",
                              isHarryPotter 
                                ? "hover:bg-amber-500/20 focus:bg-amber-500/20" 
                                : "hover:bg-gray-100"
                            )}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelColor}>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this transaction"
                      className={cn(
                        "resize-none transition-all",
                        inputBorder,
                        inputBg,
                        inputText,
                        inputPlaceholder
                      )}
                      disabled={isScanning}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={cn(
            "sticky bottom-0 pb-2",
            isHarryPotter ? "bg-gradient-to-t from-[#0a0a1a] to-transparent" : "bg-white"
          )}>
            <Button
              type="submit"
              className={cn(
                "w-full !text-white transition-all shadow-lg hover:shadow-xl",
                isHarryPotter 
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border border-amber-500/20 shadow-amber-500/20"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/20"
              )}
              disabled={isScanning || isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>

          {isLoading && (
            <div className={cn(
              "absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center",
              isHarryPotter ? "bg-[#0a0a1a]/80" : "bg-white/70"
            )}>
              <Loader className={cn(
                "h-8 w-8 animate-spin",
                isHarryPotter ? "text-amber-400" : ""
              )} />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TransactionForm;