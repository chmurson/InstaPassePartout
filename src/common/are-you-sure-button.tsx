import { type FC, type ReactNode, useRef, useState } from "react";

type Props = {
  firstBtn: (arg: { onClick: () => void }) => ReactNode;
  secondBtn: () => ReactNode;
};

const TIME_BEFORE_CONFRIMATION_DISAPPEAR_IN_MS = 2500;
export const AreYouSureButton: FC<Props> = ({ firstBtn, secondBtn }) => {
  const [isSecondBtn, setIsSecondBtn] = useState(false);
  const timeoutRef = useRef<number>();

  const handleOnClick = () => {
    clearTimeout(timeoutRef.current);
    setIsSecondBtn(true);
    timeoutRef.current = window.setTimeout(() => {
      setIsSecondBtn(false);
    }, TIME_BEFORE_CONFRIMATION_DISAPPEAR_IN_MS);
  };

  if (isSecondBtn) {
    return secondBtn();
  }

  return firstBtn({ onClick: handleOnClick });
};
