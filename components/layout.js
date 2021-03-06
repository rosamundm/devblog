import Prism from "prismjs";
import { useEffect } from "react";
import Alert from "../components/alert";
import Footer from "../components/footer";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {

  useEffect(() => {
    Prism.highlightAll();
  }, []);
  
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Alert preview={preview} />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
