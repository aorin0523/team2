SET NAMES 'utf8mb4';
SET GLOBAL time_zone = 'Asia/Tokyo';

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
('88888888-8888-8888-8888-888888888888', 'Cyber Security Works', '企業向けサイバーセキュリティソリューションを提供'),
('99999999-9999-9999-9999-999999999999', 'Cloud Solutions Japan', 'クラウドインフラとDevOpsサービスを提供'),
('aaaaaaaa-1111-2222-3333-444444444444', 'AI Research Lab', '機械学習と自然言語処理の研究開発'),
('bbbbbbbb-1111-2222-3333-444444444444', 'Mobile First Inc', 'モバイルアプリケーション開発とUX/UIデザイン'),
('cccccccc-1111-2222-3333-444444444444', 'Data Analytics Pro', 'ビッグデータ解析とビジネスインテリジェンス'),
('dddddddd-1111-2222-3333-444444444444', 'IoT Systems Ltd', 'IoTデバイスとスマートシティソリューション'),
('eeeeeeee-1111-2222-3333-444444444444', 'Blockchain Innovations', 'ブロックチェーン技術とWeb3プラットフォーム'),
('ffffffff-1111-2222-3333-444444444444', 'VR/AR Studio', 'バーチャル・拡張現実コンテンツ制作'),
('12345678-1111-2222-3333-444444444444', 'E-commerce Platform', 'オンライン販売プラットフォームとマーケットプレイス'),
('23456789-1111-2222-3333-444444444444', 'SaaS Solutions', 'ビジネス向けSaaSアプリケーション開発'),
('34567890-1111-2222-3333-444444444444', 'Digital Marketing Hub', 'デジタルマーケティングとSEO最適化サービス'),
('45678901-1111-2222-3333-444444444444', 'Food Tech Company', 'フードテックとデリバリーアプリ開発'),
('56789012-1111-2222-3333-444444444444', 'Travel Tech Solutions', '旅行業界向けテクノロジーソリューション'),
('67890123-1111-2222-3333-444444444444', 'Quantum Computing Corp', '量子コンピューティング技術とアルゴリズム開発'),
('78901234-1111-2222-3333-444444444444', 'Space Technology Lab', '宇宙技術と衛星通信システム開発'),
('89012345-1111-2222-3333-444444444444', 'Robotics Engineering', 'ロボティクスと自動化システム製造'),
('90123456-1111-2222-3333-444444444444', 'Legal Tech Solutions', 'リーガルテックとコンプライアンス管理'),
('01234567-1111-2222-3333-444444444444', 'Agriculture Innovation', 'アグリテックとスマート農業システム'),
('12346789-1111-2222-3333-444444444444', 'Real Estate Platform', '不動産テックとプロパティマネジメント'),
('23457890-1111-2222-3333-444444444444', 'Sports Analytics Inc', 'スポーツデータ分析とパフォーマンス最適化'),
('34568901-1111-2222-3333-444444444444', 'Music & Audio Tech', '音楽配信とオーディオ技術開発'),
('45679012-1111-2222-3333-444444444444', 'Environmental Monitoring', '環境モニタリングとサステナビリティソリューション'),
('56780123-1111-2222-3333-444444444444', 'Fashion Tech Studio', 'ファッションテックとバーチャル試着システム');

-- 企業ユーザーのテストデータ（パスワードは全て "secretPassword"）
INSERT INTO Users (id, name, email, password, enterprise_id, `rank`) VALUES
('e0000000-0000-0000-0000-000000000001', 'Tech Corp Manager', 'manager@techcorp.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '11111111-1111-1111-1111-111111111111', 3),
('e0000000-0000-0000-0000-000000000002', 'Finance Inc HR', 'hr@finance.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '22222222-2222-2222-2222-222222222222', 2),
('e0000000-0000-0000-0000-000000000003', 'Game Company Lead', 'lead@entertainment.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '33333333-3333-3333-3333-333333333333', 4),
('e0000000-0000-0000-0000-000000000004', 'Health Tech Admin', 'admin@healthsolutions.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '44444444-4444-4444-4444-444444444444', 5),
('e0000000-0000-0000-0000-000000000005', 'Cloud Solutions Manager', 'manager@cloudsolutions.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', '99999999-9999-9999-9999-999999999999', 4),
('e0000000-0000-0000-0000-000000000006', 'AI Research Director', 'director@airesearch.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', 'aaaaaaaa-1111-2222-3333-444444444444', 5),
('e0000000-0000-0000-0000-000000000007', 'Mobile Team Lead', 'lead@mobilefirst.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', 'bbbbbbbb-1111-2222-3333-444444444444', 3),
('e0000000-0000-0000-0000-000000000008', 'Data Analytics PM', 'pm@dataanalytics.com', '$2b$12$8dEh8c5tfXTghBy514FKfugGaGMxjpNKRwhqkgDHhVazuALRylMm2', 'cccccccc-1111-2222-3333-444444444444', 3);

