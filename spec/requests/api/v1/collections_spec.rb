require 'swagger_helper'

RSpec.describe 'public collections', type: :request do
  # Public collections endpoints
  path '/api/v1/collections' do
    get('list public collections') do
      tags 'Public Collections'
      produces 'application/json'

      response(200, 'collections found') do
        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   title: { type: :string },
                   description: { type: :string },
                   is_public: { type: :boolean },
                   user_id: { type: :integer },
                   created_at: { type: :string, format: :datetime },
                   updated_at: { type: :string, format: :datetime }
                 }
               }
        run_test!
      end
    end
  end

  path '/api/v1/collections/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Collection ID'

    get('show public collection') do
      tags 'Public Collections'
      produces 'application/json'

      response(200, 'collection found') do
        schema type: :object,
               properties: {
                 id: { type: :integer },
                 title: { type: :string },
                 description: { type: :string },
                 is_public: { type: :boolean },
                 user_id: { type: :integer },
                 created_at: { type: :string, format: :datetime },
                 updated_at: { type: :string, format: :datetime }
               }

        let(:id) { 15 }
        run_test!
      end

      response(404, 'collection not found') do
        let(:id) { 999 }
        run_test!
      end
    end
  end
end
