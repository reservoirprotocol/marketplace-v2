import Link from 'next/link'
import styles from './HeroSection.module.css'

const HeroSection = () => {
  return (
    <section>
      <div className={styles.container}>
        <div className={styles.board}>
          <div className={styles.box}>
            <h1>Buy And Sell NFTS on L2</h1>
            <div>
              Discover and Create NFTs and earn rewards on Optimism&apos;s
              largest NFT marketplace.
            </div>
            <Link href="/explore">Explore NFTs</Link>
          </div>
          <div className={styles.box}></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
