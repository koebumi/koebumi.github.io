# koebumi.github.io

[Koebumi](https://github.com/koebumi/koebumi) の Web サイトです。https://koebumi.github.io で公開しています。

- `index.html`: サイト本体（1 ファイル。外部のライブラリは使わない）。`?still` を付けて開くと、動きを止めた完成形を表示する（動きを減らす設定のときも同じ）
- `privacy.html`: プライバシーポリシー
- `404.html`: 見つからないページ（GitHub Pages がどの URL でも出すので、ファイルはサイトの根からのパスで書く）
- `assets/`: アイコン、紹介動画、動画の最初の画面、リンクのプレビュー画像
- `promo/`: 紹介動画とプレビュー画像を作るためのソース。`npm install` のあと、`node render.mjs --page pr2.html --fps 60 --out koebumi-pr-silent.mp4` で動画を、`node og.mjs` でプレビュー画像を書き出す
