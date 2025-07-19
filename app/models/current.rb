class Current < ActiveSupport::CurrentAttributes
  attribute :user, :user_id,  :user_agent, :client_ip
end
