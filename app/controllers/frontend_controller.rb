class FrontendController < ActionController::API
  def index
    index_file = Rails.root.join("public", "index.html")

    if index_file.exist?
      send_file index_file, type: "text/html", disposition: "inline"
    else
      head :not_found
    end
  end
end
