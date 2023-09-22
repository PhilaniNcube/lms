"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description:initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      console.log(response.data);
      toast({
        title: "Description updated successfully",
        security: "success",
        duration: 1000,
      });
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast({
        title: "An error occurred",
        variant: "destructive",
        security: "error",
        duration: 1000,
      });
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <h3>Course Description</h3>
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <p>Cancel</p>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <p>Edit Description</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {initialData.description || "No Description"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field, formState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      aria-disabled={isSubmitting}
                      disabled={isSubmitting}
                      placeholder="e.g. Advanced web development"
                      {...field}
                      id="description"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                type="submit"
                aria-disabled={isSubmitting || !isValid}
                disabled={isSubmitting || !isValid}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
export default DescriptionForm;
