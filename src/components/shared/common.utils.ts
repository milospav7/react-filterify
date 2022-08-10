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
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

const faIconByOperator: Record<string, IconDefinition> = {
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
