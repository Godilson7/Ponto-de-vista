-- ==========================================================================
-- Conteúdo de demonstração (correr DEPOIS de schema.sql). Idempotente por slug.
-- ==========================================================================

-- Categorias do blog -------------------------------------------------------
insert into public.taxonomies (nome, slug, tipo) values
  ('Autoria', 'autoria', 'categoria-blog'),
  ('Escrita', 'escrita', 'categoria-blog'),
  ('Mercado editorial', 'mercado-editorial', 'categoria-blog'),
  ('Posicionamento de autoridade', 'posicionamento-de-autoridade', 'categoria-blog'),
  ('Histórias de autores', 'historias-de-autores', 'categoria-blog'),
  ('Lançamentos', 'lancamentos', 'categoria-blog'),
  ('Eventos', 'eventos', 'categoria-blog'),
  ('Bastidores', 'bastidores', 'categoria-blog')
on conflict (slug) do nothing;

-- Autores ------------------------------------------------------------------
insert into public.authors
  (slug, nome, pais, cidade, area, areas_de_autoridade, frase_posicionamento, mini_bio, bio_completa, redes, participacoes, destaque, status)
values
  ('maria-fernandes', 'Maria Fernandes', 'Portugal', 'Lisboa', 'Liderança & Gestão',
   array['Liderança & Gestão','Cultura organizacional','Comunicação'],
   'A liderança como prática de escuta e permanência.',
   'Consultora e autora, dedica-se há duas décadas a formar líderes que ouvem antes de decidir.',
   E'Maria Fernandes é consultora de liderança e autora. Ao longo de vinte anos acompanhou equipas e conselhos de administração em Portugal e no Brasil, sempre a partir de uma convicção simples: a autoridade nasce da escuta, não da imposição.\n\nO seu trabalho cruza a gestão com as humanidades, e procura devolver gravidade e tempo a decisões que o mundo quer apressadas.',
   '[{"plataforma":"LinkedIn","url":"https://linkedin.com"},{"plataforma":"Instagram","url":"https://instagram.com"}]'::jsonb,
   '[{"tipo":"evento","titulo":"Fórum de Liderança de Lisboa","data":"2025","link":"#"},{"tipo":"podcast","titulo":"Conversas com Autoridade — Ep. 12","data":"2025","link":"#"}]'::jsonb,
   true, 'published'),
  ('joao-carvalho', 'João Carvalho', 'Brasil', 'São Paulo', 'Memória & Identidade',
   array['Memória & Identidade','História oral','Lusofonia'],
   'Narrativas que devolvem a história a quem a viveu.',
   'Historiador e narrador, recolhe e recompõe histórias dispersas pela diáspora de língua portuguesa.',
   E'João Carvalho é historiador e escritor. Dedica-se à história oral e à memória das comunidades de língua portuguesa, percorrendo arquivos e quintais para recolher vozes que de outro modo se perderiam.\n\nA sua escrita é um exercício de restituição.',
   '[{"plataforma":"Instagram","url":"https://instagram.com"}]'::jsonb,
   '[{"tipo":"evento","titulo":"Bienal do Livro de São Paulo","data":"2025","link":"#"}]'::jsonb,
   true, 'published'),
  ('ana-do-rosario', 'Ana do Rosário', 'Angola', 'Luanda', 'Educação',
   array['Educação','Políticas públicas','Desenvolvimento'],
   'Educação como caminho de autoridade e futuro.',
   'Educadora e investigadora, trabalha a educação como alavanca de autoridade e futuro.',
   E'Ana do Rosário é educadora e investigadora em políticas públicas de educação. Do quadro de giz às mesas de decisão, defende uma escola que forma vozes capazes de dialogar com o mundo.',
   '[{"plataforma":"LinkedIn","url":"https://linkedin.com"},{"plataforma":"YouTube","url":"https://youtube.com"}]'::jsonb,
   '[{"tipo":"evento","titulo":"Cimeira da Educação Lusófona","data":"2025","link":"#"}]'::jsonb,
   true, 'published'),
  ('rui-tavares-mendes', 'Rui Tavares Mendes', 'Portugal', 'Porto', 'Ensaio & Ideias',
   array['Ensaio & Ideias','Filosofia','Sociedade'],
   'O ensaio como forma de pensar devagar.',
   'Ensaísta, escreve sobre o tempo, a atenção e o lugar das ideias na vida pública.',
   E'Rui Tavares Mendes é ensaísta e professor. A sua obra interroga a pressa contemporânea e propõe o ensaio como exercício de pensar devagar, contra a corrente.',
   '[{"plataforma":"LinkedIn","url":"https://linkedin.com"}]'::jsonb,
   '[{"tipo":"entrevista","titulo":"Jornal das Ideias","data":"2025","link":"#"}]'::jsonb,
   false, 'published')
on conflict (slug) do nothing;

-- Livros -------------------------------------------------------------------
insert into public.books
  (slug, titulo, subtitulo, autor_id, sinopse_curta, sinopse_completa, temas, categoria, pais, publico_indicado, isbn, num_paginas, formato, link_compra, depoimentos, relacionados, destaque, status)
values
  ('o-peso-do-silencio', 'O Peso do Silêncio', 'Ensaios sobre escuta e liderança',
   (select id from public.authors where slug='maria-fernandes'),
   'Uma reflexão sóbria sobre o poder de quem sabe ouvir — e sobre a autoridade que nasce da contenção.',
   E'O Peso do Silêncio reúne ensaios escritos ao longo de duas décadas de prática. Maria Fernandes parte de uma intuição contracorrente: a verdadeira liderança não se ouve — escuta.\n\nAtravés de casos reais e de uma prosa contida, o livro propõe uma autoridade feita de tempo, presença e respeito.',
   array['Liderança','Comunicação','Cultura organizacional'], 'Não-ficção', 'Portugal',
   'Líderes, gestores e quem trabalha com pessoas.', '978-989-0000-01-2', 224, 'Ambos',
   'https://example.com/comprar/o-peso-do-silencio',
   '[{"texto":"Um livro que se lê devagar e fica.","autor":"Revista Permanência"}]'::jsonb,
   array['territorios-da-memoria','o-tempo-e-a-atencao'], true, 'published'),
  ('territorios-da-memoria', 'Territórios da Memória', null,
   (select id from public.authors where slug='joao-carvalho'),
   'Histórias que atravessam gerações e oceanos, recompondo identidades dispersas pela língua portuguesa.',
   E'Territórios da Memória é um mosaico de vozes recolhidas ao longo de uma década. João Carvalho cruza arquivo e história oral para devolver às comunidades lusófonas o direito de contarem a sua própria história.',
   array['Memória','Identidade','Lusofonia'], 'Não-ficção', 'Brasil',
   'Leitores de história, memória e identidade.', '978-989-0000-02-9', 312, 'Físico',
   'https://example.com/comprar/territorios-da-memoria',
   '[{"texto":"Uma obra de restituição e de beleza.","autor":"Suplemento Cultural"}]'::jsonb,
   array['o-peso-do-silencio'], true, 'published'),
  ('a-sala-e-o-mundo', 'A Sala e o Mundo', 'Educar para a autoridade',
   (select id from public.authors where slug='ana-do-rosario'),
   'Do quadro de giz ao palco internacional: como a educação forma vozes que o mundo precisa de ouvir.',
   E'A Sala e o Mundo é um manifesto sereno sobre o poder transformador da educação. Ana do Rosário parte da sala de aula para chegar às grandes decisões de política pública.',
   array['Educação','Políticas públicas','Futuro'], 'Não-ficção', 'Angola',
   'Educadores, decisores e famílias.', '978-989-0000-03-6', 268, 'Ambos',
   'https://example.com/comprar/a-sala-e-o-mundo',
   '[{"texto":"Leitura obrigatória para quem pensa o futuro.","autor":"Cimeira da Educação Lusófona"}]'::jsonb,
   array['o-tempo-e-a-atencao'], true, 'published'),
  ('o-tempo-e-a-atencao', 'O Tempo e a Atenção', 'Ensaios contra a pressa',
   (select id from public.authors where slug='rui-tavares-mendes'),
   'Um elogio do pensar devagar numa época que confunde velocidade com profundidade.',
   E'O Tempo e a Atenção reúne ensaios sobre o bem mais escasso do nosso tempo: a atenção. Rui Tavares Mendes argumenta, com vagar, que pensar devagar é um ato de resistência.',
   array['Filosofia','Sociedade','Atenção'], 'Ensaio', 'Portugal',
   'Leitores de ensaio e ideias.', '978-989-0000-04-3', 196, 'Físico',
   'https://example.com/comprar/o-tempo-e-a-atencao',
   '[{"texto":"Prosa limpa e pensamento fundo.","autor":"Jornal das Ideias"}]'::jsonb,
   array['o-peso-do-silencio'], false, 'published')
on conflict (slug) do nothing;

-- Artigos ------------------------------------------------------------------
insert into public.blog_posts (slug, titulo, resumo, categoria_id, autor_nome, corpo, published_at, status)
values
  ('porque-publicar-e-um-ato-de-autoridade', 'Porque publicar é um ato de autoridade',
   'Publicar não é o fim de um processo — é o início de um posicionamento.',
   (select id from public.taxonomies where slug='posicionamento-de-autoridade'),
   'Ponto de Vista Editora',
   E'Há uma diferença entre escrever um livro e tornar-se uma referência. O livro é o objeto; a autoridade é o que ele constrói ao longo do tempo.\n\nNa Ponto de Vista, tratamos a publicação como o primeiro passo de um posicionamento mais amplo.',
   '2026-05-20T09:00:00Z', 'published'),
  ('a-arte-de-comecar-a-escrever', 'A arte de começar a escrever',
   'O primeiro parágrafo é sempre o mais difícil.',
   (select id from public.taxonomies where slug='escrita'),
   'Maria Fernandes',
   E'A página em branco intimida porque a confundimos com a obra inteira. Mas escrever é, antes de tudo, começar.\n\nEscreva o pior primeiro parágrafo possível. Depois melhore-o.',
   '2026-04-12T09:00:00Z', 'published'),
  ('o-mercado-editorial-de-lingua-portuguesa', 'O mercado editorial de língua portuguesa',
   'Três continentes, uma língua.',
   (select id from public.taxonomies where slug='mercado-editorial'),
   'Ponto de Vista Editora',
   E'A língua portuguesa é uma das mais faladas do mundo, distribuída por vários mercados com dinâmicas próprias.\n\nPublicar em português é, hoje, uma oportunidade internacional.',
   '2026-03-03T09:00:00Z', 'published'),
  ('lancamento-o-peso-do-silencio', 'Lançamento: O Peso do Silêncio',
   'O novo livro de Maria Fernandes chega às livrarias.',
   (select id from public.taxonomies where slug='lancamentos'),
   'Ponto de Vista Editora',
   E'É com orgulho que anunciamos o lançamento de O Peso do Silêncio, de Maria Fernandes.\n\nUm livro que propõe uma liderança feita de escuta.',
   '2026-02-10T09:00:00Z', 'published'),
  ('bastidores-de-uma-capa', 'Bastidores de uma capa',
   'Como nasce a capa de um livro na Ponto de Vista.',
   (select id from public.taxonomies where slug='bastidores'),
   'Ponto de Vista Editora',
   E'Uma capa não decora um livro: posiciona-o. Cada escolha comunica autoridade antes da primeira página.',
   '2026-01-18T09:00:00Z', 'published'),
  ('a-historia-de-joao-carvalho', 'A história de João Carvalho',
   'Do arquivo ao livro: o percurso de um autor.',
   (select id from public.taxonomies where slug='historias-de-autores'),
   'Ponto de Vista Editora',
   E'Conhecemos João Carvalho quando ele procurava editora para um projeto improvável.\n\nHoje, Territórios da Memória é um dos nossos livros mais queridos.',
   '2025-12-05T09:00:00Z', 'published')
on conflict (slug) do nothing;
