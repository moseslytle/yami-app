require 'swagger_helper'

RSpec.describe 'user collections', type: :request do

  # User collections endpoints (require authentication)
  path '/api/v1/user/collections' do
    
    post('create collection') do
      tags 'User Collections'
      consumes 'application/json'
      produces 'application/json'
      security [Bearer: []]
      
      parameter name: :Authorization, in: :header, type: :string, 
                description: 'Bearer token', 
                example: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc'
      
      parameter name: :collection_data, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, description: 'Collection title', example: 'test' },
          description: { type: :string, description: 'Collection description', example: 'test' },
          is_public: { type: :boolean, description: 'Whether the collection is public' }
        },
        required: ['title']
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

        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:collection_data) { { title: 'test', description: 'test' } }
        
        run_test! do |response|
          expect(response).to have_http_status(:created)
        end
      end

      response(422, 'unprocessable entity') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:collection_data) { { title: '' } }
        run_test!
      end

      response(401, 'unauthorized') do
        let(:Authorization) { 'Bearer invalid_token' }
        let(:collection_data) { { title: 'test' } }
        run_test!
      end
    end
  end

  path '/api/v1/user/collections/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    patch('update collection') do
      tags 'User Collections'
      consumes 'application/json'
      produces 'application/json'
      security [Bearer: []]
      
      parameter name: :Authorization, in: :header, type: :string, 
                description: 'Bearer token',
                example: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc'
      
      parameter name: :collection_data, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, description: 'Collection title', example: 'test-change' },
          description: { type: :string, description: 'Collection description' },
          is_public: { type: :boolean, description: 'Whether the collection is public' }
        }
      }

      response(200, 'collection updated') do
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

        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 13 }
        let(:collection_data) { { title: 'test-change' } }
        
        run_test! do |response|
          expect(response).to have_http_status(:ok)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 999 }
        let(:collection_data) { { title: 'Updated Collection' } }
        run_test!
      end

      response(401, 'unauthorized') do
        let(:Authorization) { 'Bearer invalid_token' }
        let(:id) { 13 }
        let(:collection_data) { { title: 'Updated Collection' } }
        run_test!
      end

      response(422, 'unprocessable entity') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 13 }
        let(:collection_data) { { title: '' } }
        run_test!
      end
    end

    delete('delete collection') do
      tags 'User Collections'
      produces 'application/json'
      security [Bearer: []]
      
      parameter name: :Authorization, in: :header, type: :string, 
                description: 'Bearer token',
                example: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc'

      response(204, 'collection deleted') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 15 }
        
        run_test! do |response|
          expect(response).to have_http_status(:no_content)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 999 }
        run_test!
      end

      response(401, 'unauthorized') do
        let(:Authorization) { 'Bearer invalid_token' }
        let(:id) { 15 }
        run_test!
      end
    end
  end

  path '/api/v1/user/collections/{id}/publish' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    put('publish collection') do
      tags 'User Collections'
      produces 'application/json'
      security [Bearer: []]
      
      parameter name: :Authorization, in: :header, type: :string, 
                description: 'Bearer token',
                example: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc'

      response(200, 'collection published') do
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

        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 13 }
        
        run_test! do |response|
          expect(response).to have_http_status(:ok)
        end
      end

      response(404, 'collection not found') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 999 }
        run_test!
      end

      response(401, 'unauthorized') do
        let(:Authorization) { 'Bearer invalid_token' }
        let(:id) { 13 }
        run_test!
      end

      response(422, 'unprocessable entity') do
        let(:Authorization) { 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJleHAiOjE3NTMwNTEwMzJ9.VGlzt-hKPZW_zCTfw35FNLJkGnlWgtv6wL6dKiLU5Yc' }
        let(:id) { 13 }
        run_test!
      end
    end
  end
end