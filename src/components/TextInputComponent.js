import CustomTextInputField from "./CustomTextInputField";

const TextInputComponent = ({ labelColor, heightC, isBorder, ...props }) => {
  return (
    <CustomTextInputField
      {...props}
      style={{ height: heightC ? heightC : 48 }}
      cursorColor={labelColor}
      placeholderTextColor={labelColor}
      className={` w-full  text-black 
       border border-border-color h-12
       rounded-3xl px-6 py-3 mt-4 text-sm `}
    />
  );
};

export default TextInputComponent;
