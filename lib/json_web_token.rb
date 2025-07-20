# Created 7/18/2025 by Moses Lytle
#
class JsonWebToken
  SECRET_KEY = Rails.application.secret_key_base || Rails.application.credentials.secret_key_base

  # Encodes user data into a token
  #
  # @param payload [Hash] Data to encode in the token (typically user_id)
  # @param exp [Time] Token expiration time (default: 24 hours from now)
  # @return [String] Encoded  token
  #
  # @example
  #   token = JsonWebToken.encode(user_id: 1)
  #   # => "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MjE1ODcyODF9.abc123"
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  # Decodes and validates a JWT token
  #
  # @param token [String]  token to decode
  # @return [HashWithIndifferentAccess] Decoded token payload if valid
  # @return [nil] If token is invalid, expired, or malformed
  #
  # @example
  #   decoded = JsonWebToken.decode("eyJhbGciOiJIUzI1NiJ9...")
  #   # => { "user_id" => 1, "exp" => 1721587281 }
  def self.decode(token)
    return nil if token.blank?

    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError
    nil
  end
end
