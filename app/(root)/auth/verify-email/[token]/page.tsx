"use client";

import React, { useEffect, useState, use } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

const EmailVerification = ({ params }: PageProps) => {
  const { token } = use(params); // ✅ Next.js 15 compliant

  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", {
          token,
        });

        if (data?.success) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (error) {
        console.error("Email verification failed:", error);
        setIsVerified(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-[400px]">
        <CardContent className="py-10">
          {isVerified === true && (
            <div>
              <div className="flex justify-center items-center">
                <Image
                  src={verifiedImg}
                  height={100}
                  width={100}
                  className="h-[100px] w-auto"
                  alt="Verification successful"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-green-500">
                  Email Verification Successful!
                </h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}

          {isVerified === false && (
            <div>
              <div className="flex justify-center items-center">
                <Image
                  src={verificationFailedImg}
                  height={100}
                  width={100}
                  className="h-[100px] w-auto"
                  alt="Verification failed"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-red-500">
                  Email Verification Failed!
                </h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}

          {isVerified === null && (
            <p className="text-center text-gray-500">Verifying...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
