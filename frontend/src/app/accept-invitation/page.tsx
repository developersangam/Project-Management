"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { acceptInvitationToOrganization } from "@/store/organization/organizationThunk";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const organization = searchParams.get("organization");
  const invitedBy = searchParams.get("invitedBy");

  const { loading } = useAppSelector((state) => state.organization);
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!token || !organization || !invitedBy) {
      setStatus("error");
      setErrorMessage("Invalid or expired link.");
      return;
    }
  }, [token]);

  const handleAcceptInvitation = async () => {
    try {
      let data: any = {
        token: token,
      };
      const response = await dispatch(acceptInvitationToOrganization(data)).unwrap();
      if (response) {
        setStatus("success");
      }
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      setStatus("error");
    }
  };

  if (!token || !organization || !invitedBy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Invalid Invitation Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The invitation link is missing or invalid. Please check your email
              for the correct invitation link.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {loading && (
            <>
              <CardTitle className="flex items-center gap-2">
                <Spinner className="w-5 h-5" />
                Processing Invitation
              </CardTitle>
              <CardDescription>
                Please wait while we verify your invitation...
              </CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Invitation Accepted!
              </CardTitle>
              <CardDescription>
                You have successfully joined the organization
              </CardDescription>
            </>
          )}

          {status === "error" && (
            <>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Invitation Failed
              </CardTitle>
              <CardDescription>
                We couldn&apos;t process your invitation
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Idle State - Show Invitation Details */}
          {token && organization && invitedBy && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {invitedBy || "Someone"} has sent you an invitation
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    to join <span className="font-bold">{organization}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Organization
                  </p>
                  <p className="font-medium text-foreground">{organization}</p>
                </div>

                {/* {invitationData.projectName && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Project</p>
                    <p className="font-medium text-foreground">{invitationData.projectName}</p>
                  </div>
                )} */}

                {/* {invitationData.role && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <p className="font-medium text-foreground capitalize">{invitationData.role}</p>
                  </div>
                )} */}
              </div>

              <Button
                onClick={handleAcceptInvitation}
                className="w-full"
                size="lg"
              >
                Accept Invitation
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
              >
                Decline
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <Spinner className="w-8 h-8" />
              <p className="text-sm text-muted-foreground">
                Processing your invitation...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Organization:{" "}
                  <span className="font-bold">{organization}</span>
                </p>
                {/* {invitationData.projectName && (
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Project: <span className="font-bold">{invitationData.projectName}</span>
                  </p>
                )}
                {invitationData.role && (
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Role: <span className="font-bold">{invitationData.role}</span>
                  </p>
                )} */}
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Redirecting to dashboard or login in a few seconds...
              </p>

              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard Now
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
                <p className="text-sm text-red-900 dark:text-red-100">
                  {errorMessage}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  The invitation link may have expired or already been used.
                  Please contact the person who sent the invitation for a new
                  link.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Go Home
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Token Display (for debugging/reference) */}
          {token && (
            <div className="pt-4 border-t">
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">
                  Show Invitation Token
                </summary>
                <div className="mt-2 p-2 bg-muted rounded-md font-mono break-all text-xs max-h-20 overflow-auto">
                  {token}
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
