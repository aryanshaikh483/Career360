"use client";

import React, { useCallback, useEffect, useState } from "react";
import assessmentData from "@/GeneralData.json";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const QUESTIONS_PER_PAGE = 20;

const AssessmentTest: React.FC = () => {
  const router = useRouter();
  const [user_id, setUserId] = useState("user123");
  const [careerAnswers, setCareerAnswers] = useState<{ [key: string]: string }>(
    {}
  );
  const [careerScores, setCareerScores] = useState<Record<string, number>>({
    Creating: 0,
    "Logical Thinking": 0,
    Helping: 0,
    Organizing: 0,
    Persuading: 0,
  });
  const [fieldScores, setFieldScores] = useState<Record<string, number>>({
    coding: 0,
    design: 0,
    soft_skills: 0,
    marketing: 0,
    product: 0,
  });
  const [progressScores, setProgressScores] = useState<Record<string, number>>({
    Skills: 0,
    Knowledge: 0,
    Application: 0,
  });
  const [progressCountScores, setProgressCountScores] = useState<
    Record<string, number>
  >({
    Skills: 0,
    Knowledge: 0,
    Application: 0,
  });
  const [showChart, setShowChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [diffScores, setDiffScores] = useState<Record<string, number>>({
    Creating: 0,
    "Logical Thinking": 0,
    Helping: 0,
    Organizing: 0,
    Persuading: 0,
  });
  const [isReadyToSave, setIsReadyToSave] = useState(false);

  const questionArray = assessmentData;

  const totalQuestions = questionArray.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

  const handleChange = (type: string, id: number, value: string) => {
    if (!showChart) {
      setCareerAnswers((prev) => ({ ...prev, [`${type}-${id}`]: value }));
    }
    sessionStorage.setItem(`${type}-${id}`, value);
  };

  // Function to load answers from sessionStorage when the page loads or changes
  const loadAnswersFromStorage = useCallback(() => {
    const storedAnswers: { [key: string]: string } = {};
    let index = 0;
    questionArray.forEach((question) => {
      const key = `${question.type}-${index}`;
      const storedAnswer = sessionStorage.getItem(key);
      if (storedAnswer) {
        storedAnswers[key] = storedAnswer;
      }
      index++;
    });

    setCareerAnswers(storedAnswers);
  }, [questionArray]);

  // Load answers from storage when the component mounts
  useEffect(() => {
    loadAnswersFromStorage();
  }, [loadAnswersFromStorage, currentPage]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newScores: Record<string, number> = {
      Creating: 0,
      "Logical Thinking": 0,
      Helping: 0,
      Organizing: 0,
      Persuading: 0,
    };

    const newfieldScores: Record<string, number> = {
      coding: 0,
      design: 0,
      soft_skills: 0,
      marketing: 0,
      product: 0,
    };

    const totalScores: Record<string, number> = {
      Creating: 0,
      "Logical Thinking": 0,
      Helping: 0,
      Organizing: 0,
      Persuading: 0,
    };

    const newdiffScores: Record<string, number> = {
      Creating: 0,
      "Logical Thinking": 0,
      Helping: 0,
      Organizing: 0,
      Persuading: 0,
    };

    const newProgressScores: Record<string, number> = {
      Skills: 0,
      Knowledge: 0,
      Application: 0,
    };

    const newProgressScoresCount: Record<string, number> = {
      Skills: 0,
      Knowledge: 0,
      Application: 0,
    };

    questionArray.forEach((question, id) => {
      const answer = careerAnswers[`${question.type}-${id}`];
      if (answer === "yes") {
        newScores[question.type]++;
        newProgressScores[question.category]++;
        newfieldScores[question.field]++;
      } else if (answer === "no") {
        newScores[question.type] = newScores[question.type] + 0;
      }
      totalScores[question.type]++;
      newdiffScores[question.type] =
        totalScores[question.type] - newScores[question.type];
      if (question.category === "Skills") {
        newProgressScoresCount["Skills"]++;
      } else if (question.category === "Application") {
        newProgressScoresCount["Application"]++;
      } else if (question.category === "Knowledge") {
        newProgressScoresCount["Knowledge"]++;
      }
    });

    setCareerScores(newScores);
    setFieldScores(newfieldScores);
    setDiffScores(newdiffScores);
    setProgressScores(newProgressScores);
    setProgressCountScores(newProgressScoresCount);
    setShowChart(true);

    setIsReadyToSave(true);
  };

  useEffect(() => {
    if (isReadyToSave) {
      const handleSave = async () => {
        try {
          await axios.put(`/api/results/${user_id}`, {
            careerAnswers,
            careerScores: careerScores,
            diffScores: diffScores,
            progressScores: progressScores,
            progressCountScores: progressCountScores,
            fieldScores: fieldScores,
          });
          console.log("Data saved successfully!");
          router.push("/result");
        } catch (err) {
          console.error("Error saving data:", err);
        }
      };

      handleSave();
      setIsReadyToSave(false);
    }
  }, [
    isReadyToSave,
    careerAnswers,
    careerScores,
    fieldScores,
    diffScores,
    progressScores,
    progressCountScores,
    router,
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

  const getPaginatedQuestions = () => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questionArray.slice(start, end);
  };

  const paginatedQuestions = getPaginatedQuestions();

  return (
    <div className="flex flex-col text-color-1100">
      <Header progressBar={[1, 2]} />
      <div className="bg-color-50 w-full rounded-2xl flex flex-col space-x-2 justify-center items-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center space-y-6"
        >
          <h1 className="text-3xl font-bold">
            Round 3: Know About Your Interests
          </h1>
          <div className="bg-color-150 rounded-3xl p-2 w-full flex gap-2 justify-center border border-color-1100">
            <span>Yes</span>
            <span>&#x2022;</span>
            <span>No</span>
          </div>
          {paginatedQuestions.map((question, index) => {
            const questionIndex =
              (currentPage - 1) * QUESTIONS_PER_PAGE + index;
            const key = `${question.type}-${questionIndex}`;
            return (
              <div
                key={`${question.type}-${questionIndex}`}
                className={`w-full bg-greenEq hover:bg-color-50 has-[input:checked]:bg-greenEq rounded-3xl flex flex-col items-center justify-center py-4 border border-color-1100 space-y-3`}
              >
                <p className="text-lg font-semibold">{question.question}</p>
                <div className="flex space-x-4">
                  Yes
                  <label className="ml-4 flex flex-col gap-2">
                    <input
                      type="radio"
                      name={`${question.type}-${questionIndex}`}
                      value="yes"
                      checked={careerAnswers[key] === "yes"}
                      onChange={() =>
                        handleChange(question.type, questionIndex, "yes")
                      }
                      className="hidden peer"
                    />
                    <div className="p-3 bg-color-800 rounded-full peer-checked:bg-color-1100 peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-color-1100" />
                  </label>
                  <label className="flex flex-col">
                    <input
                      type="radio"
                      name={`${question.type}-${questionIndex}`}
                      value="no"
                      checked={careerAnswers[key] === "no"}
                      onChange={() =>
                        handleChange(question.type, questionIndex, "no")
                      }
                      className="hidden peer"
                    />
                    <div className="mr-4 p-3 bg-color-800 rounded-full peer-checked:bg-color-1100 peer-checked:ring-offset-2 peer-checked:ring peer-checked:ring-color-1100" />
                  </label>
                  No
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
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
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

export default AssessmentTest;
