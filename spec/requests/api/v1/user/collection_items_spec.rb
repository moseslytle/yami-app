# Created 07/23/2025 By Linus Xiong
# Updated 07/27/2025 By Linus Xiong - add more tests
require 'rails_helper'

RSpec.describe "Api::V1::User::CollectionItems", type: :request do
  let!(:user) { create(:user) }
  let!(:other_user) { create(:user) }
  let!(:provider) { create(:provider) }
  let!(:collection) { create(:collection, user: user) }
  let!(:public_collection) { create(:collection, :public, user: other_user) }
  let!(:private_collection) { create(:collection, :private, user: other_user) }
  
  let(:valid_jwt_token) do
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end

  let(:headers) { { 'Authorization' => "Bearer #{valid_jwt_token}" } }

  describe "GET /api/v1/user/collections/:collection_id/items" do
    let!(:collection_item) { create(:collection_item, collection: collection, provider: provider) }

    context "when accessing own collection" do
      it "returns collection items successfully" do
        get "/api/v1/user/collections/#{collection.id}/items", headers: headers

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to be_an(Array)
        expect(parsed_response.first['provider']).to include('name', 'category', 'rating')
      end
    end

    context "when accessing public collection" do
      let!(:public_item) { create(:collection_item, collection: public_collection, provider: provider) }

      it "returns collection items successfully" do
        get "/api/v1/user/collections/#{public_collection.id}/items", headers: headers

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to be_an(Array)
      end
    end

    context "when accessing private collection of another user" do
      it "returns not found error" do
        get "/api/v1/user/collections/#{private_collection.id}/items", headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Collection not found or access denied")
      end
    end

    context "when collection does not exist" do
      it "returns not found error" do
        get "/api/v1/user/collections/999999/items", headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Collection not found or access denied")
      end
    end
  end

  describe "POST /api/v1/user/collections/:collection_id/items" do
    context "when adding item to own collection" do
      it "creates collection item successfully" do
        expect {
          post "/api/v1/user/collections/#{collection.id}/items", 
               params: { provider_id: provider.id, user_note: "Great place!" },
               headers: headers
        }.to change(CollectionItem, :count).by(1)

        expect(response).to have_http_status(:created)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['provider_id']).to eq(provider.id)
        expect(parsed_response['user_note']).to eq("Great place!")
      end

      it "handles duplicate items" do
        create(:collection_item, collection: collection, provider: provider)

        post "/api/v1/user/collections/#{collection.id}/items", 
             params: { provider_id: provider.id, user_note: "Duplicate!" },
             headers: headers

        expect(response).to have_http_status(:conflict)
        expect(JSON.parse(response.body)['error']).to eq("Duplicate record")
      end

      it "handles invalid provider_id" do
        post "/api/v1/user/collections/#{collection.id}/items", 
             params: { provider_id: 999999, user_note: "Invalid provider!" },
             headers: headers

        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq("Failed to add item to collection")
      end
    end

    context "when adding item to public collection" do
      it "creates collection item successfully" do
        expect {
          post "/api/v1/user/collections/#{public_collection.id}/items", 
               params: { provider_id: provider.id, user_note: "Added to public!" },
               headers: headers
        }.to change(CollectionItem, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end

    context "when adding item to private collection of another user" do
      it "returns not found error" do
        post "/api/v1/user/collections/#{private_collection.id}/items", 
             params: { provider_id: provider.id, user_note: "Unauthorized!" },
             headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Collection not found or access denied")
      end
    end
  end

  describe "PATCH /api/v1/user/collections/:collection_id/items/:id" do
    let!(:collection_item) { create(:collection_item, collection: collection, provider: provider) }

    context "when updating item in own collection" do
      it "updates collection item successfully" do
        patch "/api/v1/user/collections/#{collection.id}/items/#{collection_item.id}", 
              params: { user_note: "Updated note!" },
              headers: headers

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['user_note']).to eq("Updated note!")
        expect(collection_item.reload.user_note).to eq("Updated note!")
      end

      it "handles validation errors" do
        # Assuming there might be validations that could fail
        allow_any_instance_of(CollectionItem).to receive(:update).and_return(false)
        allow_any_instance_of(CollectionItem).to receive(:errors).and_return(double(full_messages: ["Test error"]))

        patch "/api/v1/user/collections/#{collection.id}/items/#{collection_item.id}", 
              params: { user_note: "" },
              headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context "when item does not exist" do
      it "returns not found error" do
        patch "/api/v1/user/collections/#{collection.id}/items/999999", 
              params: { user_note: "Non-existent!" },
              headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Item not found")
      end
    end
  end

  describe "DELETE /api/v1/user/collections/:collection_id/items/:id" do
    let!(:collection_item) { create(:collection_item, collection: collection, provider: provider) }

    context "when deleting item from own collection" do
      it "deletes collection item successfully" do
        expect {
          delete "/api/v1/user/collections/#{collection.id}/items/#{collection_item.id}", 
                 headers: headers
        }.to change(CollectionItem, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end

    context "when item does not exist" do
      it "returns not found error" do
        delete "/api/v1/user/collections/#{collection.id}/items/999999", 
               headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Item not found")
      end
    end

    context "when collection does not exist" do
      it "returns not found error" do
        delete "/api/v1/user/collections/999999/items/#{collection_item.id}", 
               headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Collection not found or access denied")
      end
    end
  end
end
