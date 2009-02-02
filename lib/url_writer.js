Merb = window.Merb || {};
;(function(window) {
  Merb.Route = function(key, route_string) {
    this['name'] = key;
    this.route_string = route_string;
    this.compile_route();
  };
  
  Merb.Route.prototype = {
    route_splitter:  /(\.[\w]+|\/:?[\w]+|\(.*?\))/g
    ,literal_part:   /^\/[\w]+$|^\.[\w]+$/
    ,optional_part:  /^\(\/[\w]+\)$/
    ,optional_value: /^\(\/:([\w]+)\)$/
    ,required_value: /^\/:([\w]+)$/
    ,format_part:    /^\(\.:([\w]+)\)$/
    
    ,compile_route: function() {
      this.break_down_route_string();
      this.create_generation_method();
    }
    
    ,break_down_route_string: function() {
      this.parts = this.route_string.match(this.route_splitter);
    }
    
    ,create_generation_method: function() {
      this.generator_functions = [];
      var i, len = this.parts.length;
      for(i=0; i < len; i++)
        this.generator_function_for(this.parts[i]);
        
      this.generate = function(values) {
        values = values || {};
        var i, len = this.generator_functions.length, url='';
        for(i=0; i<len; i++) url += this.generator_functions[i](values);
        return url;
      }
    }
    
    ,generator_function_for: function(part) {
      var _match, self = this;
      
      if(part.match(this.literal_part)) {
        this.generator_functions.push( function() { return part; } );
      }
      else if(part.match(this.optional_part)) { /* Do Nothing */ }
      
      // optional but takes value
      else if(_match = part.match(this.optional_value)) {
        _match = _match[1];
        this.generator_functions.push(function(values) {
          if(values[_match]) {
            var part = '/'+values[_match];
            delete values[_match];
            return part;
          }
          else return ''
        });
      }
      // required value
      else if(_match = part.match(this.required_value)) {
        _match = _match[1];
        this.generator_functions.push(function(values) {
          if(!values[_match]) throw "Must supply '"+_match+"' for route '"+self['name']+"'";
          var part = '/'+values[_match];
          delete values[_match];
          return part;
        });
      }
      // optional .:format
      else if(_match = part.match(this.format_part)) {
        _match= _match[1];
        this.generator_functions.push(function(values){
          if(values[_match]) {
            var part = '.'+values[_match]
            delete values[_match];
            return part;
          }
          else return '';
        });
      }
    }
    
    ,generate: function() {
      // Very Bizzare and unlikely.
      throw "Route generation method has not been created."
    }
    
    ,query_string: function(values) {
      var parts = [], slot, string;
      for(slot in values) parts.push(slot+'='+slot[value])
      string = parts.join('&');
      if(string.length) return '?'+string;
      return '';
    }
  };
  
  Merb.NamedRoute = function(key, route_string) {
    this.route = new Merb.Route(key, route_string);
  };

  Merb.NamedRoute.prototype = {
    generate: function(options) {
      var url = this.route.generate(options);
      return url + this.route.query_string(options);
    }
  };

  Merb.ResourceRoute = function(key, route_string) {
    this.route = new Merb.Route(key, route_string);
  };

  Merb.ResourceRoute.prototype = {
    generate: function(resource, options) {
      options = options || {};
      var slot, url;
      for(slot in resource) options[slot] = resource[slot];
      url = this.route.generate(options);
      for(slot in resource) delete options[slot];
      return url + this.route.query_string(options);
    }
  };

  Merb.compile_routes = function(named, resource) {
    compile_named_routes(named);
    compile_resource_routes(resource);
  };

  Merb.url = url;
  Merb.resource = resource;

  var named_routes      = {};
  var resource_routes   = {};

  function compile_named_routes(routes) {
    for(var key in routes) {
      named_routes[key] = new Merb.NamedRoute(key, routes[key]);
    }
  }
  
  function compile_resource_routes(routes) {
    for(var key in routes) resource_routes[key] = new Merb.ResourceRoute(key, routes[key]);
  }

  function url(named, options) {
    return named_routes[named].generate(options);
  }
  
  function resource(object, method, options) {
    if(!object['class']) throw "Objects passed to the resource url generator\
      MUST have a 'class' property.";
    var designation = [object['class']]
    
    if(method) {
      if(method.toString() == ({}).toString()) {
        options = method;
        method = null;
      }
      else {
        designation.push(method);
      }
    }
      
    designation = designation.toString();
    return resource_routes[designation].generate(object, options);
  }
  
})();

window.url = Merb.url;
window.resource = Merb.resource;
