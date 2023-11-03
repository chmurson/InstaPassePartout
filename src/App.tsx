import './App.css'
import { Introduction } from './introduction'
import { Calculator } from './calculator'
import { usePersistedState } from './common/use-persisted-state.ts'
import { Footer } from './footer.tsx'

function App() {
  const [seenIntroduction, setSeenIntroduction] = usePersistedState<boolean>(false, 'introduction', {
    toString: (x) => (x ? 'true' : 'false'),
    fromString: (x) => x === 'true',
  })

  return (
    <>
      <div style={{ flex: '1 0 auto', padding: '2em' }}>
        <h1 style={{ letterSpacing: 2 }}>InstaPassePartout</h1>
        <h2 style={{ marginTop: '-1.25em' }}>
          <span style={{ fontSize: '0.75em' }}>Resizes images by adding margins</span>
        </h2>
        {!seenIntroduction && <Introduction onLetsGo={() => setSeenIntroduction(true)} />}
        {seenIntroduction && <Calculator onBackToIntro={() => setSeenIntroduction(false)} />}
      </div>
      <Footer />
    </>
  )
}

export default App
