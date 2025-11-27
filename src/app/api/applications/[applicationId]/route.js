import { NextResponse } from "next/server";
import dbConnect from "@/server/db/dbConnect";
import Application from "@/server/models/Application";
import { ErrorResponse } from "@/utils/ErrorResponse";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { applicationId } = await params;
    const body = await req.json();
    let update = {};

    switch (body.action) {
      case "updateStatus":
        update = { status: body.status };

        if (["hired", "rejected", "applied"].includes(body.status)) {
          update.assignedInterview = {
            isAssigned: false,
            scheduledAt: null,
          };
        }
        break;

      case "assignInterview":
        update = {
          assignedInterview: {
            isAssigned: true,
            scheduledAt: new Date(body.scheduledAt),
          },
          status: "interview_scheduled",
        };
        break;

      case "reject":
        update = {
          status: "rejected",
          assignedInterview: {
            isAssigned: false,
            scheduledAt: null,
          },
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action type" },
          { status: 400 }
        );
    }

    const updatedApp = await Application.findByIdAndUpdate(applicationId, update, {
      new: true,
    }).populate("candidate", "username email");

    if (!updatedApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(updatedApp);
  } catch (error) {
   
    return ErrorResponse(error.message || "Server Error");
  }
}
