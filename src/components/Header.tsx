import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import test from "./pngegg.png";
import Image from "next/image";

interface HeaderProps {
  progressBar: Number[];
}

const Header: React.FC<HeaderProps> = ({ progressBar }) => {
  const progessValue = (progressBar.length / 3) * 100;
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="w-fit mb-5">
        <div className="bg-color-1100 -rotate-3 rounded-3xl">
          <div className="bg-color-50 rounded-3xl py-2 px-20 rotate-3 border border-color-1100">
            <h1 className="text-3xl rounded-3xl text-color-1100">Career360</h1>
          </div>
        </div>
      </div>
      <div className="rounded-2xl flex w-full h-full gap-4 justify-center items-center p-4">
        <div className="w-[35%] flex flex-col justify-center items-center gap-4">
          <div className="bg-color-150 flex justify-between items-center rounded-3xl w-full h-[175px] p-8">
            <div className="pl-4">
              <Link
                className={buttonVariants({ variant: "default" })}
                href={"/"}
              >
                Home
              </Link>
            </div>
            <Separator orientation="vertical" />

            <Image src={test} alt="test" className="h-24 w-24" />
          </div>
          <div className="flex flex-col text-color-1100 bg-color-150 rounded-3xl w-full px-6 pb-14 pt-8 h-full">
            <p className="pb-3">Test Completed: {Math.round(progessValue)}%</p>
            <div className="rounded-full relative flex items-center px-1 bg-color-50 w-full h-6">
              <div
                style={{
                  width: `${progessValue}%`,
                  transition: "width 0.3s ease-in-out",
                }}
                className="bg-purple-500 h-4 my-auto rounded-full"
              ></div>
              <div className="absolute flex flex-col left-[33%] h-full">
                <Separator orientation="vertical" />
              </div>
              <div className="absolute flex flex-col left-[66%] h-full">
                <Separator orientation="vertical" />
              </div>
              <div className="absolute flex gap-6 left-[20px] mt-14">
                <p>Round 1&#129303;</p>
                <p>Round 2&#128079;</p>
                <p>Round 3&#127881;</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[65%] h-full text-color-1100 bg-color-150 rounded-3xl px-4 py-6 flex flex-col items-center justify-center">
          <p className="w-fit">
            <strong>Disclaimer</strong>
          </p>
          <div className="flex flex-col justify-start items-start text-sm py-3 gap-2">
            <p>
              This assessment includes a Soft Skills Test, Personality Test, and General Career Aptitude Test. These tests offer insights into your skills, personality traits, and potential career paths.
            </p>
            <p>Please note the following:</p>
            <ol className="gap-1">
              <li>
                <strong>Purpose:</strong> These tests are for informational self-assessment only and are not a substitute for professional advice.
              </li>
              <li>
                <strong>Confidentiality:</strong> Your responses are confidential and used solely for this assessment.
              </li>
              <li>
                <strong>Accuracy:</strong> Results are based on self-reported responses and may not be entirely accurate.
              </li>
              <li>
                <strong>Limitations:</strong> Use these tests as a guide rather than a definitive evaluation. They should not solely determine decisions about your abilities or career path.
              </li>
              <li>
                <strong>Feedback:</strong> Suggestions for improvement are provided based on your commitment and effort.
              </li>
            </ol>
            <p>
              By taking these tests, you acknowledge and agree to these terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
