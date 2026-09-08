import type { Page } from "@playwright/test";
import {
  openTemplatesModal,
  waitForNewProjectButton,
} from "./flow/new-project-flow";
import { seedFlowIfEmpty } from "./flow/seed-flow-if-empty";

export const awaitBootstrapTest = async (
  page: Page,
  options?: {
    skipGoto?: boolean;
    skipModal?: boolean;
    seedFlowIfEmpty?: boolean;
  },
) => {
  const prepareMainPage = async (shouldGoto: boolean) => {
    if (shouldGoto) {
      // 显式进入列表，避免默认登录落点进入单个工作流。
      await page.goto("/all");
    }

    await page.waitForSelector('[data-testid="mainpage_title"]', {
      timeout: 30000,
    });

    if (options?.seedFlowIfEmpty ?? true) {
      await seedFlowIfEmpty(page);
    }

    await waitForNewProjectButton(page);
  };

  await prepareMainPage(!options?.skipGoto);

  if (!options?.skipModal) {
    await openTemplatesModal(page);
  }
};
