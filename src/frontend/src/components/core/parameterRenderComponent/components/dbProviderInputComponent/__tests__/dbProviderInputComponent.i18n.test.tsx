import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import en from "@/locales/en.json";
import zhHans from "@/locales/zh-Hans.json";
import { DBProviderInput } from "..";

jest.unmock("react-i18next");

jest.mock("@/controllers/API/queries/variables", () => ({}));
jest.mock("@/stores/flowsManagerStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const scrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollIntoView",
);
beforeAll(() => {
  // jsdom 不实现滚动布局，保留真实下拉框交互并补齐浏览器方法。
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: jest.fn(),
  });
});
afterAll(() => {
  if (scrollIntoViewDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollIntoView",
      scrollIntoViewDescriptor,
    );
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
  }
});

it("打开下拉框后切换语言时更新所有提供商描述", async () => {
  const i18n = createInstance();
  await i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    keySeparator: false,
    resources: {
      en: { translation: en },
      "zh-Hans": { translation: zhHans },
    },
    interpolation: { escapeValue: false },
  });
  const user = userEvent.setup();
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <DBProviderInput
          id="db-provider-language"
          value="chroma"
          globalVariables={[]}
          aria-label="数据库提供商"
          onValueChange={jest.fn()}
        />
      </MemoryRouter>
    </I18nextProvider>,
  );
  await user.click(screen.getByRole("combobox", { name: "数据库提供商" }));

  const providerIds = [
    "chroma",
    "chroma_cloud",
    "opensearch",
    "astra",
    "mongodb",
    "postgres",
  ] as const;
  for (const language of ["en", "zh-Hans", "en"] as const) {
    await act(async () => {
      await i18n.changeLanguage(language);
    });
    const translations = language === "en" ? en : zhHans;
    for (const id of providerIds) {
      const key = `settings.dbProviders.providers.${id}.description` as const;
      expect(
        within(screen.getByTestId(`${id}-provider-option`)).getByText(
          translations[key],
        ),
      ).toBeVisible();
    }
  }
});
