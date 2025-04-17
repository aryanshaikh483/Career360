"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchAndProcessQuestions, SoftSkillsStructure } from "@/app/data/softskills";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import _ from "lodash";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

const QUESTIONS_PER_PAGE = 25;

const SoftSkills: React.FC = () => {
  const router = useRouter();
  let excellent: String[] = [];
  let average: String[] = [];
  let poor: String[] = [];
  const [excellentString, setExcellentString] = useState(" ");
  const [averageString, setAverageString] = useState(" ");
  const [poorString, setPoorString] = useState(" ");
  let category: Record<string, string> = {
    Communication: "Communication",
    Teamwork_and_Collaboration: "Teamwork and Collaboration",
    Problem_Solving: "Problem Solving",
    Leadership: "Leadership",
    Emotional_Intelligence: "Emotional Intelligence",
    Adaptability_and_Flexibility: "Adaptability and Flexibility",
    Time_Management: "Time Management",
    Work_Ethic: "Work Ethic",
    Conflict_Resolution: "Conflict Resolution",
    Interpersonal_Skills: "Interpersonal Skills",
  };
  const [soft_SkillsAnswers, setsoft_SkillsAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [softSkillsScores, setSoftSkillsScores] = useState<
    Record<string, number>
  >({
    Communication: 0,
    Teamwork_and_Collaboration: 0,
    Problem_Solving: 0,
    Leadership: 0,
    Emotional_Intelligence: 0,
    Adaptability_and_Flexibility: 0,
    Time_Management: 0,
    Work_Ethic: 0,
    Conflict_Resolution: 0,
    Interpersonal_Skills: 0,
  });
  const [softSkillsScoresPercent, setSoftSkillsScoresPercent] = useState<
    Record<string, number>
  >({
    Communication: 0,
    Teamwork_and_Collaboration: 0,
    Problem_Solving: 0,
    Leadership: 0,
    Emotional_Intelligence: 0,
    Adaptability_and_Flexibility: 0,
    Time_Management: 0,
    Work_Ethic: 0,
    Conflict_Resolution: 0,
    Interpersonal_Skills: 0,
  });
  const [showChart, setShowChart] = useState(false);
  const [questionArray, setQuestionArray] = useState<
  Record<string, SoftSkillsStructure[]>
>({});
  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchAndProcessQuestions();
      setQuestionArray(questions);
    };
    getQuestions();
  }, []);  
  const [currentPage, setCurrentPage] = useState(1);
  // const [count, setCount] = useState(0);
  const [user_id, setUserId] = useState("user123");
  const [isReadyToSave, setIsReadyToSave] = useState(false);

  
  // Function to load answers from sessionStorage when the page loads or changes
  const loadAnswersFromStorage = useCallback(() => {
    const storedAnswers: { [key: string]: string } = {};
    let index = 0;
    Object.entries(questionArray).forEach(([category, questions]) => {
      questions.forEach((question) => {
        const key = `${category}-${index}`;
        const storedAnswer = sessionStorage.getItem(key);
        if (storedAnswer) {
          storedAnswers[key] = storedAnswer;
        }
        index++;
      });
    });
    setsoft_SkillsAnswers(storedAnswers);
  }, [questionArray]);
  
  // Load answers from storage when the component mounts
  useEffect(() => {
    if (Object.keys(questionArray).length > 0) {
      loadAnswersFromStorage();
    }
  }, [loadAnswersFromStorage, currentPage, questionArray]);

  useEffect(() => {
    if (isReadyToSave) {
      const handleSave = async () => {
        try {
          await axios.put(`/api/results/${user_id}`, {
            soft_SkillsAnswers: soft_SkillsAnswers,
            soft_SkillScores: softSkillsScoresPercent,
          });

          console.log("Data saved successfully!");
        } catch (err) {
          console.error("Error saving data:", err);
        }
      };

      handleSave();
      setIsReadyToSave(false);
    }
  }, [isReadyToSave, soft_SkillsAnswers, softSkillsScoresPercent, user_id]);


  if (!questionArray) {
    return <div className="text-center py-10">Loading questions...</div>;
  }  

  const totalQuestions = Object.values(questionArray).flat().length;

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const handleChange = (category: string, index: number, value: string) => {
    if (!showChart) {
      // Check if submission is in progress
      setsoft_SkillsAnswers((prev) => ({
        ...prev,
        [`${category}-${index}`]: value,
      }));
    }
    sessionStorage.setItem(`${category}-${index}`, value);
  };

  

  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let soft_SkillsNewScores: Record<string, number> = {
      Communication: 0,
      Teamwork_and_Collaboration: 0,
      Problem_Solving: 0,
      Leadership: 0,
      Emotional_Intelligence: 0,
      Adaptability_and_Flexibility: 0,
      Time_Management: 0,
      Work_Ethic: 0,
      Conflict_Resolution: 0,
      Interpersonal_Skills: 0,
    };

    let soft_SkillsNewScoresPercent: Record<string, number> = {
      Communication: 0,
      Teamwork_and_Collaboration: 0,
      Problem_Solving: 0,
      Leadership: 0,
      Emotional_Intelligence: 0,
      Adaptability_and_Flexibility: 0,
      Time_Management: 0,
      Work_Ethic: 0,
      Conflict_Resolution: 0,
      Interpersonal_Skills: 0,
    };

    let totalQuestions = 0;
    let index = 0;

    Object.entries(questionArray).forEach(([category, questions]) => {
      questions.forEach((question) => {
        const answer = soft_SkillsAnswers[`${category}-${index}`];
        if (answer) {
          if (answer === "accurate") {
            soft_SkillsNewScores[category]++;
          } else if (answer === "neutral") {
            soft_SkillsNewScores[category] += 0.5;
          } else if (answer === "inaccurate") {
            soft_SkillsNewScores[category] += 0;
          }
          totalQuestions++;
        }
        index++;
      });
    });

    Object.entries(questionArray).forEach(([category, questions]) => {
      soft_SkillsNewScoresPercent[category] =
        (soft_SkillsNewScores[category] / 5) * 100;
    });

    setSoftSkillsScores(soft_SkillsNewScores);
    setSoftSkillsScoresPercent(soft_SkillsNewScoresPercent);
    // setCount(totalQuestions);

    //Consolidated info
    Object.entries(category).forEach(([key, value]) => {
      if (soft_SkillsNewScores[key] >= 4) {
        excellent.push(value);
      } else if (soft_SkillsNewScores[key] >= 2) {
        average.push(value);
      } else {
        poor.push(value);
      }
    });

    setExcellentString(
      excellent.join(", ").replace(/,([^,]*)$/, " and" + "$1")
    );
    setAverageString(average.join(", ").replace(/,([^,]*)$/, " and" + "$1"));
    setPoorString(poor.join(", ").replace(/,([^,]*)$/, " and" + "$1"));

    setIsReadyToSave(true);
    //show chart
    setShowChart(true);
  };

  
  const handleNext = () => {
    router.push("/general");
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    });
  };

  const getPaginatedQuestions = () => {
    const questionsList = Object.values(questionArray).flat();
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questionsList.slice(start, end);
  };

  const paginatedQuestions = getPaginatedQuestions();

  return (
    <div className="flex flex-col text-color-1100">
      <Header progressBar={[1]} />
      <div className="bg-color-50 w-full rounded-2xl flex flex-col space-x-2 justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-6"
        >
          <h1 className="text-3xl font-bold">Round 2: Test Your Soft Skills</h1>
          <div className="bg-color-150 rounded-3xl p-2 w-full flex gap-2 justify-center border border-color-1100">
            <span>Accurate</span>
            <span>&#x2022;</span>
            <span>Neutral</span>
            <span>&#x2022;</span>
            <span>Inaccurate</span>
          </div>
          {paginatedQuestions.map((question, index) => {
            const questionIndex =
              (currentPage - 1) * QUESTIONS_PER_PAGE + index;
            const key = `${question.category}-${questionIndex}`;
            return (
              <div
                key={key}
                className={`w-full bg-gray-500 hover:bg-color-50 has-[input:checked]:bg-purple-500 rounded-3xl flex flex-col items-center justify-center py-4 border border-color-1100 space-y-3`}
              >
                <p className="text-lg font-semibold">{question.question}</p>
                <div className="flex space-x-4">
                  Accurate
                  <label className="ml-4 flex flex-col gap-2">
                    <input
                      type="radio"
                      name={key}
                      value="accurate"
                      checked={soft_SkillsAnswers[key] === "accurate"}
                      onChange={() =>
                        handleChange(question.category, questionIndex, "accurate")
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-green-300 peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-green-300" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="neutral"
                      checked={soft_SkillsAnswers[key] === "neutral"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "neutral"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-orange-300 peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-orange-300" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="inaccurate"
                      checked={soft_SkillsAnswers[key] === "inaccurate"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "inaccurate"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="mr-4 p-3 bg-color-800 rounded-full peer-checked:bg-red-300 peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-red-300" />
                  </label>
                  Inaccurate
                </div>
              </div>
            );
          })}
        </form>
        <div className="w-[500px] flex justify-between my-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage === totalPages ? (
            <AlertDialog>
              <Button type="submit" onClick={handleSubmit}>
                <AlertDialogTrigger>Submit</AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <div className="bg-color-100 text-color-1100 w-full h-full flex flex-col gap-4 items-center justify-center border border-color-1100 rotate-3 rounded-3xl p-6">
                  <AlertDialogHeader className="flex flex-col items-center gap-2 w-fit">
                    <AlertDialogTitle className="flex flex-col justify-center items-center w-full">
                      <p>Amazing!&#129395;</p> <p>Round 2 Completed </p>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col justify-center items-center w-full">
                      {showChart && (
                        <div className="flex flex-wrap max-w-[800px]">
                          <p className="text-center">
                            &#127881;
                            {excellentString
                              ? `You excel in ${excellentString}. `
                              : ` `}
                            {averageString
                              ? `Showcasing strong ${averageString} abilities. `
                              : ` `}
                            {poorString
                              ? `Focus on enhancing ${poorString} to improve overall effectiveness.`
                              : ``}
                            &#128522;
                          </p>
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <X />
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleNext}>
                      Round 3
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button disabled={currentPage === totalPages} onClick={nextPage}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftSkills;
