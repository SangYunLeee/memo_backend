# memo_backend

## 개발 환경 실행 방법

### 1. DB + Backend 모두 Docker로 실행
```bash
docker compose up
```

### 2. DB는 Docker로, Backend는 로컬에서 실행

#### DB 실행
```bash
cd ./docker-compose/db
docker compose up
```

#### Backend 실행
```bash
yarn start:dev
```

## Database 마이그레이션 (DBmate)
데이터베이스 마이그레이션을 위해 [DBmate](https://github.com/amacneil/dbmate)를 사용합니다.

```bash
# 마이그레이션 롤백
dbmate --env-file .env.local down

# 마이그레이션 실행
dbmate --env-file .env.local up
```


## PATH List
```bash
# POSTMAN
https://interstellar-meteor-533643.postman.co/workspace/TEST~349b54f3-0717-4aa6-854d-b4bd86088ecb/collection/4514456-3f466365-40c2-4ab3-9229-921fb00645c3?action=share&creator=4514456
```
