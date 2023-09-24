import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import VideoForm from "./_components/chapter-video-form";

const ChapterPage = async ({
  params
}: {
  params: { courseId: string, chapterId: string}
}) => {

  const {userId} = auth()
  if(!userId) {
    return redirect('/')
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true
    }
  })

    if (!chapter) {
      return redirect("/");
    }

    const requiredFields = [
      chapter.title,
      chapter.description,
      chapter.videoUrl,
    ]

    const totalFields = requiredFields.length

    const compltedFields = requiredFields.filter(Boolean).length

    const completionText = `${compltedFields}/${totalFields} fields completed`

  return (
    <section className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            className="flex items-center text-sm transition mb-6 hover:opacity-75"
            href={`/teacher/courses/${params.courseId}`}
          >
            <Button
              type="button"
              aria-label="Back to course set up"
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-3" />
              Back to course set up
            </Button>
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">{completionText}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customise your chapter</h2>
            </div>
            {/* TODO: Chapter Titlte Form */}
            <ChapterTitleForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>{" "}
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">Add a video</h2>
          </div>
          <VideoForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
        </div>
      </div>
    </section>
  );
};
export default ChapterPage;