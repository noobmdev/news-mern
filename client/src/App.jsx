import { Routes } from "components/route/Routes";
import { GlobalContext } from "context/GlobalContext";
import { useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { IntlProvider } from "react-intl";
import { messages, LANGUAGES_SUPPORTED } from "language";

function App() {
  const { setCurrentUser, setLanguage, language } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      // get auth token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now();
          if (decoded?.exp > currentTime / 1000) {
            setCurrentUser(decoded);
          } else {
            localStorage.removeItem("token");
            setCurrentUser({});
          }
        } catch (err) {
          console.error("err", err);
          localStorage.removeItem("token");
          setCurrentUser({});
        }
      } else {
        setCurrentUser({});
      }

      // get language
      const lang = localStorage.getItem("lang");
      if (lang !== language) {
        if (lang && Object.values(LANGUAGES_SUPPORTED).includes(lang)) {
          setLanguage(lang);
        } else {
          setLanguage(LANGUAGES_SUPPORTED.en);
        }
      }

      setLoading((preState) => !preState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return loading ? (
    <div>loading</div>
  ) : (
    <IntlProvider locale={language} messages={messages[language]}>
      <Routes />
    </IntlProvider>
  );
}

export default App;
