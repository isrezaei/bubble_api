import { HttpException, HttpStatus } from '@nestjs/common';

export function resReject({
  message,
  path,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
}: {
  message?: {
    english: string;
    persian?: string;
  };
  path: string;
  statusCode?: number;
}) {
  throw new HttpException(
    {
      message: {
        english: message?.english || `Internal server error in ${path}`,
        persian: message?.persian || 'خطا داخلی سرور',
      },
      statusCode,
    },
    statusCode,
  );
}
