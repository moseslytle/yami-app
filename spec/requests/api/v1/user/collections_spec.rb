# Created 07/23/2025 By Linus Xiong
# Updated 07/27/2025 By Linus Xiong - add more tests
require 'swagger_helper'

RSpec.describe 'user collections', type: :request do
  let!(:user) { create(:user) }
  let!(:other_user) { create(:user) }
  let(:valid_jwt_token) do
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  # User collections endpoints (require authentication)
  path '/api/v1/user/collections' do
    get('list user collections') do
      tags 'User Collections'
      produces 'application/json'
      security [ { Bearer: [] } ]

      response(200, 'user collections found') do
        let!(:user_collection1) { create(:collection, user: user, title: "My Collection 1") }
        let!(:user_collection2) { create(:collection, user: user, title: "My Collection 2") }
        let!(:other_user_collection) { create(:collection, user: other_user, title: "Other User Collection") }

        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   user_id: { type: :integer },
                   title: { type: :string },
                   description: { type: :string },
                   is_public: { type: :boolean },
                   created_at: { type: :string, format: :datetime },
                   updated_at: { type: :string, format: :datetime }
                 }
               }

        let(:Authorization) { "Bearer #{valid_jwt_token}" }

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response).to be_an(Array)
          expect(parsed_response.length).to eq(2) # Only user's collections
          expect(parsed_response.all? { |c| c['user_id'] == user.id }).to be true
        end
      end

      response(200, 'empty collections for new user') do
        let(:new_user) { create(:user) }
        let(:new_user_token) do
          payload = { user_id: new_user.id, exp: 24.hours.from_now.to_i }
          JWT.encode(payload, Rails.application.secret_key_base)
        end
        let(:Authorization) { "Bearer #{new_user_token}" }

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response).to be_an(Array)
          expect(parsed_response).to be_empty
        end
      end
    end

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
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['user_id']).to eq(user.id)
          expect(parsed_response['title']).to eq('test')
        end
      end

      response(201, 'collection created with public flag') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:collection_data) { { title: 'Public Test', description: 'Public Description', is_public: true } }

        run_test! do |response|
          expect(response).to have_http_status(:created)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['is_public']).to be true
        end
      end

      response(422, 'validation errors') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:collection_data) { { description: 'Missing title' } }

        run_test! do |response|
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  path '/api/v1/user/collections/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    get('show user collection') do
      tags 'User Collections'
      produces 'application/json'
      security [ { Bearer: [] } ]

      response(200, 'collection found') do
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

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['id']).to eq(collection.id)
          expect(parsed_response['user_id']).to eq(user.id)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq("Collection not found")
        end
      end

      response(401, 'unauthorized access to other user collection') do
        let!(:other_collection) { create(:collection, user: other_user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { other_collection.id }

        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq("User No permission")
        end
      end

      response(200, 'access to public collection') do
        let!(:public_collection) { create(:collection, user: other_user, is_public: true) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { public_collection.id }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['is_public']).to be true
        end
      end
    end

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
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['title']).to eq('test-change')
        end
      end

      response(200, 'collection privacy updated') do
        let!(:collection) { create(:collection, user: user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }
        let(:collection_data) { { is_public: true } }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['is_public']).to be true
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        let(:collection_data) { { title: 'Updated Collection' } }
        run_test!
      end

      response(401, 'unauthorized update') do
        let!(:other_collection) { create(:collection, user: other_user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { other_collection.id }
        let(:collection_data) { { title: 'Unauthorized Update' } }
        
        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq("User No permission")
        end
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
          expect(Collection.find_by(id: collection.id)).to be_nil
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        run_test!
      end

      response(401, 'unauthorized deletion') do
        let!(:other_collection) { create(:collection, user: other_user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { other_collection.id }
        
        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq("User No permission")
        end
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
        let!(:collection) { create(:collection, user: user, is_public: false) }

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

        run_test! do |response|
          expect(response).to have_http_status(:ok)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['is_public']).to be true
          expect(collection.reload.is_public).to be true
        end
      end

      response(200, 'already published collection') do
        let!(:collection) { create(:collection, user: user, is_public: true) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }

        run_test! do |response|
          expect(response).to have_http_status(:ok)
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['is_public']).to be true
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { 999999 }
        run_test!
      end

      response(401, 'unauthorized publish') do
        let!(:other_collection) { create(:collection, user: other_user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { other_collection.id }
        
        run_test! do |response|
          parsed_response = JSON.parse(response.body)
          expect(parsed_response['error']).to eq("User No permission")
        end
      end

      response(422, 'validation error during publish') do
        let!(:collection) { create(:collection, user: user, is_public: false) }
        let(:Authorization) { "Bearer #{valid_jwt_token}" }
        let(:id) { collection.id }

        # Mock a validation error
        before do
          allow_any_instance_of(Collection).to receive(:publish!).and_raise(
            ActiveRecord::RecordInvalid.new(collection)
          )
          allow(collection).to receive(:errors).and_return(double(full_messages: ["Test validation error"]))
        end

        run_test! do |response|
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
