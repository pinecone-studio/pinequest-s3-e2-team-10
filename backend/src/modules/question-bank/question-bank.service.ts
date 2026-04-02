import { BadRequestException, Injectable } from '@nestjs/common';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  executeOrRethrowAsync,
  rethrowAsInternal,
} from '../../common/error-handling';
import type {
  CreateQuestionBankCategoryDto,
  CreateQuestionBankQuestionSetDto,
  QuestionBankCategory,
  QuestionBankDifficulty,
  QuestionBankQuestion,
  QuestionBankTopic,
} from './question-bank.types';

type StoredCategory = {
  id: string;
  name: string;
  createdAt: string;
};

type StoredTopic = {
  id: string;
  categoryId: string;
  name: string;
  createdAt: string;
};

type StoredQuestion = {
  id: string;
  topicId: string;
  type: QuestionBankQuestion['type'];
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: QuestionBankDifficulty;
  createdAt: string;
};

type LocalQuestionBankStore = {
  categories: StoredCategory[];
  topics: StoredTopic[];
  questions: StoredQuestion[];
};

type QuestionSeed = {
  correctAnswer?: string;
  difficulty: QuestionBankDifficulty;
  options?: string[];
  points: number;
  question: string;
  type: QuestionBankQuestion['type'];
};

type TopicSeed = {
  name: string;
  questions: QuestionSeed[];
};

type CategorySeed = {
  name: string;
  topics: TopicSeed[];
};

const LEGACY_DEFAULT_CATEGORY_NAME = 'Математик';
const LEGACY_DEFAULT_TOPIC_NAMES = [
  'Алгебр',
  'Функц ба график',
  'Геометр',
  'Магадлал ба статистик',
  'Тооцоо ба уламжлалын суурь',
];

const DEFAULT_QUESTION_BANK_SEED: CategorySeed[] = [
  {
    name: '1-р бүлэг - Бүхэл тоо',
    topics: [
      {
        name: '1.2 сэдэв - Үржих, хуваах үйлдэл',
        questions: [
          {
            type: 'multiple-choice',
            question: '(-6) x 4 илэрхийллийн хариу хэд вэ?',
            options: ['-24', '-10', '10', '24'],
            correctAnswer: '-24',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'multiple-choice',
            question: '36 : (-9) илэрхийллийг бод.',
            options: ['-4', '-3', '3', '4'],
            correctAnswer: '-4',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'true-false',
            question:
              'Хоёр сөрөг бүхэл тоог үржүүлэхэд эерэг тоо гарна.',
            correctAnswer: 'true',
            points: 12,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '(-48)-ыг 6-д хуваавал хэд гарах вэ? Бодолтоо бич.',
            correctAnswer: '-8',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
    ],
  },
  {
    name: '2-р бүлэг - Бутархай',
    topics: [
      {
        name: '2.1 сэдэв - Бутархай нэмэх, хасах',
        questions: [
          {
            type: 'multiple-choice',
            question: '1/4 + 2/4 нийлбэр хэд вэ?',
            options: ['3/4', '2/8', '1/2', '3/8'],
            correctAnswer: '3/4',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question:
              '5/6 - 1/6 = 4/6 тэнцэтгэл зөв.',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '3/5 + 1/10 илэрхийллийг ижил нэртэй болгоод бод.',
            correctAnswer: '7/10',
            points: 10,
            difficulty: 'standard',
          },
          {
            type: 'short-answer',
            question:
              '7/8 - 3/8 ялгаврыг ол.',
            correctAnswer: '4/8 буюу 1/2',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
      {
        name: '2.2 сэдэв - Бутархай үржих, хуваах',
        questions: [
          {
            type: 'multiple-choice',
            question:
              '2/3 x 3/5 үржвэр хэд вэ?',
            options: ['2/5', '6/15', '5/6', '1'],
            correctAnswer: '2/5',
            points: 8,
            difficulty: 'easy',
          },
          {
            type: 'true-false',
            question:
              '1/2 : 1/4 = 2 тэнцэтгэл зөв.',
            correctAnswer: 'true',
            points: 6,
            difficulty: 'easy',
          },
          {
            type: 'short-answer',
            question:
              '4/9 x 3/4 үржвэрийг хамгийн энгийн хэлбэрт бич.',
            correctAnswer: '1/3',
            points: 8,
            difficulty: 'standard',
          },
          {
            type: 'multiple-choice',
            question: '3/7 : 9/14 илэрхийллийн хариу аль нь вэ?',
            options: ['2/3', '3/2', '6/7', '7/6'],
            correctAnswer: '2/3',
            points: 10,
            difficulty: 'standard',
          },
        ],
      },
    ],
  },
];

@Injectable()
export class QuestionBankService {
  private readonly localStorePath = resolve(
    process.cwd(),
    '.data',
    'question-bank.json',
  );
  private localStoreLoaded = false;
  private localStore: LocalQuestionBankStore = {
    categories: [],
    topics: [],
    questions: [],
  };

  async findAll(): Promise<QuestionBankCategory[]> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      return this.buildSnapshot();
    }, 'Failed to list question bank records');
  }

  async createCategory(
    payload: CreateQuestionBankCategoryDto,
  ): Promise<QuestionBankCategory> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      const name = payload.name.trim();

      if (!name) {
        throw new BadRequestException('Category name is required');
      }

      const existingCategory = this.localStore.categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase(),
      );

      if (existingCategory) {
        return {
          ...existingCategory,
          topics:
            this.buildSnapshot().find(
              (category) => category.id === existingCategory.id,
            )?.topics ?? [],
        };
      }

      const createdCategory: StoredCategory = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
      };

      this.localStore.categories.push(createdCategory);
      await this.persistLocalStore();

      return {
        ...createdCategory,
        topics: [],
      };
    }, `Failed to create question bank category ${payload.name}`);
  }

  async createQuestionSet(
    payload: CreateQuestionBankQuestionSetDto,
  ): Promise<QuestionBankTopic> {
    return executeOrRethrowAsync(async () => {
      await this.ensureLocalStoreLoaded();
      const category = this.localStore.categories.find(
        (entry) => entry.id === payload.categoryId,
      );

      if (!category) {
        throw new BadRequestException('Choose a valid category');
      }

      const topicName = payload.topicName.trim();
      if (!topicName) {
        throw new BadRequestException('Topic name is required');
      }

      if (!payload.questions.length) {
        throw new BadRequestException('Add at least one question');
      }

      const existingTopic = this.localStore.topics.find(
        (topic) =>
          topic.categoryId === payload.categoryId &&
          topic.name.toLowerCase() === topicName.toLowerCase(),
      );

      const topicRecord: StoredTopic =
        existingTopic ??
        (() => {
          const createdTopic: StoredTopic = {
            id: crypto.randomUUID(),
            categoryId: payload.categoryId,
            name: topicName,
            createdAt: new Date().toISOString(),
          };
          this.localStore.topics.push(createdTopic);
          return createdTopic;
        })();

      const createdQuestions = payload.questions.map((question) => {
        const prompt = question.question.trim();
        if (!prompt) {
          throw new BadRequestException('Each question needs prompt text');
        }

        return {
          id: crypto.randomUUID(),
          topicId: topicRecord.id,
          type: question.type,
          question: prompt,
          options: question.options?.map((option) => option.trim()),
          correctAnswer: question.correctAnswer?.trim() || undefined,
          points: question.points,
          difficulty: payload.difficulty,
          createdAt: new Date().toISOString(),
        } satisfies StoredQuestion;
      });

      this.localStore.questions.push(...createdQuestions);
      await this.persistLocalStore();

      return this.buildTopic(topicRecord);
    }, `Failed to create question set for topic ${payload.topicName}`);
  }

  private buildSnapshot(): QuestionBankCategory[] {
    return this.localStore.categories
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((category) => ({
        ...category,
        topics: this.localStore.topics
          .filter((topic) => topic.categoryId === category.id)
          .sort((left, right) => left.name.localeCompare(right.name))
          .map((topic) => this.buildTopic(topic)),
      }));
  }

  private buildTopic(topic: StoredTopic): QuestionBankTopic {
    return {
      ...topic,
      questions: this.localStore.questions
        .filter((question) => question.topicId === topic.id)
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt)),
    };
  }

  private async ensureLocalStoreLoaded(): Promise<void> {
    if (this.localStoreLoaded) {
      return;
    }

    try {
      const rawContent = await readFile(this.localStorePath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<LocalQuestionBankStore>;

      this.localStore = {
        categories: parsed.categories ?? [],
        topics: parsed.topics ?? [],
        questions: parsed.questions ?? [],
      };
      const didMigrateLegacySeed = this.replaceLegacyDefaultQuestionBank();
      const didSeedDefaults = this.ensureDefaultMathQuestionBank();
      this.localStoreLoaded = true;
      if (didMigrateLegacySeed || didSeedDefaults) {
        await this.persistLocalStore();
      }
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code === 'ENOENT') {
        this.ensureDefaultMathQuestionBank();
        this.localStoreLoaded = true;
        await this.persistLocalStore();
        return;
      }

      rethrowAsInternal(
        error,
        `Failed to load question bank records from ${this.localStorePath}`,
      );
    }
  }

  private async persistLocalStore(): Promise<void> {
    try {
      await mkdir(dirname(this.localStorePath), { recursive: true });
      await writeFile(
        this.localStorePath,
        JSON.stringify(this.localStore, null, 2),
        'utf8',
      );
    } catch (error) {
      rethrowAsInternal(
        error,
        `Failed to persist question bank records to ${this.localStorePath}`,
      );
    }
  }

  private ensureDefaultMathQuestionBank() {
    const hasDemoCategories = DEFAULT_QUESTION_BANK_SEED.every((categorySeed) =>
      this.localStore.categories.some(
        (category) =>
          category.name.trim().toLowerCase() ===
          categorySeed.name.trim().toLowerCase(),
      ),
    );

    if (hasDemoCategories) {
      return false;
    }

    const createdAt = new Date().toISOString();

    DEFAULT_QUESTION_BANK_SEED.forEach((categorySeed) => {
      const categoryId = crypto.randomUUID();
      this.localStore.categories.push({
        id: categoryId,
        name: categorySeed.name,
        createdAt,
      });

      categorySeed.topics.forEach((topicSeed) => {
        const topicId = crypto.randomUUID();
        this.localStore.topics.push({
          id: topicId,
          categoryId,
          name: topicSeed.name,
          createdAt,
        });

        topicSeed.questions.forEach((questionSeed) => {
          this.localStore.questions.push({
            id: crypto.randomUUID(),
            topicId,
            type: questionSeed.type,
            question: questionSeed.question,
            options: questionSeed.options,
            correctAnswer: questionSeed.correctAnswer,
            points: questionSeed.points,
            difficulty: questionSeed.difficulty,
            createdAt,
          });
        });
      });
    });

    return true;
  }

  private replaceLegacyDefaultQuestionBank() {
    const legacyCategory = this.localStore.categories.find(
      (category) =>
        category.name.trim().toLowerCase() ===
        LEGACY_DEFAULT_CATEGORY_NAME.toLowerCase(),
    );

    if (!legacyCategory) {
      return false;
    }

    const legacyTopics = this.localStore.topics.filter(
      (topic) => topic.categoryId === legacyCategory.id,
    );

    const hasOnlyLegacyTopics =
      legacyTopics.length === LEGACY_DEFAULT_TOPIC_NAMES.length &&
      LEGACY_DEFAULT_TOPIC_NAMES.every((name) =>
        legacyTopics.some(
          (topic) => topic.name.trim().toLowerCase() === name.toLowerCase(),
        ),
      );

    if (!hasOnlyLegacyTopics) {
      return false;
    }

    const legacyTopicIds = new Set(legacyTopics.map((topic) => topic.id));
    this.localStore.categories = this.localStore.categories.filter(
      (category) => category.id !== legacyCategory.id,
    );
    this.localStore.topics = this.localStore.topics.filter(
      (topic) => !legacyTopicIds.has(topic.id),
    );
    this.localStore.questions = this.localStore.questions.filter(
      (question) => !legacyTopicIds.has(question.topicId),
    );

    return this.ensureDefaultMathQuestionBank();
  }
}
