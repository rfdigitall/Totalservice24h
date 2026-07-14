/** Shared service categories — must match Emergenze tiles on fabbro.html / idraulico.html */

export const FABRO_URGENCIES = {
  porta: 'Porte e serrature',
  cancello: 'Cancelli e garage',
  tapparella: 'Tapparelle e serrande',
  auto: 'Fabbro auto',
  altro: 'Altro problema fabbro',
}

export const IDRAULICO_URGENCIES = {
  perdita: 'Perdite e allagamenti',
  tubo: 'Tubi e rubinetti',
  scarico: 'Scarichi e WC',
  caldaia: 'Riscaldamento',
  altro: 'Altro problema idraulico',
}

export function buildLandingConfigScript({ id, city, service, whatsappPrefix }) {
  const urgencies = service === 'fabbro' ? FABRO_URGENCIES : IDRAULICO_URGENCIES
  const lines = Object.entries(urgencies).map(([k, v]) => `        ${k}: '${v.replace(/'/g, "\\'")}'`)
  const cityLine = city ? `\n      city: '${city.replace(/'/g, "\\'")}',` : ''
  return `<script>
    window.LANDING_CONFIG = {
      id: '${id}',
      whatsappPrefix: '${whatsappPrefix.replace(/'/g, "\\'")}',${cityLine}
      urgencies: {
${lines.join(',\n')}
      }
    }
  </script>`
}

export const FABRO_FOOTER_SERVIZI = `        <div class="footer__col">
          <h3 class="footer__heading">Servizi</h3>
          <ul class="footer__links">
            <li><a href="#servizi">Porte e serrature</a></li>
            <li><a href="#servizi">Cancelli e garage</a></li>
            <li><a href="#servizi">Tapparelle e serrande</a></li>
            <li><a href="#servizi">Fabbro auto</a></li>
            <li><a href="./idraulico.html">Idraulico h24</a></li>
          </ul>
        </div>`

export const IDRAULICO_FOOTER_SERVIZI = `        <div class="footer__col">
          <h3 class="footer__heading">Servizi</h3>
          <ul class="footer__links">
            <li><a href="#servizi">Perdite e allagamenti</a></li>
            <li><a href="#servizi">Tubi e rubinetti</a></li>
            <li><a href="#servizi">Scarichi e WC</a></li>
            <li><a href="#servizi">Riscaldamento</a></li>
            <li><a href="./fabbro.html">Fabbro h24</a></li>
          </ul>
        </div>`

export const HOME_FOOTER_SERVIZI = `        <div class="footer__col">
          <h3 class="footer__heading">Servizi</h3>
          <ul class="footer__links">
            <li><a href="./fabbro.html#servizi">Porte e serrature</a></li>
            <li><a href="./fabbro.html#servizi">Cancelli e garage</a></li>
            <li><a href="./idraulico.html#servizi">Perdite e allagamenti</a></li>
            <li><a href="./idraulico.html#servizi">Scarichi e WC</a></li>
            <li><a href="./fabbro.html">Fabbro h24</a></li>
            <li><a href="./idraulico.html">Idraulico h24</a></li>
          </ul>
        </div>`
