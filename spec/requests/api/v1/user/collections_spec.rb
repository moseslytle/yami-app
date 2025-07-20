require 'swagger_helper'

RSpec.describe 'user collections', type: :request do
  let!(:user) { create(:user) }
  let(:valid_jwt_token) do
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  # User collections endpoints (require authentication)
  path '/api/v1/user/collections' do
    post('create collection') do
      tags 'User Collections'
      consumes 'application/json'
      produces 'application/json'
      security [ { Bearer: [] } ]

      parameter name: :collection_data, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, description: 'Collection title', example: 'test' },
          description: { type: :string, description: 'Collection description', example: 'test' },
          is_public: { type: :boolean, description: 'Whether the collection is public' }
        },
        required: [ 'title' ]
      }

      response(201, 'collection created') do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 user_id: { type: :integer },
                 title: { type: :string },
                 description: { type: :string },
                 is_public: { type: :boolean },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               }

        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:collection_data) { { title: 'test', description: 'test' } }

        run_test! do |response|
          expect(response).to have_http_status(:created)
        end
      end
    end
  end

  path '/api/v1/user/collections/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    patch('update collection') do
      tags 'User Collections'
      consumes 'application/json'
      produces 'application/json'
      security [ { Bearer: [] } ]

      parameter name: :collection_data, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, description: 'Collection title', example: 'test-change' },
          description: { type: :string, description: 'Collection description' },
          is_public: { type: :boolean, description: 'Whether the collection is public' }
        }
      }

      response(200, 'collection updated') do
        let!(:collection) { create(:collection, user: user) }

        schema type: :object,
               properties: {
                 id: { type: :integer },
                 user_id: { type: :integer },
                 title: { type: :string },
                 description: { type: :string },
                 is_public: { type: :boolean },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               }

        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }
        let(:collection_data) { { title: 'test-change' } }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        let(:collection_data) { { title: 'Updated Collection' } }
        run_test!
      end
    end

    delete('delete collection') do
      tags 'User Collections'
      produces 'application/json'
      security [ { Bearer: [] } ]

      response(204, 'collection deleted') do
        let!(:collection) { create(:collection, user: user) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }

        run_test! do |response|
          expect(response).to have_http_status(:no_content)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        run_test!
      end
    end
  end

  path '/api/v1/user/collections/{id}/publish' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    put('publish collection') do
      tags 'User Collections'
      produces 'application/json'
      security [ { Bearer: [] } ]

      response(200, 'collection published') do
        let!(:collection) { create(:collection, user: user) }

        schema type: :object,
               properties: {
                 id: { type: :integer },
                 user_id: { type: :integer },
                 title: { type: :string },
                 description: { type: :string },
                 is_public: { type: :boolean },
                 published: { type: :boolean },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               }

        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        run_test!
      end
    end
  end
end
