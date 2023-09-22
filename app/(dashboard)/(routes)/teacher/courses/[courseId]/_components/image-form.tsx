"use client";
import * as z from "zod";
import axios from "axios";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(3, {
    message: "Image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();




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
        <h3>Course Image</h3>
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing && <p>Cancel</p>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              <p>Add Image</p>
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              <p>Edit Image</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.imageUrl && "text-slate-500 italic"
          )}
        >
          {initialData.imageUrl || "No Image"}
        </p>
      )}

      {!isEditing && (
        !initialData.imageUrl ? (<div className="flex py-3 items-center justify-center h-60 aspect-video bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>) : (<div className="relative aspect-video mt-2">
         <Image alt="Upload" fill className="object-cover rounded-md" src={initialData.imageUrl} />
        </div>)
      )}

      {isEditing && (
      <div>
        <FileUpload endpoint="courseImage" onChange={(url) => {
          if(url) {
            onSubmit({imageUrl: url})
          }
        }} />
        <p className="text-xs text-muted-foreground mt-4">Aspect ration 16:9 recommended</p>
      </div>
      )}
    </div>
  );
};
export default ImageForm;
