/**
 * Aplica o tema (claro/escuro) ANTES da pintura, evitando flash.
 * Lê a preferência guardada ou o sistema. Colocar no topo do <body>.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;d?e.classList.add('dark'):e.classList.remove('dark');}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
