import {
  faAsterisk,
  faCommentDots,
  faCommentSlash,
  faEquals,
  faGreaterThan,
  faGreaterThanEqual,
  faLessThan,
  faLessThanEqual,
  faNotEqual,
} from "@fortawesome/free-solid-svg-icons";
import { ValueTypedObject } from "../store/types";

const faIconByOperator: ValueTypedObject<any> = {
  eq: faEquals,
  ne: faNotEqual,
  gt: faGreaterThan,
  ge: faGreaterThanEqual,
  lt: faLessThan,
  le: faLessThanEqual,
  contains: faCommentDots,
  doesnotcontain: faCommentSlash,
  notlike: faCommentSlash,
  startswith: faAsterisk,
  endswith: faAsterisk,
};

export { faIconByOperator };
