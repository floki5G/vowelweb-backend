export interface IExtendableErrorConstructor {
  message: string;
  is_relogin?: boolean;
  code?: string | undefined;
}
