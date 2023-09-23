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
import { Loader2, Pencil, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import ChaptersList from "./chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[]};
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title:  "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/chapters`, values);
      console.log(response.data);
      toast({
        title: "Chapter Created",
        security: "success",
        duration: 1000,
      });
      toggleCreating();
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

  const onReorder = async (updateData:{id:string, position:number}[]) => {
    try {
        setIsUpdating(true);
        await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
          list:updateData
        })

        toast({
          title: "Chapters reordered",
          security: "success",
          duration: 1000,
        })

        router.refresh()

    } catch (error) {
      toast({
        title: "An error occurred",
        variant: "destructive",
        security: "error",
        duration: 1000,
      })
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="relative p-4 mt-6 border rounded-md bg-slate-100">
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="w-6 h-6 animate-spin text-sly-700"/>
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        <h3>Course Chapters</h3>
        <Button type="button" variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            <p>Cancel</p>
          ) : (
            <>
              <PlusCircleIcon className="w-4 h-4" />
              <p>Add Chapter</p>
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, formState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      aria-disabled={isSubmitting}
                      disabled={isSubmitting}
                      placeholder="e.g. Course Introduction"
                      {...field}
                      id="title"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              aria-disabled={isSubmitting || !isValid}
              disabled={isSubmitting || !isValid}
              className="mt-3"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-xs mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length ? (
            <p>No Chapters</p>
          ) : (
            <ChaptersList
              onEdit={() => {}}
              onReorder={onReorder}
              items={initialData.chapters || []}
            />
          )}
        </div>
      )}

      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
export default ChaptersForm;
