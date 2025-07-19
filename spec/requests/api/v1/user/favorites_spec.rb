require 'swagger_helper'

RSpec.describe 'api/v1/user/favorites', type: :request do

  path '/api/v1/user/favorites' do

    post('create favorite') do
      response(200, 'successful') do

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end
  end

  path '/api/v1/user/favorites/{provider_id}' do
    # You'll want to customize the parameter types...
    parameter name: 'provider_id', in: :path, type: :string, description: 'provider_id'

    delete('delete favorite') do
      response(200, 'successful') do
        let(:provider_id) { '123' }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end
  end
end
