import { useTheme } from 'next-themes'
import Link from 'next/link'
import styles from './HeroSection.module.css'

interface IProp {
  hideLink?: boolean
}

const HeroSection = ({ hideLink }: IProp) => {
  const { theme } = useTheme()
  return (
    <section>
      <div className={styles.container}>
        <div className={styles.board}>
          <div className={styles.box}>
            <h1
              style={{ color: theme === 'light' ? '#fff !important' : '#fff' }}
            >
              Buy And Sell NFTS on L2
            </h1>
            <div
              style={{ color: theme === 'light' ? '#fff !important' : '#fff' }}
            >
              Discover and Create NFTs and earn rewards on Optimism&apos;s
              largest NFT marketplace.
            </div>
            {hideLink ?? <Link href="/explore">Explore NFTs</Link>}
          </div>
          {/* <div className={styles.box}></div> */}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
