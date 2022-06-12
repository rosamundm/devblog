import Link from 'next/link'
import Container from './container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EXAMPLE_PATH } from '../lib/constants'

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <div className="text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            <Link href={`/about/`}>about</Link> {''}
            <Link href={`/reading/`}>reading</Link> {''}
            <Link href={`/resources/`}>resources</Link> {''}
            <Link href={`/contact/`}>contact</Link>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://help-ua-volunteers.com/"
              className="mx-3 text-center bg-black hover:bg-white hover:text-black border no-underline border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              🇺🇦 Help Ukrainian volunteers!
            </a>
            <div
              className="mx-3 text-sm"
            >
              © Rosamund Mather {(new Date().getFullYear())} {''}
              <Link href={`/impressum/`}>Impressum</Link>
            </div>
            
          </div>
        </div>
      </Container>
    </footer>
  )
}
