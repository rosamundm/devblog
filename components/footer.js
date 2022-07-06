import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link'
import Container from './container'
import { EXAMPLE_PATH } from '../lib/constants'


export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <div className="text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            
            <a
              href="/impressum/">
              © Rosamund Mather {(new Date().getFullYear())}
            </a>

            <br></br>

            <a href="mailto:rosamund@posteo.de">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ fontSize: 25 }}
                  />
            </a> {''}

            <a href="https://github.com/rosamundm">
                  <FontAwesomeIcon
                    icon={faGithub}
                    style={{ fontSize: 25 }}
                  />
            </a> {''}
            {/*
            <a href="https://twitter.com/ro_sa_mu_nd">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    style={{ fontSize: 25 }}
                  />
            </a> {''}
            */}
            <a href="https://www.linkedin.com/in/rosamundm/">
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    style={{ fontSize: 25 }}
                  />
            </a> {''}




          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <div
              className="mx-3 text-sm"
            >
              <a
                href="https://help-ua-volunteers.com/"
                className="mx-1 text-center bg-black hover:bg-white hover:text-black border no-underline border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-4 lg:mb-0"
              >
                🇺🇦 Help Ukrainian volunteers!
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
