# koebumi.github.io

[Koebumi](https://github.com/koebumi/koebumi) の Web サイトです。https://koebumi.github.io で公開しています。

- `index.html`: サイト本体（1 ファイル。外部のライブラリは使わない）
- `assets/`: アイコン、紹介動画、動画の最初の画面、リンクのプレビュー画像
- `promo/`: 紹介動画とプレビュー画像を作るためのソース。`npm install` のあと、`node render.mjs --page pr2.html --fps 60 --out koebumi-pr-silent.mp4` で動画を、`node og.mjs` でプレビュー画像を書き出す
