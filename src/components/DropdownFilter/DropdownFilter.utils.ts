type DropdownStyleType = {
  size: "sm" | "lg";
  colorCodesMap?: Record<string, string>;
};

const getLgSelectStyle = (colorCodes: any) => ({
  option: (provided: any) => ({
    ...provided,
  }),
  control: (styles: any, state: any) => ({
    ...styles,
    minHeight: 31,
    fontSize: "1.25rem",
    borderRadius: "0.3rem",
    margin: ".125rem 0 0",
    "&:hover": {},
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "calc(1.5em + 1rem + 2px)",
  }),
  input: (provided: any) => ({
    ...provided,
    fontSize: "1.25rem",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "1.25rem",
  }),
  ...(colorCodes && {
    multiValue: (provided: any, state: any) => {
      const optionData = state.data;
      const optionValue =
        typeof optionData === "object" ? optionData.value : optionData;
      const colorCode = colorCodes[optionValue];

      return {
        ...provided,
        fontSize: "1.25rem",
        backgroundColor: colorCode || provided.backgroundColor,
      };
    },
  }),
});

const getSmSelectStyle = (colorCodes: any) => ({
  option: (provided: any) => ({
    ...provided,
    fontSize: "0.765rem",
  }),
  control: (styles: any) => ({
    ...styles,
    minHeight: "calc(1.5em + .5rem)",
    "&:hover": {},
    lineHeight: "1.5",
    fontSize: "0.765rem",
    borderRadius: "0.2rem",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "27.375px",
  }),
  input: (provided: any) => ({
    ...provided,
    fontSize: "0.765rem",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: "0.765rem",
  }),
  multiValue: (provided: any, state: any) => {
    if (!colorCodes) {
      return {
        ...provided,
        fontSize: "0.765rem",
      };
    }
    const optionData = state.data;
    const optionValue =
      typeof optionData === "object" ? optionData.value : optionData;
    const colorCode = colorCodes[optionValue];

    return {
      ...provided,
      fontSize: "0.765rem",
      backgroundColor: colorCode || provided.backgroundColor,
    };
  },
});

const getDropdownStyles = ({ size, colorCodesMap }: DropdownStyleType) => {
  if (size === "sm") return getSmSelectStyle(colorCodesMap);
  if (size === "lg") return getLgSelectStyle(colorCodesMap);
};

export { getDropdownStyles };
