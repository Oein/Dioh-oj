import { SourceCode } from "@prisma/client";
export default interface realtimeMSG {
  columns: { name: string; type: string }[];
  commit_timestamp: string;
  errors: null | any;
  record: SourceCode;
  schema: string;
  table: string;
  type: string;
  old_record: {
    id: string;
  } | null;
}
