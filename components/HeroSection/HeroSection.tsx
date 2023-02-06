import Link from 'next/link'
import styles from './HeroSection.module.css'

const HeroSection = () => {
  return (
    <section>
      <div className={styles.container}>
        <div className={styles.board}>
          <div className={styles.box}>
            <h1 style={{ color: 'fff' }}>Buy And Sell NFTS on Layer 2</h1>
            <div style={{ color: 'fff' }}>
              Discover, collect, and sell digital items on Optimism&apos;s
              largest NFT marketplace
            </div>
            <Link href="/">Explore NFTs</Link>
          </div>
          <div className={styles.box}></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
