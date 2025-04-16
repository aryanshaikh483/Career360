"use client";

import React, { useCallback, useEffect, useState } from "react";
import { fetchAndProcessQuestions , PersonalityTrait } from "@/app/data/personality";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
import { X } from "lucide-react";

const Personality: React.FC = () => {
  const router = useRouter();
  const [personalityAnswers, setPersonalityAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [personalityScores, setPersonalityScores] = useState<
    Record<string, number>
  >({
    Introvert: 0,
    Extrovert: 0,
  });
  const [personalityScoresPercent, setPersonalityScoresPercent] = useState<
    Record<string, number>
  >({
    Introvert: 0,
    Extrovert: 0,
  });
  const [personalityCategoryScores, setPersonalityCategoryScores] = useState<
    Record<string, number>
  >({
    interpersonal_skills: 0,
    stress_handling: 0,
    leadership: 0,
    dominance: 0,
    influence: 0,
    agreeableness: 0,
    openness: 0,
    conscientiousness: 0,
  });
  const [
    personalityCategoryScoresPercent,
    setPersonalityCategoryScoresPercent,
  ] = useState<Record<string, number>>({
    interpersonal_skills: 0,
    stress_handling: 0,
    leadership: 0,
    dominance: 0,
    influence: 0,
    agreeableness: 0,
    openness: 0,
    conscientiousness: 0,
  });
  const [showChart, setShowChart] = useState(false);
  const [questionArray, setQuestionArray] = useState<
  Record<string, PersonalityTrait[]>
>({});
  useEffect(() => {
    const getQuestions = async () => {
      const questions = await fetchAndProcessQuestions();
      setQuestionArray(questions);
    };
    getQuestions();
  }, []);  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadyToSave, setIsReadyToSave] = useState(false);
  const [user_id, setUserId] = useState("user123");

  if (!questionArray) {
    return <div className="text-center py-10">Loading questions...</div>;
  }  

  const totalQuestions = Object.values(questionArray).flat().length;
  const QUESTIONS_PER_PAGE = 20;

  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const handleChange = (category: string, index: number, value: string) => {
    if (!showChart) {
      setPersonalityAnswers((prev) => ({
        ...prev,
        [`${category}-${index}`]: value,
      }));
    }
    sessionStorage.setItem(`${category}-${index}`, value);
  };

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
    setPersonalityAnswers(storedAnswers);
  }, [questionArray]);

  // Load answers from storage when the component mounts
  useEffect(() => {
    if (Object.keys(questionArray).length > 0) {
      loadAnswersFromStorage();
    }
  }, [loadAnswersFromStorage, currentPage]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    let personalityNewScores: Record<string, number> = {
      Introvert: 0,
      Extrovert: 0,
    };

    let personalityNewScoresPercent: Record<string, number> = {
      Introvert: 0,
      Extrovert: 0,
    };

    let personalityNewCategoryScores: Record<string, number> = {
      interpersonal_skills: 0,
      stress_handling: 0,
      leadership: 0,
      dominance: 0,
      influence: 0,
      agreeableness: 0,
      openness: 0,
      conscientiousness: 0,
    };
    let personalityNewCategoryScoresPercent: Record<string, number> = {
      interpersonal_skills: 0,
      stress_handling: 0,
      leadership: 0,
      dominance: 0,
      influence: 0,
      agreeableness: 0,
      openness: 0,
      conscientiousness: 0,
    };

    let totalQuestions = 0;
    let index = 0;

    Object.entries(questionArray).forEach(([category, questions]) => {
      questions.forEach((question) => {
        const answer = personalityAnswers[`${category}-${index}`];
        if (answer) {
          if (answer === "strongly-agree") {
            personalityNewScores[question.type]++;
            personalityNewCategoryScores[category]++;
            totalQuestions++;
          } else if (answer === "agree") {
            personalityNewScores[question.type] += 0.75;
            personalityNewCategoryScores[category] += 0.75;
            totalQuestions += 0.75;
          } else if (answer === "neutral") {
            personalityNewScores[question.type] += 0.5;
            personalityNewCategoryScores[category] += 0.5;
            totalQuestions += 0.5;
          } else if (answer === "disagree") {
            personalityNewCategoryScores[category] += 0.25;
            totalQuestions += 0.75;
            if (question.type === "Introvert") {
              personalityNewScores["Extrovert"] += 0.75;
            } else if (question.type === "Extrovert") {
              personalityNewScores["Introvert"] += 0.75;
            }
          } else if (answer === "strongly-disagree") {
            personalityNewCategoryScores[category] += 0;
            totalQuestions++;
            if (question.type === "Introvert") {
              personalityNewScores["Extrovert"] += 1;
            } else if (question.type === "Extrovert") {
              personalityNewScores["Introvert"] += 1;
            }
          }
        }
        index++;
      });
    });

    personalityNewScoresPercent["Introvert"] =
      Math.round((personalityNewScores["Introvert"] / totalQuestions) * 100);
    personalityNewScoresPercent["Extrovert"] =
      Math.round((personalityNewScores["Extrovert"] / totalQuestions) * 100);

    Object.entries(questionArray).forEach(([category, questions]) => {
      personalityNewCategoryScoresPercent[category] =
        Math.round((personalityNewCategoryScores[category] / 5) * 100);
    });

    setPersonalityScores(personalityNewScores);
    setPersonalityCategoryScores(personalityNewCategoryScores);
    setPersonalityScoresPercent(personalityNewScoresPercent);
    setPersonalityCategoryScoresPercent(personalityNewCategoryScoresPercent);
    setShowChart(true);

    setIsReadyToSave(true);
  };

  useEffect(() => {
    if (isReadyToSave) {
      const handleSave = async () => {
        try {
          await axios.post("/api/results", {
            user_id,
            personalityAnswers,
            personalityScores: personalityScoresPercent,
            personalityCategoryScores: personalityCategoryScoresPercent,
          });
          console.log("Data saved successfully!");
        } catch (err) {
          console.error("Error saving data:", err);
        } finally {
          setIsSubmitting(false);
        }
      };

      handleSave();
      setIsReadyToSave(false);
    }
  }, [
    isReadyToSave,
    personalityAnswers,
    personalityScoresPercent,
    personalityCategoryScoresPercent,
    user_id,
  ]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour 
         in place of 'smooth' */
    });
  };

  const handleNext = () => {
    router.push("/softskills");
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
      <Header progressBar={[]} />
      <div className="w-full bg-color-50 rounded-2xl flex flex-col space-x-2 justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-6"
        >
          <h1 className="text-3xl font-bold">Round 1: Know Your Personality</h1>
          <div className="bg-color-150 rounded-3xl p-2 w-full flex gap-2 justify-center border border-color-1100">
            <span>Strongly Agree</span>
            <span>&#x2022;</span>
            <span>Agree</span>
            <span>&#x2022;</span>
            <span>Neutral</span>
            <span>&#x2022;</span>
            <span>Disagree</span>
            <span>&#x2022;</span>
            <span>Strongly Disagree</span>
          </div>
          {paginatedQuestions.map((question, index) => {
            const questionIndex =
              (currentPage - 1) * QUESTIONS_PER_PAGE + index;
            const key = `${question.category}-${questionIndex}`;
            return (
              <div
                key={key}
                className={`w-full bg-blueEq hover:bg-color-50 has-[input:checked]:bg-[#0A433E] rounded-3xl flex flex-col items-center justify-center py-4 border border-color-1100 space-y-3`}
              >
                <p className="text-lg font-semibold">{question.question}</p>
                <div className="flex space-x-4">
                  Agree
                  <label className="ml-4 flex flex-col gap-2">
                    <input
                      type="radio"
                      name={key}
                      value="strongly-agree"
                      checked={personalityAnswers[key] === "strongly-agree"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "strongly-agree"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-[#8dedf6] peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-[#8dedf6]" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="agree"
                      checked={personalityAnswers[key] === "agree"}
                      onChange={() =>
                        handleChange(question.category, questionIndex, "agree")
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-[#afeaa3] peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-[#afeaa3]" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="neutral"
                      checked={personalityAnswers[key] === "neutral"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "neutral"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-[#f4f79d] peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-[#f4f79d]" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="disagree"
                      checked={personalityAnswers[key] === "disagree"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "disagree"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-[#efc38d] peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-[#efc38d]" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={key}
                      value="strongly-disagree"
                      checked={personalityAnswers[key] === "strongly-disagree"}
                      onChange={() =>
                        handleChange(
                          question.category,
                          questionIndex,
                          "strongly-disagree"
                        )
                      }
                      className="hidden peer"
                    />
                    <div className="mr-4 p-3 bg-color-800 rounded-full peer-checked:bg-[#e78787] peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-[#e78787]" />
                  </label>
                  Disagree
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
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <AlertDialogTrigger>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </AlertDialogTrigger>
              </Button>
              <AlertDialogContent>
                <div className="bg-color-150 text-color-1100 w-full h-full flex flex-col gap-4 items-center justify-center border border-color-1100 rotate-3 rounded-3xl p-6">
                  <AlertDialogHeader className="flex flex-col items-center gap-2 w-fit">
                    <AlertDialogTitle className="flex flex-col justify-center items-center w-full">
                      <p>Woohoo!&#129395;</p> <p>Round 1 Completed</p>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col justify-center items-center w-full">
                      {showChart &&
                        (personalityScores.Introvert >
                          personalityScores.Extrovert ? (
                          <div className="text-center">
                            It looks like you are an Introvert &#129323;{" "}
                            continue to know more about yourself...
                          </div>
                        ) : personalityScores.Introvert <
                          personalityScores.Extrovert ? (
                          <div className="text-center">
                            You got the energy of an Extrovert &#128516;{" "}
                            continue to know more about yourself...
                          </div>
                        ) : (
                          <div className="text-center">
                            Looks like you got best of both worlds &#129395;.
                            You are an Ambivert continue to know more about
                            yourself...
                          </div>
                        ))}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      <X />
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleNext}>
                      Round 2
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

export default Personality;
