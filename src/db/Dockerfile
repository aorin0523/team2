# MySQL 8.0をベースイメージとして使用
FROM mysql:8.0

# 作成者情報
LABEL maintainer="HAL Team2"
LABEL description="MySQL Database with UTF8MB4 support and Japanese locale"

# 環境変数の設定
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=mydb
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# タイムゾーンを日本時間に設定
ENV TZ=Asia/Tokyo

# MySQLの設定ファイルをコピー
COPY config/my.cnf /etc/mysql/conf.d/

# 初期化SQLスクリプトをコピー
COPY init/ /docker-entrypoint-initdb.d/

# MySQL用のデータディレクトリを作成
RUN mkdir -p /var/lib/mysql && \
    chown -R mysql:mysql /var/lib/mysql

# MySQLの文字セット設定を確実にするためのカスタムコマンド
CMD ["mysqld", \
     "--character-set-server=utf8mb4", \
     "--collation-server=utf8mb4_unicode_ci", \
     "--default-time-zone=+09:00", \
     "--innodb_use_native_aio=0"]

# ポート3306を公開
EXPOSE 3306

# ヘルスチェックを追加
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1