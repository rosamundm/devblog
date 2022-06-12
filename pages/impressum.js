import Head from 'next/head'
import Container from '../components/container';
import Header from '../components/header';
import Layout from '../components/layout';

export default function Impressum() {
  return (
    <>
    <Layout>
      <Container>
      <Header />
        <div className="text-8xl font-bold text-center tracking-tighter leading-tight md:leading-none mb-12 text-center ">
          Impressum
        </div>

        <article className="mb-32">
          <Head>
            <title>
              Impressum
            </title>
          </Head>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl">
              Angaben gemäß §5 TMG
            </h2>
            <p>
              Rosamund Mather<br></br>
              10178 Berlin<br></br>
              <strong>E-Mail:</strong> rosamund@posteo.de
            </p>
              <br></br>
            <h2 className="text-4xl">
              Haftungsausschluss
            </h2>
            <p>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Dienstanbieter*in sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Dienstanbieter*in jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
              <br></br>
            <h2 className="text-4xl">
              Haftung für Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der*die jeweilige Anbieter*in oder Betreiber*in der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
              <br></br>
            <h2 className="text-4xl">
              Urheberrecht
            </h2>
            <p>
              Die durch den*die Seitenbetreiber*in erstellten bzw. verwendeten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der Zustimmung des*der jeweiligen Autor*in bzw. Ersteller*in. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht von dem*der Betreiber*in erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </div>
        </article>
      </Container>
    </Layout>
    </>
  )
}