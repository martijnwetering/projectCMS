window.Project = Backbone.Model.extend({

    urlRoot: "/projects",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.client = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter client"};
        };

        this.validators.context = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter the context"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "Name Unknown",
        year: 0000,
        client: "Client Unknown",
        context: "Context Unknown",
        instruction: "Instruction Unknown",
        expertise: "Expertise Unknown",
        discription: "Project discription Unknown",
        picture: null
    }
});

window.ProjectCollection = Backbone.Collection.extend({

    model: Project,

    url: "/projects"

});