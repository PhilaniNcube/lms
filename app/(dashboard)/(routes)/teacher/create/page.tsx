"use client"
import * as z from "zod";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
})

const CreateCoursePage = () => {

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    }
  })

  const {isSubmitting, isValid} = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast({
        title: "Course created successfully",
        security: "success",
        duration: 1000,
      })
    } catch (error) {
     toast({

      title: "An error occurred",
        variant: "destructive",
        security: "error",
        duration: 1000,

     })
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm texr-slate-600">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil culpa
          voluptas odio explicabo totam sapiente quia obcaecati hic, autem
          similique temporibus repellat ullam!
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Course Title</FormLabel>
                  <FormControl>
                    <Input
                      aria-disabled={isSubmitting}
                      disabled={isSubmitting}
                      placeholder="e.g. Advanced web development"
                      {...field}
                      id="title"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                aria-disabled={isSubmitting || !isValid}
                disabled={isSubmitting || !isValid}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default CreateCoursePage;
