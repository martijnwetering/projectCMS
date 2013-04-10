var AppRouter = Backbone.Router.extend({

    routes: {
        ""                      : "home",
        "projects"	            : "list",
        "projects/page/:page"	: "list",
        "projects/add"          : "addProject",
        "projects/:id"          : "projectDetails"      
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var projectList = new ProjectCollection();
        projectList.fetch({success: function(){
            $("#content").html(new ProjectListView({model: projectList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    projectDetails: function (id) {
        var project = new Project({_id: id});
        project.fetch({success: function(){
            $("#content").html(new ProjectView({model: project}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addProject: function() {
        var project = new Project();
        $('#content').html(new ProjectView({model: project}).el);
        this.headerView.selectMenuItem('add-menu');
	}
});

utils.loadTemplate(['HomeView', 'HeaderView', 'ProjectView', 'ProjectListItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});