class MerbJavascriptNamedRoutes::Main < MerbJavascriptNamedRoutes::Application
  
  def routes
    only_provides :js
    @named_routes    = Merb::Router.named_routes.to_json
    @resource_routes = Merb::Router.resource_routes.inject({}) { |hash, rr| 
      hash[rr.first.join(',')] = rr.last
      hash
    }.to_json 
    render :layout => nil
  end
  
end
