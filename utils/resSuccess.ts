import { HttpStatus } from '@nestjs/common';

type Props = {
  result: any | null;
  path: string;
  message?: {
    english: string;
    persian: string;
  };
  statusCode?: number;
};

const resSuccess = ({
  result,
  path,
  message,
  statusCode = HttpStatus.OK,
}: Props) => {
  return {
    result,
    //prettier-ignore
    message : {
      english : message?.english || `✅ The process on the *${path}* was completed successfully `,
      persian : message?.persian  || "✅ درخواست با موفقیت انجام شد"
    },
    statusCode,
  };
};

export default resSuccess;
