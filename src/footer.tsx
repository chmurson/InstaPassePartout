import { FC } from 'react'
import { GitHub, Instagram } from '@mui/icons-material'
import { Link, Stack } from '@mui/material'
// @ts-ignore
import Wiki from './assets/wiki2.svg?react'

export const Footer: FC = () => {
  return (
    <footer style={{ padding: '1em 2em', borderTop: '1px solid #bcbcbc' }}>
      <Stack justifyContent="space-between" direction="row">
        <Link
          color="inherit"
          variant="body2"
          underline="hover"
          href="https://en.wikipedia.org/wiki/Mat_(picture_framing)"
          target="_blank"
        >
          <Stack spacing={0.5} direction="row" alignItems="center">
            <Wiki style={{ height: 22 }} />
            <span>passe-partout</span>
          </Stack>
        </Link>
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Link color="inherit" variant="body2" href="https://github.com/chmurson/instapassepartout" target="_blank">
            <GitHub />
          </Link>
          <Link color="inherit" variant="body2" href="https://www.instagram.com/wpiatkowskiphoto/" target="_blank">
            <Instagram />
          </Link>
        </Stack>
      </Stack>
    </footer>
  )
}
