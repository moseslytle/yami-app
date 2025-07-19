# Created 07/19/2004 By Linus Xiong - Add API flow limiting and guarding

Rack::Attack.throttle("requests by ip", limit: 300, period: 5.minutes) do |request|
  request.ip
end
