Backbone.ExtendedView = Backbone[Backbone.RoutedView ? 'RoutedView' : 'View'].extend({
  
  initialize: function(options) {
    if(this.dependencies) {
      this.load_dependencies(this.dependencies);
      
      Kameleon.screen.on('change', $.proxy(function() {
        this.load_dependencies(this.dependencies);
      }, this));
    }
    
    Backbone[Backbone.RoutedView ? 'RoutedView' : 'View'].prototype.initialize.call(this,options);
  },
  
  load_dependencies: function(dependencies) {
    Modernizr.load(this.sanitize(dependencies));
  },
  
  sanitize: function(dependencies) {
    var dependencies_return;
    
    if( $.type(dependencies) === 'array' ) {
      dependencies_return = [];
      _.each(dependencies, $.proxy(function(dependency) {
        dependencies_return.push($.extend({}, {
          load: dependency.load,
          test: $.type(dependency.test) == 'function' ? dependency.test() : dependency.test,
          yep: dependency.yep ? dependency.yep : [],
          nope: dependency.nope ? dependency.nope : [],
          callback: $.proxy(this.on_each_dep_loaded, this),
          complete: $.proxy(this.on_all_dep_loaded, this)
        }));
      }, this));
    } 
    else if($.type(dependencies) === 'object') {
      dependencies_return = {
        load: dependencies.load,
        test: $.type(dependencies.test) == 'function' ? dependencies.test() : dependencies.test,
        yep: dependencies.yep ? dependencies.yep : [],
        nope: dependencies.nope ? dependencies.nope : [],
        callback: $.proxy(this.on_each_dep_loaded, this),
        complete: $.proxy(this.on_all_dep_loaded, this)
      };
    }
    return dependencies_return;
  },
  
  on_each_dep_loaded: function(url, result, key) {
    this.trigger('each_dependency_loaded',key, url);
  },
  
  on_all_dep_loaded: function() {
    this.trigger('all_dependencies_loaded');
  }
  
});