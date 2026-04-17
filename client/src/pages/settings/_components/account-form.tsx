import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { Loader } from "lucide-react";
import { useUpdateUserMutation } from "@/features/user/userAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { useTheme } from "@/context/theme-provider";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .optional(),
  profilePicture: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const dispatch = useAppDispatch();
  const { user } = useTypedSelector((state) => state.auth);
  const { theme } = useTheme();
  
  const isHarryPotter = theme === "harry-potter";

  const [file, setFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [updateUserMutation, { isLoading }] = useUpdateUserMutation();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const onSubmit = (values: AccountFormValues) => {
    console.log(values);
    if (isLoading) return;

    const formData = new FormData();
    formData.append("name", values.name || "");
    if (file) formData.append("profilePicture", file);

    updateUserMutation(formData)
      .unwrap()
      .then((response) => {
        dispatch(
          updateCredentials({
            user: {
              profilePicture: response.data.profilePicture,
              name: response.data.name,
            },
          })
        );
        toast.success("Account updated successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to update account");
      });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-start space-y-4">
          <FormLabel className={isHarryPotter ? "text-amber-300" : "text-gray-700"}>
            Profile Picture
          </FormLabel>
          <div className="flex items-center gap-4">
            <Avatar className={`h-20 w-20 ${isHarryPotter ? "ring-2 ring-amber-500/30" : "ring-2 ring-blue-500/20"}`}>
              <AvatarImage
                src={avatarUrl || user?.profilePicture || ""}
                className="!object-cover !object-center"
              />
              <AvatarFallback className={`text-2xl ${isHarryPotter ? "bg-gradient-to-br from-amber-500/20 to-purple-500/10 text-amber-400" : "bg-gradient-to-br from-blue-500/10 to-blue-600/10 text-blue-600"}`}>
                {form.watch("name")?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={`max-w-[250px] ${
                  isHarryPotter 
                    ? "bg-gradient-to-r from-[#1a0a2e]/50 to-[#2d1b4e]/50 border-amber-500/30 text-amber-200 placeholder-amber-400/50" 
                    : "border-gray-300"
                }`}
              />
              <p className={`text-xs ${isHarryPotter ? "text-amber-300/70" : "text-gray-500"}`}>
                Recommended: Square JPG, PNG, at least 300x300px.
              </p>
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHarryPotter ? "text-amber-300" : "text-gray-700"}>
                Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your name" 
                  {...field} 
                  className={isHarryPotter 
                    ? "bg-gradient-to-r from-[#1a0a2e]/50 to-[#2d1b4e]/50 border-amber-500/30 text-amber-200 placeholder-amber-400/50" 
                    : "border-gray-300"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          disabled={isLoading} 
          type="submit"
          className={
            isHarryPotter
              ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white border border-amber-500/20 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border border-blue-500/20 shadow-sm hover:shadow-md"
          }
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin mr-2" />}
          Update account
        </Button>
      </form>
    </Form>
  );
}