# Created 07/27/2025 by Paulina Salazar

require 'rails_helper'

RSpec.describe 'Api::V1::Providers', type: :request do
  let!(:provider1) { create(:provider, name: 'Test1 Laundry', category: 'laundry', rating: 4.5, review_count: 20, price_range: '$$') }

  describe 'GET /api/v1/providers' do
    it 'returns a list of providers with pagination' do
      get '/api/v1/providers'

      # Should return array of providers and support pagination.
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['success']).to be true
      expect(json['data']['providers']).to be_an(Array)
      expect(json['data']['pagination']).to include('current_page', 'total_pages', 'total_items', 'has_next', 'has_previous')
    end

    it 'supports sorting by name descending' do
      get '/api/v1/providers', params: { sort: 'name_desc' }

      # Should return providers in a sorted descending order.
      json = JSON.parse(response.body)
      names = json['data']['providers'].map { |p| p['name'] }
      expect(names).to eq(names.sort.reverse)
    end

  end

  describe 'GET /api/v1/providers/:id' do
    context 'with a valid ID' do
      it 'returns the provider' do
        get "/api/v1/providers/#{provider1.id}"

        # Should return provider by finding it through its ID.
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['data']['provider']['name']).to eq('Test1 Laundry')
      end
    end

    context 'with an invalid ID' do
      it 'returns 404 not found' do
        get '/api/v1/providers/999999'

        # Should not return anything with invalid ID.
        expect(response).to have_http_status(:not_found)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(json['error']).to eq('Provider not found')
      end
    end
  end

  describe 'GET /api/v1/providers/search' do
    it 'filters providers by category and min_rating' do
      get '/api/v1/providers/search', params: { category: 'laundry', min_rating: 4 }

      # Should return provider that fits search parameters.
      json = JSON.parse(response.body)
      expect(json['success']).to be true
      expect(json['data']['providers']).to all(include('category' => 'laundry'))
      expect(json['data']['providers']).to all(satisfy { |p| p['rating'].to_f >= 4.0 })
    end

  end

  describe 'GET /api/v1/providers/most_favorited' do
    before do
      provider1.update(favorites_count: 10)
    end

    it 'returns providers ordered by favorites_count desc' do
      get '/api/v1/providers/most_favorited'

      # Should return providers with favorite count.
      json = JSON.parse(response.body)
      counts = json['data']['providers'].map { |p| p['favorites_count'] }
      expect(counts).to eq(counts.sort.reverse)
    end
  end

end
