-- 启用 uuid-ossp 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    nickname VARCHAR(50) NOT NULL,
    avatar TEXT DEFAULT 'default.svg',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    birthday DATE CHECK (birthday > '1900-01-01'),
    location VARCHAR(100),
    posts UUID[]
) WITH (autovacuum_enabled = true);

-- 创建 posts 表，使用 UUID 类型和 TIMESTAMPTZ 类型
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0 CHECK (views >= 0),
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(30),
    tags TEXT[],
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL
) PARTITION BY RANGE (created_at);

-- 在分区函数中添加错误处理
CREATE OR REPLACE FUNCTION create_post_partition()
RETURNS TRIGGER AS $$
BEGIN
    DECLARE
        partition_name TEXT;
    partition_name := format('posts_%s', to_char(NEW.created_at, 'YYYY_MM'));
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = partition_name) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF posts FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            date_trunc('month', NEW.created_at),
            date_trunc('month', NEW.created_at) + INTERVAL '1 month'
        );
    END IF;
    EXCEPTION
        WHEN duplicate_table THEN
            RAISE NOTICE 'Partition % already exists', partition_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 添加 phone 字段验证
ALTER TABLE users
ADD CONSTRAINT valid_phone 
CHECK (phone ~ '^\+?[1-9]\d{1,14}$'); 

-- 添加邮箱格式验证约束
ALTER TABLE users 
ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 添加软删除标记列
ALTER TABLE users
ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- 创建 users 表的 email 索引
CREATE INDEX idx_users_email ON users(email);

-- 创建软删除用户的索引
CREATE INDEX idx_users_deleted ON users(is_deleted) WHERE is_deleted = TRUE;

-- 创建默认分区
CREATE TABLE posts_default PARTITION OF posts DEFAULT;

-- 索引优化
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts USING BRIN (created_at);

-- 创建分区函数
CREATE OR REPLACE FUNCTION create_post_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_name TEXT;
BEGIN
    partition_name := format('posts_%s', to_char(NEW.created_at, 'YYYY_MM'));
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = partition_name) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF posts FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            date_trunc('month', NEW.created_at),
            date_trunc('month', NEW.created_at) + INTERVAL '1 month'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新时间触发器函数
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建分区触发器
CREATE TRIGGER trg_create_post_partition
BEFORE INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION create_post_partition();

-- 创建更新时间触发器
CREATE TRIGGER update_posts_modtime 
BEFORE UPDATE ON posts 
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 创建历史归档表
CREATE TABLE posts_archive (LIKE posts INCLUDING ALL) PARTITION BY RANGE (created_at);

