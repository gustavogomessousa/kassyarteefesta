# Kassy Arte & Festa

Página em HTML, CSS e JavaScript, recriada a partir da referência visual fornecida. Abra `index.html` no navegador.

- `index.html`: estrutura e textos da referência.
- `style.css`: cores, tipografia, composição e adaptação para celulares.
- `content.js`: contato e fotografias do portfólio.
- `script.js`: menu móvel, carrossel, ampliação de fotos, WhatsApp e feed.
- `assets/`: imagens utilizadas. Os arquivos originais em `imagens/` foram preservados.
- `imagens/desktop.png` e `imagens/mobile.png`: artes da Hero, selecionadas automaticamente conforme a largura da tela.

As fotografias são os originais disponíveis no projeto. Seus enquadramentos e a iluminação diferem da montagem apresentada na referência. As fontes usam Google Fonts com alternativas locais.

Os botões de orçamento abrem o WhatsApp (49) 98811-2222. Os links do Instagram abrem @kassyarteefesta. O carrossel avança automaticamente a cada 4,5 segundos enquanto está visível, com pausa durante a interação e para quem prefere movimento reduzido. Também aceita botões, teclado e deslize; as fotos abrem em uma janela que pode ser fechada com Escape.

## Instagram

A grade mostra seis fotos locais. Em hospedagem compatível com Cloudflare Pages Functions, `/api/instagram` pode atualizar essas imagens. A função existente em `functions/api/instagram.js` exige os segredos `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` e `INSTAGRAM_API_VERSION`. Sem configuração, as fotos locais continuam visíveis. Nunca coloque tokens nos arquivos do navegador.

## Verificação

Execute `node verify.mjs` para verificar referências locais e o comportamento da função do Instagram. Execute `node --check script.js` para conferir a sintaxe JavaScript. A renderização visual e as interações ainda precisam ser conferidas no navegador e em um celular real.

## Hospedagem

Para uma hospedagem estática, envie `index.html`, `style.css`, `content.js`, `script.js` e `assets/`. O feed autenticado exige hospedagem que execute a função de servidor; o restante funciona sem compilação.
