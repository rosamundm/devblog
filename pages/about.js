import Head from 'next/head'
import Container from '../components/container';
import Header from '../components/header';
import Layout from '../components/layout';

export default function About() {
  return (
    <>
    <Layout>
      <Container>
      <Header />
      <article className="mb-32">
          <Head>
              <title>
                About
              </title>
          </Head>

          <div className="max-w-2xl mx-auto">

              <h2 className="text-3xl">
                  👩🏼‍💻My name is Rosamund: software developer, writer, and ex-translator.
              </h2>
                  <br></br>
              <p>
                  I'm originally from the <a href="https://en.wikipedia.org/wiki/East_Anglia\">East Anglia</a> region of England — grew
                  up in Norfolk and Suffolk, specifically — and have been living in Berlin, Germany since 2014.
              </p>
                  <br></br>
              <p>
                  I see myself as stuck somewhere between the literary and tech worlds. Aside from being a dev, I'm currently revising my 
                  first novel manuscript, plus I have a couple of other writing projects going on (but I'm trying to get into the habit of 
                  finishing things before I start new ones). Otherwise, you'll most likely find me stuck in a good book. I veer strongly 
                  towards novels and memoirs with queer or feminist themes.
              </p>
                  <br></br>
              <h2 className="text-3xl">
                  Some other fun facts:
              </h2>
                  <br></br>
              <ul>
                  <li>
                      🗣 When I was about 16, I set a life goal of being fluent in one Romance, one 
                      Germanic, and one Slavic language. I've got French and German down, but I'm 
                      still working on Russian.
                  </li>
                  <li>
                      🐱 I'm a proud co-parent to three cheeky cats.
                  </li>
                  <li>
                      🌱 I've been vegan for 10 years and wouldn't have it any other way!
                  </li>
              
              </ul>
                  <br></br>

              <h2 className="text-3xl">
                  My coding origin story: if you're curious about how I got into it, read on...
              </h2>
                  <br></br>
              <blockquote>
                <em>
                  Code is speech; speech a human utters to silicon, which makes the machine come to life and do our will. 
                  This makes code oddly literary. [...] While physical machines like car engines or can openers are 
                  governed by patent law, software is also governed by copyright, making it a weird sister of 
                  the poem or the novel.
                </em>
                  <br></br>
                <strong>
                  Clive Thompson, 'Coders: The Making of a New Tribe and the Remaking of the World'
                </strong>
              </blockquote>
                  <br></br>
              <p>
                  Blogging has been part of my life since circa 2005. I made the original iteration of this one (what happened to it?)
                  in 2019, initially to document my journey as a developer, and to practise making a real, live website with a database and
                  everything. Building a blog, rather than relying one of the popular hosting sites, was the perfect way to achieve both those things.
              </p>
                  <br></br>
              <p>
                  At the same time, as I was starting out on the new terrain of tech, it quickly became obvious that quite apart from actually learning to 
                  code and use common developer tools, it was going to be an uphill struggle. For one thing, my gender was underrepresented in this new 
                  industry, and what's more, at that point I had around five years of a different career under my belt — a so-called "non-technical" career,
                  at that.
              </p>
                  <br></br>
              <p>
                  Actually, I never doubted that my experience as a natural-language professional was a strength, but some overlooked or dismissed this. This inspired
                  me to make my blog not just a <a href="https://www.swyx.io/learn-in-public/">learning in public</a> resource, actively have a mission behind it: 
                  to show that two of my passions, literature and programming, might not be so different after all. I firmly believe that we don't need to whittle ourselves 
                  down into one category, no matter how disparate those categories might appear at first glance.
              </p>
                  <br></br>
              <p>
                  I chose to study foreign languages at university, initially because of my desire to access other cultures, but in retrospect,
                  it was also because of my love of syntax, structure, and making tiny changes to a bigger picture. I found that various elements, possibly abstract or
                  random at first glance, could slot neatly into place and effect powerful messages.
              </p>
                  <br></br>
              <p>
                  We all contain multitudes. Now I build software for a living, but in no way does that mean I'm exclusively a developer. I haven't given up on writing, nor do I no longer identify
                  as a writer. In fact, I believe my continuing writing practice keeps me in balance.
              </p>
                  <br></br>

              <h3 className="text-2xl">
                  My journey: short version
              </h3>
                  <br></br>
              <ul>
                  <li>
                      <strong>June 2018:</strong> randomly took part in the annual Django Girls workshop in Berlin (a Saturday that 
                      changed the trajectory of my life, though at the time, I wouldn't have guessed this at all)
                  </li>
                  <li>
                      <strong>October 2018:</strong> got a job as a content manager of a Django-based site with one of the workshop's sponsors, 
                      a software development agency, while still freelancing as a translator/editor/writer on the side
                  </li>
                  <li>
                      <strong>March 2019:</strong> with the encouragement of a colleague/friend, started studying Python in earnest
                      and building my own Django apps
                  </li>
                  <li>
                      <strong>October 2018:</strong> decided I wanted to switch careers, started to bug my employer about it
                  </li>
                  <li>
                      <strong>April 2020:</strong> did a part-time Python course for a couple of months, costs partially covered by employer
                  </li>
                  <li>
                      <strong>September 2020:</strong> began as a junior software developer in the same company
                  </li>
              
              </ul>
              
          </div>
      </article>
        
      </Container>
    </Layout>
    </>
  )
}