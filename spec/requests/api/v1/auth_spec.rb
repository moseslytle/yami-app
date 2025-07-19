require 'swagger_helper'

RSpec.describe 'api/v1/auth', type: :request do

  
  # Auth endpoints
  path '/api/v1/auth/register' do
    post('register user') do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user_data, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              name: { type: :string, description: 'User name' },
              email: { type: :string, description: 'User email' },
              password: { type: :string, description: 'User password' }
            },
            required: ['name', 'email', 'password']
          }
        },
        required: ['user']
      }

      response(201, 'user registered') do
        let(:user_data) { 
          { 
            user: { 
              name: 'aa', 
              email: 'a@p-p.men', 
              password: 'a@p-p.men' 
            } 
          } 
        }
        run_test!
      end

      response(422, 'unprocessable entity') do
        let(:user_data) { { user: { name: '', email: '', password: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/login' do
    post('login user') do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, description: 'User email' },
          password: { type: :string, description: 'User password' }
        },
        required: ['email', 'password']
      }

      response(200, 'login successful') do
        schema type: :object,
               properties: {
                 token: { type: :string, description: 'JWT token' },
                 user: { type: :object }
               }

        let(:credentials) { { email: 'a@p-p.men', password: 'a@p-p.men' } }
        run_test!
      end

      response(401, 'unauthorized') do
        let(:credentials) { { email: 'wrong@email.com', password: 'wrongpass' } }
        run_test!
      end
    end
  end
end
