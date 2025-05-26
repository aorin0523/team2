# gitのブランチについて

## 原則

こちらのリポジトリでは、以下のブランチ戦略を基本とします。

- mainブランチ
  - リリースするためのブランチ
  - このブランチへのpushは禁止
- developブランチ
  - mainブランチから分岐
  - 開発用のブランチ
  - このブランチへのpushは禁止
- featureブランチ
  - developブランチから分岐
  - 基本的には1つの大きい機能につき1ブランチ
  - 機能完成時にdevelopブランチにマージ
- hotfixブランチ
  - 大きなバグ(全機能に及ぶ)修正時にmainブランチから分岐
  - 機能修正後にmainブランチ、developブランチ及びfeatureブランチ(必要な場合)にマージ

## featureブランチについて

featureブランチは以下のように切り分けます。

1. issueを作成
1. [Branches](https://github.com/aorin0523/team2/branches)からNew branchを選択
1. New branch nameに"feature/issue-[IssueID]"を入力
1. Sourceからdevelopブランチを選択
1. Create new branchを押して完了

## hotfixブランチについて

hotfixブランチは、もし大きなバグを発見したときに切り分けるブランチです。  
特殊な状況でのみ切り分けられるブランチなので基本的には考えなくて大丈夫です。

では、よろしくお願いいたします。