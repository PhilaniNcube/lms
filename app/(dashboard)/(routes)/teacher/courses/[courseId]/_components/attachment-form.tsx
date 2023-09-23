"use client";
import * as z from "zod";
import axios from "axios";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, Trash2Icon, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & {attachments: Attachment[]};
  courseId: string;
}

const formSchema = z.object({
url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
      console.log(response.data);
      toast({
        title: "Attachments uploaded successfully",
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

  const onDelete = async (id:string) => {
    try {
       setDeletingId(id)
       await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
        toast({
          title: "Attachment deleted successfully",
          security: "success",
          duration: 1000,})
        router.refresh()
    } catch (error) {
      toast({
        title: "An error occurred",
        variant: "destructive",
        duration: 1000,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <h3>Attachments & Resources</h3>
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing && <p>Cancel</p>}

          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 mr-2" />
              <p>Add a file</p>
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm italic text-slate-500">No attachments yet</p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between w-full p-3 border rounded-md bg-sky-100 border-sky-200 text-sky-700"
                >
                  <span className="flex items-center gap-x-2">
                    <File className="flex-shrink-0 w-4 h-4 mr-2" />
                    <p className="text-xs line-clamp-1">{attachment.name}</p>
                  </span>

                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <Button
                      onClick={() => onDelete(attachment.id)}
                      type="button"
                      className="bg-red-500"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course
          </p>
        </div>
      )}
    </div>
  );
};
export default AttachmentForm;
