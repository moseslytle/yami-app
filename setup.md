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

# Setup SWAG doc

1. update your rspec file, eg spec/requests/api/v1/collections_spec.rb
2. run `rake rswag:specs:swaggerize` update SWAG

if want to generate new controller doc
`rails generate rspec:swagger Api::V1::User::CollectionsController`

detail ref [rswag](https://github.com/rswag/rswag)