"use client";

import { StackedBarChart } from "@/components/StackedBarChart";
import { PieChart } from "@/components/PieChart";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart } from "@/components/BarChart";
import Header from "@/components/Header";

const Result: React.FC = () => {
  let date: Date = new Date();
  const [user_id, setuser_id] = useState("user123");
  const [personalityScore, setPersonalityScores] = useState<
    Record<string, number>
  >({});
  const [personalityCategoryScore, setPersonalityCategoryScore] = useState<
    Record<string, number>
  >({});
  const [soft_SkillScores, setsoft_SkillScores] = useState<
    Record<string, number>
  >({});
  const [careerScores, setCareerScores] = useState<Record<string, number>>({});
  const [diffScores, setDiffScores] = useState<Record<string, number>>({});
  const [progressScores, setProgressScores] = useState<Record<string, number>>(
    {}
  );
  const [progressCountScores, setProgressCountScores] = useState<
    Record<string, number>
  >({});

  const skillPercent =
    (progressScores["Skills"] / progressCountScores["Skills"]) * 100;
  const knowledgePercent =
    (progressScores["Knowledge"] / progressCountScores["Knowledge"]) * 100;
  const applicationPercent =
    (progressScores["Application"] / progressCountScores["Application"]) * 100;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `/api/results/${user_id}`
        );
        setPersonalityScores(response.data.personalityScores);
        setPersonalityCategoryScore(response.data.personalityCategoryScores);
        setsoft_SkillScores(response.data.soft_SkillScores);
        setCareerScores(response.data.careerScores);
        setDiffScores(response.data.diffScores);
        setProgressScores(response.data.progressScores);
        setProgressCountScores(response.data.progressCountScores);
      } catch (error) {
        console.error("Failed to fetch results", error);
      }
    };

    fetchResults();
  }, [user_id]);

  return (
    <div className="flex flex-col text-color-1100">
      <Header progressBar={[1, 2, 3]} />
      <div className="bg-color-50 w-full rounded-2xl flex space-x-2 justify-center items-center p-12">
        <div className="flex flex-col justify-center items-center gap-4 p-8 text-xs">
          <div className="flex bg-color-150 text-color-1100 justify-between h-fit w-full p-4 px-6 rounded-2xl">
            <h1 className="text-2xl font-bold">Assessment Result</h1>
            <div>
              <h6>{user_id}</h6>
              <p>{`${date.getDate()}/${date.getMonth() + 1
                }/${date.getFullYear()}`}</p>
            </div>
          </div>
          <div className="text-sm my-5 leading-5">
            This report is generated based on the answers you provided during
            the assessment and is designed to give you insights into your skills
            and abilities across various categories. Please note that the
            results are not 100% accurate and should be interpreted as a general
            guide rather than a definitive assessment. Various factors can
            influence the outcomes, and personal reflection and professional
            advice are recommended for a comprehensive understanding of your
            capabilities.
          </div>
          <div className="flex flex-col gap-4 justify-center items-center ">
            <div className="border-[1px] border-[#000000] p-5 rounded-2xl">
              <div>
                <h1 className="text-xl font-bold mb-5">Your Personality Type.</h1>
                <p className="text-sm leading-5">
                  Your personality is shaped by how you act, the places you enjoy,
                  and how you communicate with others. It also reflects your
                  values and the choices you make in different situations.
                </p>
              </div>
              <div className="h-[300px] w-full flex justify-center items-center gap-8 pl-16 my-14">
                <PieChart scores={personalityScore} />
                <div>
                  <p className="text-sm leading-5">
                    <strong>Introvert: </strong>
                    {Math.round(personalityScore.Introvert)}%
                  </p>
                  <p className="text-sm leading-5">
                    <strong>Extrovert: </strong>
                    {Math.round(personalityScore.Extrovert)}%
                  </p>
                </div>
              </div>
              {personalityScore.Introvert >= 40 && personalityScore.Extrovert <= 60 ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">You are Ambivert Type</h3>
                  <p className="text-sm leading-5">Based on the assessment your more towards Ambivert type.</p>
                  <p className="text-sm leading-5">
                    As an ambivert, you blend introverted and extroverted traits, adapting easily to various social situations. You enjoy both social interactions and moments of solitude to recharge.
                    <ul className="list-disc ml-10 mt-2 flex flex-col gap-1">
                      <li>You thrives in group settings and engages in lively conversations</li>
                      <li>You values deep, meaningful discussions and reflective thinking</li>
                      <li>You balances spontaneity with careful planning, adapting to different contexts</li>
                      <li>You comfortable with both routine and new experiences, excelling in diverse environments</li>
                      <li>You capable of being a good listener and an engaging speaker</li>

                    </ul>
                  </p>
                </div>
              ) : personalityScore.Introvert > personalityScore.Extrovert ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">You are Introvert Type</h3>
                  <p className="text-sm leading-5">Based on the assessment your more towards Introvert type.</p>
                  <p className="text-sm leading-5">
                    As an introvert, you find energy in solitude and enjoy solitary activities over large social gatherings. You are thoughtful and reflective, favoring deep, meaningful conversations over small talk.
                    <ul className="list-disc ml-10 mt-2 flex flex-col gap-1">
                      <li>You reserved in social situations, needing time alone to recharge</li>
                      <li>You strengths include being a good listener and engaging in introspection</li>
                      <li>You prefers routine and consistency, excelling in detail-oriented tasks</li>
                      <li>You cautious decision-maker, carefully weighing options before concluding</li>

                    </ul>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">You are Extrovert Type</h3>
                  <p className="text-sm leading-5">Based on the assessment your more towards Extrovert type.</p>
                  <p className="text-sm leading-5">
                    As an extrovert, You thrive in social settings and gain energy from interactions. You enjoy lively conversations, easily connect with new people, and are adaptable to change.
                    <ul className="list-disc ml-10 mt-2 flex flex-col gap-1">
                      <li>You engaged in dynamic interactions</li>
                      <li>You comfortable with new environments</li>
                      <li>You skilled at multitasking</li>
                      <li>You prefers teamwork and varied routines</li>
                      <li>You spontaneous and enthusiastic</li>

                    </ul>
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 justify-center items-center my-10 border-[1px] border-[#000000] p-5 rounded-2xl">
              <div className="w-full">
                <h3 className="text-xl font-bold">
                  More about your personality:
                </h3>
              </div>
              <div className="h-[400px] w-[700px]">
                <BarChart scores={personalityCategoryScore} />
              </div>
              <div className="grid grid-cols-2 gap-4 h-full w-ful">
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Interpersonal Skills:</strong> Interpersonal skills
                  refer to the ability to communicate, empathize, and build relationships, enabling effective teamwork, conflict resolution, and understanding others&apos; emotions.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Stress Handling:</strong> Stress handling involves the
                  ability to manage stress effectively, maintaining composure under pressure and using stress-reduction techniques to stay productive.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Leadership:</strong> Leadership is the ability to guide and inspire others to achieve goals, fostering collaboration and creating a positive work environment.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Dominance:</strong> Dominance is the tendency to assert control and influence, confidently making decisions and assuming leadership roles.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Influence:</strong> Influence is the ability to persuade and motivate others through effective communication and relationship-building.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Agreeableness:</strong> Agreeableness is a personality
                  trait characterized by kindness, cooperation, and compassion, valuing harmony and collaboration.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Openness:</strong> Openness is a trait that reflects a
                  person&apos;s willingness to embrace new experiences and ideas, being creative, curious, and open-minded.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Conscientiousness:</strong> Conscientiousness is a trait characterized by organization, responsibility, and dependability, excelling in planning and maintaining high standards.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center border-[1px] border-[#000000] p-5 rounded-2xl">
            <div>
              <h1 className="text-xl font-bold mb-3">
                Your Soft Skills Profile.
              </h1>
              <p className="text-sm leading-5">
                Your soft skills profile reflects how you interact with others,
                handle challenges, and adapt to various situations. It
                highlights your communication style, teamwork abilities, and
                problem-solving approach, providing insight into your strengths
                and areas for growth.
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="h-[400px] w-[700px]">
                <BarChart scores={soft_SkillScores} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Communication:</strong> Communication is the ability to convey information clearly, including active listening and understanding non-verbal cues.
                  </p>
                  <strong>Your Communication Skills: </strong>
                  <span>
                    {soft_SkillScores.Communication >= 70
                      ? "Excellent"
                      : soft_SkillScores.Communication >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Teamwork and Collaboration:</strong> Teamwork and
                    collaboration refer to the ability to work effectively with others to achieve common goals, involving cooperation, respect, and support.
                  </p>
                  <strong>Your Teamwork and Collaboration Skills: </strong>
                  <span>
                    {soft_SkillScores.Teamwork_and_Collaboration >= 70
                      ? "Excellent"
                      : soft_SkillScores.Teamwork_and_Collaboration >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Problem-Solving:</strong> Problem-solving is the
                    ability to identifying and resolving issues creatively and efficiently through critical thinking and innovative strategies.
                  </p>
                  <strong>Your Problem-Solving Skills: </strong>
                  <span>
                    {soft_SkillScores.Problem_Solving >= 70
                      ? "Excellent"
                      : soft_SkillScores.Problem_Solving >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Leadership:</strong> Leadership is the ability to
                    guiding and motivating others to achieve goals through decision-making, vision-setting, and collaboration.
                  </p>
                  <strong>Your Leadership Skills: </strong>
                  <span>
                    {soft_SkillScores.Leadership >= 70
                      ? "Excellent"
                      : soft_SkillScores.Leadership >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Emotional Intelligence:</strong> Emotional
                    intelligence is the capacity to recognizing, understanding, and managing emotions in oneself and others, involving empathy and social skills.
                  </p>
                  <strong>Your Emotional Intelligence Skills: </strong>
                  <span>
                    {soft_SkillScores.Emotional_Intelligence >= 70
                      ? "Excellent"
                      : soft_SkillScores.Emotional_Intelligence >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Adaptability and Flexibility:</strong> Adaptability
                    and flexibility refer to the ability to adjusting to new conditions and changes effectively, embracing change, and remaining productive.
                  </p>
                  <strong>Your Adaptability and Flexibility Skills: </strong>
                  <span>
                    {soft_SkillScores.Adaptability_and_Flexibility >= 70
                      ? "Excellent"
                      : soft_SkillScores.Adaptability_and_Flexibility >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Time Management:</strong> Time management is the
                    ability to organizing and planning time effectively to balance activities and meet goals.
                  </p>
                  <strong>Your Time Management Skills: </strong>
                  <span>
                    {soft_SkillScores.Time_Management >= 70
                      ? "Excellent"
                      : soft_SkillScores.Time_Management >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Work Ethic:</strong> Work ethic is a set of values
                    based on the principles of demonstrating diligence, integrity, and responsibility in work, with a focus on high standards and dedication.
                  </p>
                  <strong>Your Work Ethic Skills: </strong>
                  <span>
                    {soft_SkillScores.Work_Ethic >= 70
                      ? "Excellent"
                      : soft_SkillScores.Work_Ethic >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Conflict Resolution:</strong> Conflict resolution is
                    the ability to managing and resolving disagreements constructively through active listening and negotiation.
                  </p>
                  <strong>Your Conflict Resolution Skills: </strong>
                  <span>
                    {soft_SkillScores.Conflict_Resolution >= 70
                      ? "Excellent"
                      : soft_SkillScores.Conflict_Resolution >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
                <div>
                  <p className="flex flex-col text-sm span-1 gap-2 leading-5 mb-2">
                    <strong>Interpersonal Skills:</strong> Interpersonal skills
                    are the abilities that facilitating effective interaction and communication, including empathy and rapport-building.
                  </p>
                  <strong>Your Interpersonal Skills: </strong>
                  <span>
                    {soft_SkillScores.Interpersonal_Skills >= 70
                      ? "Excellent"
                      : soft_SkillScores.Interpersonal_Skills >= 35
                        ? "Average"
                        : "Poor"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center border-[1px] border-[#000000] p-5 rounded-2xl mt-10">
            <div>
              <h1 className="text-xl font-bold mb-3">
                Your Career Assessment Result.
              </h1>
              <p className="leading-5 text-sm">
                Your abilities are reflected in how you think, organize, and
                interact with the world around you. This assessment evaluates
                your skills in creativity, logic, organization, and
                interpersonal interactions, providing insights into your
                strengths and areas for development. It highlights how you apply
                your knowledge in various contexts, helping you make informed
                choices and achieve your goals.
              </p>
            </div>
            <div className="w-full flex flex-col justify-center items-center my-8">
              <div className="w-[35rem] flex flex-col gap-3">
                <p className="flex flex-col gap-1 font-semibold text-sm">
                  Skills: {Math.round(skillPercent)}%
                  <Progress value={skillPercent} className="h-5" />

                </p>
                <p className="flex flex-col gap-1 font-semibold text-sm">
                  Knowledge: {Math.round(knowledgePercent)}%
                  <Progress value={knowledgePercent} className="h-5" />

                </p>
                <p className="flex flex-col gap-1 font-semibold text-sm">
                  Application: {Math.round(applicationPercent)}%
                  <Progress value={applicationPercent} className="h-5" />

                </p>
              </div>
              <div className="w-full flex flex-col justify-start items-start mt-14 text-sm">
                <h1 className="text-sm font-bold mb-3">
                  Brief about your career assessment
                </h1>
                <ul className="list-disc ml-4 mt-2 flex flex-col gap-1">
                  <li>
                    <p>
                      Your Skills{" "}
                      {skillPercent >= 75
                        ? "are impressive; keep working on them to continue improving."
                        : skillPercent < 35
                          ? "are strong, but there is room for improvement."
                          : "need improvement and development."}
                    </p>
                  </li>
                  <li>
                    <p>
                      Your Knowledge{" "}
                      {knowledgePercent >= 75
                        ? "is impressive; keep expanding it to continue growing."
                        : knowledgePercent < 35
                          ? "is solid, but there is room for further development."
                          : "needs enhancement and growth."}
                    </p>
                  </li>
                  <li>
                    <p>
                      {applicationPercent >= 75
                        ? "Your ability to apply your skills is impressive; keep honing it to continue advancing."
                        : applicationPercent < 35
                          ? "Your application skills are strong, but there's potential for further development."
                          : "Your application skills need refinement and growth."}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 justify-center items-center">
              <h3 className="text-xl font-bold w-full">
                Insights about your career assessment:
              </h3>
              <div className="h-[325px] w-[600px]">
                <StackedBarChart
                  scores={careerScores}
                  diffScores={diffScores}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Creating: </strong>Creating involves the ability to generate new ideas and solutions, encompassing creativity, innovation, and originality. Excels in turning abstract concepts into tangible outcomes across various mediums.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Logical Thinking: </strong>Logical Thinking refers to
                  the capacity for systematic reasoning and critical analysis. Excels in problem-solving, informed decision-making, and evaluating complex situations with clarity.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Helping: </strong>Helping is the ability to support and care for others with empathy and compassion. Excels in building relationships, providing guidance, and fostering collaboration.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Organizing: </strong>Organizing refers to the skill of arranging and structuring tasks and resources efficiently. Excels in planning, prioritizing, and managing time to achieve goals systematically.
                </p>
                <p className="flex flex-col text-sm span-1 gap-2 leading-5">
                  <strong>Persuading: </strong>Persuading is the ability to influence and convince others effectively. Excels in communication, negotiation, and inspiring change through compelling arguments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
