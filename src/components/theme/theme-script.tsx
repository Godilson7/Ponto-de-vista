/**
 * Aplica o tema (claro/escuro) ANTES da pintura, evitando flash.
 * Usa a preferência guardada; sem escolha, abre em CLARO (tema por defeito).
 * Colocar no topo do <body>.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark';var e=document.documentElement;d?e.classList.add('dark'):e.classList.remove('dark');}catch(e){}})();`
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}
