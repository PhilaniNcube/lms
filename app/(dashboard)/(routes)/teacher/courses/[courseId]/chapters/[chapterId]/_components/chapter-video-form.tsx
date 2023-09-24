"use client";
import * as z from "zod";
import axios from "axios";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/use-toast";
import {  Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Chapter, MuxData } from "@prisma/client";
import Image from "next/image";
import FileUpload from "@/components/file-upload";

interface VideoFormProps {
  initialData: Chapter & {muxData?: MuxData | null};
  courseId: string;
  chapterId:string
}

const formSchema = z.object({
  videoUrl: z.string()
});

const VideoForm = ({ initialData, courseId, chapterId }: VideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      console.log(response.data);
      toast({
        title: "Chapter updated successfully",
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
        <h3>Course Video</h3>
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing && <p>Cancel</p>}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              <p>Add Video</p>
            </>
          )}

          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              <p>Edit Video</p>
            </>
          )}
        </Button>
      </div>



      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex py-3 items-center justify-center h-60 aspect-video bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
        Video Uploaded
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <p className="text-xs text-muted-foreground mt-4">
          Upload this chapter&apos;s video
          </p>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <p className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if your video doeas not appear.
        </p>
      )}
    </div>
  );
};
export default VideoForm;
