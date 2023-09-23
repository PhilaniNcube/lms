import { IconBadge } from "@/components/icon-badge";
import {db} from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSignIcon, File, Layout, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";

const CoursePage = async ({
  params
}: {
  params: { courseId: string}
}) => {

  const {userId} = auth()

  if(!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {id: params.courseId},
    include: {
      attachments: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  const categories = await db.category.findMany({
   orderBy: {
      name: 'asc'
   }
  })



  if(!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields} of ${totalFields} fields completed`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span className="text-sm text-slate-700">{completionText}</span>
        </div>
      </div>
      <article className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
        <section>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Layout} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
          />
        </section>
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course Chapters</h2>
            </div>
            <div>
              <p className="text-sm text-slate-700">
                {/* TODO: Add the component to add chapters to a course */}
                Add chapters to your course to organize your content.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSignIcon} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources and Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </section>
      </article>
    </div>
  );
};
export default CoursePage;
