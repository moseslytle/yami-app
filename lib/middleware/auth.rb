# Create 07/19/2025 By Linus Xiong - add auth middleware for those api endpoint that need been verify
class AuthenticationMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new env
    client_ip = extract_client_ip(request)
    user_agent = extract_user_agent(request)
    Rails.logger.info "Request from IP: #{client_ip}, UA: #{user_agent}, Path: #{request.path}"
    return @app.call(env) if skip_auth? request.path
    token = extract_token request
    return unauthorized_response if token.nil?
    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id]) if decoded
      env["current_user"] = @current_user
      env["current_user_id"] = @current_user&.id
      env["client_ip"] = client_ip
      env["user_agent"] = user_agent

      if defined?(Current)
        Current.user = @current_user
        Current.user_id = @current_user&.id
        Current.client_ip = client_ip
        Current.user_agent = user_agent
      end
    rescue => error
      return unauthorized_response("Invalid token")
    end
    @app.call(env)

  ensure
    Current.reset if defined?(Current)
  end
  private

  def unauthorized_response(message = "Unauthorized")
    [
      401,
      { "Content-Type" => "application/json" },
      [ { error: message, status: 401 }.to_json ]
    ]
  end

  # Extract the token from the Authorization header.
  def extract_token(request)
    auth_header = request.env["HTTP_AUTHORIZATION"]
    return nil unless auth_header
    if auth_header.start_with?("Bearer ")
      auth_header.split(" ").last
    else
      auth_header
    end
  end

  def skip_auth?(path)
    allowed_patterns = [
      %r{^/up$},
      %r{^/api/v1/.*$},
      %r{^/api-docs(/.*)?$}
    ]

    blocked_patterns = [
      %r{^/api/v1/user/.*$}
    ]

    is_allowed = allowed_patterns.any? { |pattern| path.match?(pattern) }
    is_blocked = blocked_patterns.any? { |pattern| path.match?(pattern) }

    is_allowed && !is_blocked
  end

  def extract_client_ip(request)
    forwarded_ips = [
      request.env["HTTP_X_FORWARDED_FOR"],
      request.env["HTTP_X_REAL_IP"],
      request.env["HTTP_CF_CONNECTING_IP"],
      request.env["HTTP_CLIENT_IP"],
      request.env["HTTP_X_CLUSTER_CLIENT_IP"],
      request.ip
    ].compact

    forwarded_ips.each do |ip_string|
      ips = ip_string.split(",").map(&:strip)
      ips.each do |ip|
        return ip if valid_public_ip?(ip)
      end
    end

    request.ip
  end

  # Verify that it is a valid public IP
  def valid_public_ip?(ip)
    return false unless ip
    begin
      addr = IPAddr.new(ip)
      !addr.private? && !addr.loopback? && !addr.link_local?
    rescue IPAddr::InvalidAddressError
      false
    end
  end

  # extract User-Agent
  def extract_user_agent(request)
    request.env["HTTP_USER_AGENT"] || "Unknown"
  end
end
