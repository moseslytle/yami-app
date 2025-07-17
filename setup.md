# Setup DB

## MacOS
```bash
## install cloudflared first
brew install cloudflared
## install postgresql client first, 
brew install libpq
## handle a local listener connect to remote DB
cloudflared access tcp --hostname db-rubynofails.linusx.dev --url localhost:5432
## set where you pg_config is
bundle config build.pg --with-pg-config="$(brew --prefix)/opt/libpq/bin/pg_config"
## try bundle install again
bundle install
```

create a environment file .env

```dotenv
DATABASE_HOST=localhost
DATABASE_USERNAME=rails_user
DATABASE_PASSWORD=our_password
DATABASE_PORT=5432
```