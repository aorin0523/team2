SET NAMES 'utf8mb4';

CREATE TABLE `Ranks` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `Skills` (
	`id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `Users` (
	`id` CHAR(36) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`rank` INTEGER NOT NULL DEFAULT 1,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
  `enterprise_id` CHAR(36) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `Enterprises` (
	`id` CHAR(36) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`description` TEXT(65535),
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `Offers` (
	`id` CHAR(36) NOT NULL UNIQUE,
	`enterprise_id` CHAR(36) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`content` TEXT(65535) NOT NULL,
	`rank` INTEGER NOT NULL,
	`salary` VARCHAR(64),
	`capacity` INTEGER,
	`deadline` TIMESTAMP,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `UserSkills` (
	`user_id` CHAR(36) NOT NULL,
	`skill_id` INTEGER NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`user_id`, `skill_id`)
);


CREATE TABLE `UserOffers` (
	`user_id` CHAR(36) NOT NULL,
	`offer_id` CHAR(36) NOT NULL,
	`favorite` BOOLEAN,
	`wish` BOOLEAN,
	`assign` BOOLEAN,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`user_id`, `offer_id`)
);


CREATE TABLE `OfferSkills` (
	`offer_id` CHAR(36) NOT NULL,
	`skill_id` INTEGER NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	`deleted_at` TIMESTAMP,
	PRIMARY KEY(`offer_id`, `skill_id`)
);

CREATE TABLE `Notifications` (
	`id` CHAR(36) NOT NULL UNIQUE,
	`user_id` CHAR(36) NOT NULL,
	`type` VARCHAR(50) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`message` TEXT NOT NULL,
	`offer_id` CHAR(36) NULL,
	`enterprise_name` VARCHAR(255) NULL,
	`is_read` BOOLEAN DEFAULT FALSE,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);

ALTER TABLE `Users`
ADD FOREIGN KEY(`enterprise_id`) REFERENCES `Enterprises`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `UserSkills`
ADD FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `UserSkills`
ADD FOREIGN KEY(`skill_id`) REFERENCES `Skills`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `Offers`
ADD FOREIGN KEY(`enterprise_id`) REFERENCES `Enterprises`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `UserOffers`
ADD FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `UserOffers`
ADD FOREIGN KEY(`offer_id`) REFERENCES `Offers`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `OfferSkills`
ADD FOREIGN KEY(`offer_id`) REFERENCES `Offers`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `OfferSkills`
ADD FOREIGN KEY(`skill_id`) REFERENCES `Skills`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `Users`
ADD FOREIGN KEY(`rank`) REFERENCES `Ranks`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `Offers`
ADD FOREIGN KEY(`rank`) REFERENCES `Ranks`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `Notifications`
ADD FOREIGN KEY(`user_id`) REFERENCES `Users`(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE `Notifications`
ADD FOREIGN KEY(`offer_id`) REFERENCES `Offers`(`id`)
ON UPDATE CASCADE ON DELETE SET NULL;



INSERT INTO Ranks (name) VALUES ('D'), ('C'), ('B'), ('A'), ('S');
INSERT INTO Skills (name) VALUES
('JavaScript'),
('Python'),
('Java'),
('C#'),
('Ruby'),
('PHP'),
('Swift'),
('Kotlin'),
('TypeScript'),
('Go');

INSERT INTO Users (id, name, email, password) VALUES
('00000000-0000-0000-0000-000000000000', 'TestUser', 'sample@example.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2');

INSERT INTO Enterprises (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Tech Corp', '先端技術に特化したスタートアップ企業'),
('22222222-2222-2222-2222-222222222222', 'Finance Inc', 'フィンテックサービスを提供する企業'),
('33333333-3333-3333-3333-333333333333', 'Entertainment LLC','ゲームとマルチメディアコンテンツ開発企業'),
('44444444-4444-4444-4444-444444444444', 'Health Solutions', 'メディカルテックと遠隔医療プラットフォームを提供'),
('55555555-5555-5555-5555-555555555555', 'Edu Future', '次世代オンライン学習サービスを開発'),
('66666666-6666-6666-6666-666666666666', 'Auto AI Ltd', '自動運転と車載 AI システムを研究・開発'),
('77777777-7777-7777-7777-777777777777', 'Green Energy Co', '再生可能エネルギーとスマートグリッド事業を展開'),
('88888888-8888-8888-8888-888888888888', 'Cyber Security Works', '企業向けサイバーセキュリティソリューションを提供');

-- 企業ユーザーのテストデータ（パスワードは全て "secretPassword"）
INSERT INTO Users (id, name, email, password, enterprise_id, `rank`) VALUES
('e0000000-0000-0000-0000-000000000001', 'Tech Corp Manager', 'manager@techcorp.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '11111111-1111-1111-1111-111111111111', 3),
('e0000000-0000-0000-0000-000000000002', 'Finance Inc HR', 'hr@finance.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '22222222-2222-2222-2222-222222222222', 2),
('e0000000-0000-0000-0000-000000000003', 'Game Company Lead', 'lead@entertainment.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '33333333-3333-3333-3333-333333333333', 4),
('e0000000-0000-0000-0000-000000000004', 'Health Tech Admin', 'admin@healthsolutions.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '44444444-4444-4444-4444-444444444444', 5);


INSERT INTO Offers (id, enterprise_id, title, content, `rank`, salary, capacity, deadline) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
  'バックエンドエンジニア',
  'Go と Docker を用いたマイクロサービス開発',
  3, '500万円〜700万円', 2,
  '2025-12-31 23:59:59'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111',
  'フロントエンドエンジニア',
  'React／Remix による UI 構築',
  4, '550万円〜750万円', 3,
  '2025-09-30 23:59:59'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222',
  'データアナリスト',
  'Python と SQL を用いたデータ分析',
  3, '480万円〜650万円', 1,
  '2025-10-31 23:59:59'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333',
  'ゲームプログラマ',
  'Unity／C# によるゲーム開発',
  2, '400万円〜550万円', 5,
  '2025-08-15 23:59:59'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333',
  'シニアゲームエンジニア',
  'Unreal Engine で次世代 AAA タイトルを開発',
  5, '800万円〜1200万円', 1,
  '2026-01-31 23:59:59'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111',
  'DevOpsエンジニア（Junior）',
  'Kubernetes と CI/CD パイプラインの構築・運用',
  2, '350万円〜500万円', 2,
  '2025-11-30 23:59:59'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222',
  'バックエンドエンジニア（FinTech）',
  'Go と gRPC を用いた決済基盤開発',
  3, '520万円〜720万円', 3,
  '2025-09-15 23:59:59'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222',
  'データエンジニア',
  'Python／Airflow でのデータパイプライン構築',
  4, '600万円〜800万円', 2,
  '2025-12-15 23:59:59'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '33333333-3333-3333-3333-333333333333',
  '3D アーティスト',
  'モデリングとシェーダー開発',
  2, '380万円〜520万円', 4,
  '2025-08-31 23:59:59'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '33333333-3333-3333-3333-333333333333',
  'モバイルゲーム開発エンジニア',
  'Unity／C# でのモバイルタイトル開発',
  3, '450万円〜600万円', 3,
  '2025-10-20 23:59:59'),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '44444444-4444-4444-4444-444444444444',
  'フルスタック開発者',
  'React と Go で遠隔医療プラットフォームを実装',
  3, '500万円〜680万円', 2,
  '2025-11-10 23:59:59'),
('llllllll-llll-llll-llll-llllllllllll', '44444444-4444-4444-4444-444444444444',
  'AI リサーチャー',
  '医療データ解析アルゴリズムの研究開発',
  5, '900万円〜1400万円', 1,
  '2026-02-28 23:59:59'),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '44444444-4444-4444-4444-444444444444',
  'DevOps エンジニア',
  'AWS／Terraform を用いたクラウド基盤整備',
  4, '580万円〜780万円', 2,
  '2025-12-31 23:59:59'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '55555555-5555-5555-5555-555555555555',
  'ラーニングプラットフォームエンジニア',
  'Next.js と GraphQL で教育プラットフォーム開発',
  2, '400万円〜530万円', 4,
  '2025-09-30 23:59:59'),
('oooooooo-oooo-oooo-oooo-oooooooooooo', '55555555-5555-5555-5555-555555555555',
  'カリキュラムデザイナー',
  'IT カリキュラムの設計と教材作成',
  1, '320万円〜450万円', 3,
  '2025-08-31 23:59:59'),
('pppppppp-pppp-pppp-pppp-pppppppppppp', '55555555-5555-5555-5555-555555555555',
  'バックエンド API デベロッパー',
  'Go／PostgreSQL で RESTful API を構築',
  3, '470万円〜620万円', 2,
  '2025-11-30 23:59:59'),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '66666666-6666-6666-6666-666666666666',
  '組み込みシステムエンジニア',
  'リアルタイム OS 上での C++ 開発',
  3, '480万円〜640万円', 3,
  '2025-10-31 23:59:59'),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '66666666-6666-6666-6666-666666666666',
  '自動運転エンジニア',
  'Computer Vision と Sensor Fusion の開発',
  5, '850万円〜1300万円', 1,
  '2026-03-31 23:59:59'),
('ssssssss-ssss-ssss-ssss-ssssssssssss', '66666666-6666-6666-6666-666666666666',
  'MLOps エンジニア',
  'モデルデプロイとパフォーマンス監視基盤構築',
  4, '650万円〜850万円', 2,
  '2025-12-15 23:59:59'),
('tttttttt-tttt-tttt-tttt-tttttttttttt', '77777777-7777-7777-7777-777777777777',
  '再生可能エネルギーアナリスト',
  '電力需要予測モデルの構築',
  3, '460万円〜610万円', 2,
  '2025-09-30 23:59:59'),
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', '77777777-7777-7777-7777-777777777777',
  'IoT エンジニア',
  'スマートグリッド向け IoT デバイス開発',
  2, '390万円〜520万円', 3,
  '2025-10-31 23:59:59'),
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', '88888888-8888-8888-8888-888888888888',
  'セキュリティアナリスト',
  'SOC 運用と脅威インテリジェンス分析',
  3, '500万円〜680万円', 2,
  '2025-08-31 23:59:59'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '88888888-8888-8888-8888-888888888888',
  'ペネトレーションテスター',
  '侵入テスト計画と実施',
  4, '600万円〜820万円', 1,
  '2025-11-30 23:59:59'),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '88888888-8888-8888-8888-888888888888',
  'インシデントレスポンスエンジニア',
  'サイバー攻撃対応とフォレンジック',
  5, '750万円〜1100万円', 1,
  '2026-01-31 23:59:59');

-- Notifications テーブルへのサンプルデータ挿入
INSERT INTO Notifications (id, user_id, type, title, message, offer_id, enterprise_name, is_read, created_at) VALUES
('n0000001-0001-0001-0001-000000000001', '00000000-0000-0000-0000-000000000000', 'assignment', 'バックエンドエンジニア', 'あなたがこのプロジェクトにアサインされました', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tech Corp', FALSE, '2025-07-15 10:30:00'),
('n0000001-0001-0001-0001-000000000002', '00000000-0000-0000-0000-000000000000', 'assignment', 'フロントエンドエンジニア', 'あなたがこのプロジェクトにアサインされました', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tech Corp', TRUE, '2025-07-14 15:45:00'),
('n0000001-0001-0001-0001-000000000003', '00000000-0000-0000-0000-000000000000', 'assignment', 'データアナリスト', 'あなたがこのプロジェクトにアサインされました', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Finance Inc', TRUE, '2025-07-13 09:15:00'),
('n0000001-0001-0001-0001-000000000004', '00000000-0000-0000-0000-000000000000', 'application_update', 'ゲームプログラマ', '応募状況が更新されました', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Entertainment LLC', FALSE, '2025-07-12 16:20:00');