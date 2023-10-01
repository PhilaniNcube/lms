import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req:Request, {
  params
}: {
  params: {
  courseId: string
}}){

  try {

    const {userId} = auth()
    const {courseId} = params

    if(!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    console.log("COURSE ID: ", courseId)

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      },

    })

    if(!course) {
      return new NextResponse("Not Found", {status: 404})
    }

    //check if we have a published chapter in the course
    // const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished)

    // // if there is no published chapter or course title or course description or course image or course category then return a next resopnse with a 400 status
    // if(!hasPublishedChapter || !course.title || !course.description || !course.imageUrl || !course.categoryId) {
    //   return new NextResponse("Bad Request, Missing required fields", {status: 401})
    // }

    const unpublishCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data: {
        isPublished: false
      }
    })

    return NextResponse.json(unpublishCourse)


  } catch (error) {
    console.log("[COURSE ID UNPUBLISH] PATCH ERROR: ", error)
    return new NextResponse("Internal Error", {status: 500})
  }
}
