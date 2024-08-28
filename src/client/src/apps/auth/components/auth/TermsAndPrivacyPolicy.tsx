import {Link} from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const TermsAndPrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <p className="text-center text-small">
      {t("privacy.agreeToOur")}&nbsp;
      <Link href="#" size="sm">{t("privacy.terms")}</Link>&nbsp;
      {t("common.and").toLowerCase()}&nbsp;
      <Link href="#" size="sm">{t("privacy.privacyPolicy")}</Link>
    </p>
  );
};

export default TermsAndPrivacyPolicy;