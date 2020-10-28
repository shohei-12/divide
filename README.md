![divide-logo](https://user-images.githubusercontent.com/65577006/97000105-3a633500-1571-11eb-9f9e-284ab34ede72.png)

# DIVIDE

デカルトの「困難は分割せよ」という名言を表現し、タスクを小さく小さく分割することで、より効率的なタスクの解決、困難なタスクの達成を支援する web アプリケーションです。

URL <https://divide-66b71.firebaseapp.com/>

# デモ

タスクの分割は以下のようにして行います。

![divide-demo](https://user-images.githubusercontent.com/65577006/96997264-6a5c0980-156c-11eb-88fd-d198b18236e1.gif)

# 機能一覧

- ユーザー登録・編集
- ログイン・ログアウト
- タスク関連の機能
  - 登録・表示・編集・削除
  - 分割（分割したタスクをさらに分割することも可能）
  - 期限設定
  - 完了チェック
  - 完了・未完了別表示
  - 優先度設定
  - 優先度別表示
  - ページネーション
- 各種フォームのバリデーション
- ライトモード・ダークモードの切り替え

# 使用技術一覧

- React
- Redux
- TypeScript
- Material-UI
- Firebase（Cloud Firestore, Authentication, Hosting）

# 使用方法

1. このリポジトリをクローンします。

```bash
$ git clone https://github.com/shohei-12/divide.git
```

2. カレントディレクトリを変更します。

```bash
$ cd divide
```

3. 依存パッケージをインストールします。

```bash
$ npm install
```

4. アプリケーションを起動します。

```bash
$ npm start
```

# 作成者

- 前田 翔平

# ライセンス

divide is under [MIT license](https://en.wikipedia.org/wiki/MIT_License).
