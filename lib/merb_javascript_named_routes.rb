if defined?(Merb::Plugins)

  $:.unshift File.dirname(__FILE__)

  dependency 'merb-slices', :immediate => true
  Merb::Plugins.add_rakefiles "merb_javascript_named_routes/merbtasks", "merb_javascript_named_routes/slicetasks", "merb_javascript_named_routes/spectasks"

  # Register the Slice for the current host application
  Merb::Slices::register(__FILE__)
  
  # Slice configuration - set this in a before_app_loads callback.
  # By default a Slice uses its own layout, so you can swicht to 
  # the main application layout or no layout at all if needed.
  # 
  # Configuration options:
  # :layout - the layout to use; defaults to :merb_javascript_named_routes
  # :mirror - which path component types to use on copy operations; defaults to all
  # Merb::Slices::config[:merb_javascript_named_routes][:layout] ||= :merb_javascript_named_routes
  # Merb::Slices::config[:merb_javascript_named_routes][:mirror] ||= [:javascripts]
  
  # All Slice code is expected to be namespaced inside a module
  module MerbJavascriptNamedRoutes
    
    # Slice metadata
    self.description = "MerbJavascriptNamedRoutes gives you url generators in javascript!"
    self.version = "0.0.1"
    self.author = "github.com/collin"
    
    # Stub classes loaded hook - runs before LoadClasses BootLoader
    # right after a slice's classes have been loaded internally.
    def self.loaded
    end
    
    # Initialization hook - runs before AfterAppLoads BootLoader
    def self.init
    end
    
    # Activation hook - runs after AfterAppLoads BootLoader
    def self.activate
    end
    
    # Deactivation hook - triggered by Merb::Slices.deactivate(MerbJavascriptNamedRoutes)
    def self.deactivate
    end
    
    # Setup routes inside the host application
    #
    # @param scope<Merb::Router::Behaviour>
    #  Routes will be added within this scope (namespace). In fact, any 
    #  router behaviour is a valid namespace, so you can attach
    #  routes at any level of your router setup.
    #
    # @note prefix your named routes with :merb_javascript_named_routes_
    #   to avoid potential conflicts with global named routes.
    def self.setup_router(scope)
      scope.match('/routes.js').to(:controller => 'main', :action => 'routes', :format => :js).name(:routes)
    end
    
  end
  
  # Setup the slice layout for MerbJavascriptNamedRoutes
  #
  # Use MerbJavascriptNamedRoutes.push_path and MerbJavascriptNamedRoutes.push_app_path
  # to set paths to merb_javascript_named_routes-level and app-level paths. Example:
  #
  # MerbJavascriptNamedRoutes.push_path(:application, MerbJavascriptNamedRoutes.root)
  # MerbJavascriptNamedRoutes.push_app_path(:application, Merb.root / 'slices' / 'merb_javascript_named_routes')
  # ...
  #
  # Any component path that hasn't been set will default to MerbJavascriptNamedRoutes.root
  #
  # Or just call setup_default_structure! to setup a basic Merb MVC structure.
  MerbJavascriptNamedRoutes.setup_default_structure!
  
  # Add dependencies for other MerbJavascriptNamedRoutes classes below. Example:
  dependency "json"
  
end
