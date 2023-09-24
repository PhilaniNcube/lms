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
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Checkbox } from "@/components/ui/checkbox";


interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({ initialData, courseId , chapterId}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
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
        <h3>Chapter access settings</h3>
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <p>Cancel</p>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              <p>Edit access</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree ? (
            <p>This is a free chapter</p>
          ) : (
            <p>Restricted access</p>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field, formState }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <div className="flex space-x-4 items-center">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isFree"
                        name="isFree"
                      />
                      <FormLabel htmlFor="isFree">
                        Check this box if you would like to make this chapter
                        free for preview
                      </FormLabel>
                    </div>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription></FormDescription>
                  </div>
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
export default ChapterAccessForm;
