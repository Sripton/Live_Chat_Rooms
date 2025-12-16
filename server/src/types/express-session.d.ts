// Не компилируется в JS
// TypeScript использует его только для типов
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}
