#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO "$POSTGRES_USER";
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TYPE user_status_enum AS ENUM ('online', 'offline');
    DROP TABLE IF EXISTS public."user";
    CREATE TABLE public."user" (
        "index" serial NOT NULL,
        username varchar(30) NOT NULL,
        nickname varchar(30) NOT NULL,
        email varchar(150) NOT NULL,
        avatar text NOT NULL,
        score int4 NOT NULL DEFAULT 0,
        victory int4 NOT NULL DEFAULT 0,
        defeat int4 NOT NULL DEFAULT 0,
        status user_status_enum NOT NULL DEFAULT 'online'::user_status_enum,
        created_at timestamp NOT NULL DEFAULT now(),
        "useTwoFA" bool NOT NULL DEFAULT false,
        "TwoFAToken" text NULL,
        CONSTRAINT "PK_40597d77135a83517ca343d15e2" PRIMARY KEY (index),
        CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username),
        CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE (nickname)
    );

    DROP TABLE IF EXISTS public.block;
    CREATE TABLE public.block (
        blocker int4 NOT NULL,
        "blocked" int4 NOT NULL,
        CONSTRAINT "PK_d17f2d097f7a4cc47629bf6262e" PRIMARY KEY (blocker, blocked)
    );
    CREATE INDEX "IDX_0f4b89aa27e1e12b4f1b7961be" ON public.block USING btree (blocker);
    CREATE INDEX "IDX_ca72a6cf39f4aea5dd7e9ab880" ON public.block USING btree (blocked);
    ALTER TABLE public.block ADD CONSTRAINT "FK_0f4b89aa27e1e12b4f1b7961be2" FOREIGN KEY (blocker) REFERENCES public."user"("index") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE public.block ADD CONSTRAINT "FK_ca72a6cf39f4aea5dd7e9ab8800" FOREIGN KEY ("blocked") REFERENCES public."user"("index") ON DELETE CASCADE;

    DROP TABLE IF EXISTS public.follow;
    CREATE TABLE public.follow (
        follower int4 NOT NULL,
        followed int4 NOT NULL,
        CONSTRAINT "PK_cd6a8fbef1fa2c2085c6490e241" PRIMARY KEY (follower, followed)
    );
    CREATE INDEX "IDX_903c67798aca5869c297418838" ON public.follow (follower int4_ops);
    CREATE INDEX "IDX_9d5de999c4de1c98c6cc5f4fda" ON public.follow USING btree (followed);
    ALTER TABLE public.follow ADD CONSTRAINT "FK_903c67798aca5869c297418838b" FOREIGN KEY (follower) REFERENCES public."user"("index") ON DELETE CASCADE ON UPDATE CASCADE;
    ALTER TABLE public.follow ADD CONSTRAINT "FK_9d5de999c4de1c98c6cc5f4fdae" FOREIGN KEY (followed) REFERENCES public."user"("index");

    INSERT INTO public."user" (username,nickname,email,avatar,score,victory,defeat,status,created_at,use_twofa,twofa_token) VALUES
	 ('sunpark','sunpark','sunpark@student.42seoul.kr','http://cdn.intra.42.fr/users/sunpark.jpg',0,0,0,'online','2021-08-25 06:17:00.908028',false,NULL),
	 ('amin','amin','amin@student.42seoul.kr','http://cdn.intra.42.fr/users/amin.jpg',0,0,0,'online','2021-08-25 06:17:00.908778',false,NULL),
	 ('dsohn','dsohn','dsohn@student.42seoul.kr','http://cdn.intra.42.fr/users/dsohn.jpg',0,0,0,'online','2021-08-25 06:17:00.909696',false,NULL),
	 ('jachoi','jachoi','jachoi@student.42seoul.kr','http://cdn.intra.42.fr/users/jachoi.jpg',0,0,0,'online','2021-08-25 06:17:00.910901',false,NULL),



EOSQL

