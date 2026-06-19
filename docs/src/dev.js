import {queryParams} from '../$.js'

// dev mode, toggled with ?dev=true in the URL.
// effects so far: the blackout veil is never shown (see views.setVeil).
export const dev = queryParams.dev === 'true'
