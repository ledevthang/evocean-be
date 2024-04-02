import { HttpException } from "@nestjs/common";

export type AnyHow<T extends HttpException = HttpException> = {
  _tag: string;
  endCode: () => T;
};
