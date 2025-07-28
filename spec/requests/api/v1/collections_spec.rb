# Created 07/23/2025 By Linus Xiong
# Updated 07/27/2025 By Linus Xiong - add more tests
require 'rails_helper'

RSpec.describe 'Api::V1::Collections', type: :request do
  let!(:user) { create(:user) }
  let!(:public_collection1) { create(:collection, :public, user: user, title: "Public Collection 1") }
  let!(:public_collection2) { create(:collection, :public, user: user, title: "Public Collection 2") }
  let!(:private_collection) { create(:collection, :private, user: user, title: "Private Collection") }
  let!(:provider) { create(:provider) }

  describe 'GET /api/v1/collections' do
    context 'when listing public collections' do
      it 'returns public collections with pagination' do
        get '/api/v1/collections'

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['collections']).to be_an(Array)
        expect(parsed_response['pagination']).to include('page', 'limit', 'total', 'hasMore')
        # Only public collections should be returned
        expect(parsed_response['collections'].all? { |c| c['is_public'] }).to be true
      end

      it 'handles pagination parameters correctly' do
        # Clear existing collections and create exactly what we need for this test
        Collection.where(is_public: true).destroy_all
        test_collection = create(:collection, :public, user: user, title: "Test Collection")
        
        get '/api/v1/collections', params: { page: 1, limit: 15 }

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['collections'].size).to eq(1)
        expect(parsed_response['pagination']['limit']).to eq(15)
        expect(parsed_response['pagination']['hasMore']).to be false # Only one collection exists
      end

      it 'defaults invalid pagination to safe values' do
        get '/api/v1/collections', params: { page: -1, limit: 200 }

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['pagination']['page']).to eq(1) # Should default to 1
        expect(parsed_response['pagination']['limit']).to eq(100) # Should max at 100
      end

      it 'returns empty collections when no public collections exist' do
        Collection.where(is_public: true).destroy_all

        get '/api/v1/collections'

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['collections']).to be_empty
        expect(parsed_response['pagination']['total']).to eq(0)
      end
    end
  end

  describe 'GET /api/v1/collections/:id' do
    context 'when accessing public collection' do
      it 'returns the collection successfully' do
        get "/api/v1/collections/#{public_collection1.id}"

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['id']).to eq(public_collection1.id)
        expect(parsed_response['is_public']).to be true
        expect(parsed_response['title']).to eq("Public Collection 1")
      end
    end

    context 'when collection does not exist' do
      it 'returns not found error' do
        get "/api/v1/collections/999999"

        expect(response).to have_http_status(:not_found)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq("Collection not found or is private")
      end
    end

    context 'when accessing private collection' do
      it 'returns not found error' do
        get "/api/v1/collections/#{private_collection.id}"

        expect(response).to have_http_status(:not_found)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq("Collection not found or is private")
      end
    end
  end

  describe 'GET /api/v1/collections/:id/items' do
    context 'when accessing public collection items' do
      let!(:collection_item) { create(:collection_item, collection: public_collection1, provider: provider) }

      it 'returns collection items with provider details' do
        get "/api/v1/collections/#{public_collection1.id}/items"

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to be_an(Array)
        expect(parsed_response.first['provider']).to include('name', 'category', 'rating')
        expect(parsed_response.first['provider']['name']).to eq(provider.name)
      end
    end

    context 'when collection has no items' do
      it 'returns empty array' do
        get "/api/v1/collections/#{public_collection2.id}/items"

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to be_an(Array)
        expect(parsed_response).to be_empty
      end
    end

    context 'when collection does not exist' do
      it 'returns not found error' do
        get "/api/v1/collections/999999/items"

        expect(response).to have_http_status(:not_found)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq("Collection not found or is private")
      end
    end

    context 'when accessing private collection items' do
      it 'returns not found error' do
        get "/api/v1/collections/#{private_collection.id}/items"

        expect(response).to have_http_status(:not_found)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['error']).to eq("Collection not found or is private")
      end
    end

    context 'when collection has multiple items' do
      let!(:provider2) { create(:provider, name: "Second Provider") }
      let!(:item1) { create(:collection_item, collection: public_collection1, provider: provider) }
      let!(:item2) { create(:collection_item, collection: public_collection1, provider: provider2) }

      it 'returns all items with provider details' do
        get "/api/v1/collections/#{public_collection1.id}/items"

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response.size).to eq(2)
        provider_names = parsed_response.map { |item| item['provider']['name'] }
        expect(provider_names).to include("Test Provider", "Second Provider")
      end
    end
  end

  describe 'edge cases and data integrity' do
    it 'handles collections with special characters in title' do
      special_collection = create(:collection, :public, user: user, title: "Collection with 特殊字符 & symbols!")
      
      get "/api/v1/collections/#{special_collection.id}"
      
      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['title']).to eq("Collection with 特殊字符 & symbols!")
    end

    it 'returns collections ordered by created_at desc' do
      # Clear existing collections and create new ones with specific times
      Collection.where(is_public: true).destroy_all
      
      old_collection = create(:collection, :public, user: user, title: "Old Collection")
      old_collection.update_column(:created_at, 2.days.ago)
      
      new_collection = create(:collection, :public, user: user, title: "New Collection")
      new_collection.update_column(:created_at, 1.day.ago)

      get '/api/v1/collections'

      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      titles = parsed_response['collections'].map { |c| c['title'] }
      # Newer collections should come first
      expect(titles.first).to eq("New Collection")
      expect(titles.last).to eq("Old Collection")
    end
  end
end
