import type {
  QuestionBankCategory,
  QuestionBankQuestion,
  QuestionBankTopic,
} from "@/lib/question-bank-api";

export function getReadableQuestionBankText(value: string) {
  if (!/[ÐÑÃ]/.test(value)) return value;

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded.includes("�") ? value : decoded;
  } catch {
    return value;
  }
}

export function normalizeQuestionBank(categories: QuestionBankCategory[]) {
  return categories.map((category) => ({
    ...category,
    name: getReadableQuestionBankText(category.name),
    topics: category.topics.map(normalizeQuestionBankTopic),
  }));
}

function normalizeQuestionBankTopic(topic: QuestionBankTopic): QuestionBankTopic {
  return {
    ...topic,
    name: getReadableQuestionBankText(topic.name),
    questions: topic.questions.map(normalizeQuestionBankQuestion),
  };
}

function normalizeQuestionBankQuestion(
  question: QuestionBankQuestion,
): QuestionBankQuestion {
  return {
    ...question,
    question: getReadableQuestionBankText(question.question),
    options: question.options?.map(getReadableQuestionBankText),
    correctAnswer: question.correctAnswer
      ? getReadableQuestionBankText(question.correctAnswer)
      : question.correctAnswer,
  };
}
