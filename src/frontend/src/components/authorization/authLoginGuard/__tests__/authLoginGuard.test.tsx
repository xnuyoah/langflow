import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedLoginRoute } from "..";

let mockIsAuthenticated = false;
let mockAutoLogin = false;

jest.mock("@/stores/authStore", () => ({
  __esModule: true,
  default: (
    selector: (state: {
      isAuthenticated: boolean;
      autoLogin: boolean;
    }) => unknown,
  ) =>
    selector({
      isAuthenticated: mockIsAuthenticated,
      autoLogin: mockAutoLogin,
    }),
}));
jest.mock("@/hooks/use-sanitize-redirect-url", () => ({
  consumeRedirectUrl: () => null,
}));

beforeEach(() => {
  mockIsAuthenticated = false;
  mockAutoLogin = false;
});

const renderLoginRoute = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedLoginRoute>
              <div>登录表单</div>
            </ProtectedLoginRoute>
          }
        />
        <Route
          path="/flow/37c6e14c-caec-4e84-8c39-a73e35037fe2"
          element={<div>指定工作流</div>}
        />
        <Route path="*" element={<div>错误落点</div>} />
      </Routes>
    </MemoryRouter>,
  );

it("未登录时保留登录表单", () => {
  renderLoginRoute();
  expect(screen.getByText("登录表单")).toBeInTheDocument();
});

it.each(["password", "auto"])("%s 登录成功后默认进入指定工作流", (mode) => {
  mockIsAuthenticated = mode === "password";
  mockAutoLogin = mode === "auto";
  renderLoginRoute();
  expect(screen.getByText("指定工作流")).toBeInTheDocument();
});
