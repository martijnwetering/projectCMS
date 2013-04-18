window.ProjectView = Backbone.View.extend({


    initialize: function () {
        //bind this to addImages because of callback
        _.bindAll(this,"addImages");
        _.bindAll(this,"activateDropzone");
        var imageDropzone;
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        //hackyway to run javascript after template is loaded
        setTimeout(this.activateDropzone, 0);
        setTimeout(this.addImages, 0);
        return this;
    },

    activateDropzone: function () {
        imageDropzone = new Dropzone("#imageDropzoneID", {
              url: "/image-upload"
            , paramName:          "file"
            , maxFilesize:        2 //mb
            , enqueueForUpload:   false
            , thumbnailWidth:     150
            , thumbnailHeight:    150 
        });
        
        imageDropzone.on("addedfile", function(file) {
            imageDropzone.filesQueue.push(file);
        });
        
        imageDropzone.on("thumbnail", function(file, imageURL) {
           // imageDropzone.removeFile(file);
            $('imageDropzone').append("<p>Image Added!</p>");
            var image = 
                    '<div class="well picture-frame" style="width: 180px;text-align: center;width:50%;margin: 0px auto;">' +
                        '<p><img id="picture" width="180" src="' + imageURL + '"></p>' +
                        '<a href="" class="btn deletePicture" id="tempImage" title="' + file.name+ '" >Delete picture</a>' +
                    '</div>';
            $( '#pictures-wrapper' ).append(image);  
        });

    },

    addImages: function() {
        var self = this;
        var imageTemplate = '';
        var imageNameArray = [];
        for (var i = 0; i < this.model.attributes.pictures.length; i++) {
           // console.log(self.model.attributes.pictures[i]);
            imageNameArray.push(self.model.attributes.pictures[i]);
            var deleteBtn = '';
            if (self.model.attributes.pictures[i] != "generic.jpg") {
                deleteBtn = '<a href="" class="btn deletePicture" title="'+ self.model.attributes.pictures[i] + '">Delete picture</a>'
            }
            var image = 
                    '<div class="well picture-frame" style="width: 180px;text-align: center;width:50%;margin: 0px auto;">' +
                        '<p><img id="picture" width="180" src="uploads/' + self.model.attributes.pictures[i] + '"></p>' +
                         deleteBtn +
                    '</div>';
            imageTemplate += image;
        };
        
        $( '#pictures-wrapper' ).append(imageTemplate);
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteProject",
        "click .deletePicture" : "deletePicture"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        var pictureArray = self.model.attributes.pictures;
        

        $('.save').prop("data-loading-text", "saving..");

        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        } 

        if (imageDropzone.filesQueue == 0) {
            // no images are uploaded
            console.log(self.model.get("pictures"));
            console.log("attributes", self.model.attributes.pictures);
            self.saveProject();
        } else {
            imageDropzone.processQueue();
            imageDropzone.on("uploadprogress", function(file, progress){
                utils.showProgress(file, progress);
            });
            imageDropzone.on("complete", function(file){
                //pictureArray.push(file.name);
                self.model.attributes.pictures.push(file.name);
                if (this.filesQueue.length == 0 && this.filesProcessing.length == 0) {
                // File finished uploading, and there aren't any left in the queue.
                    if ((pictureArray.length > 1) && (pictureArray[0] == "generic.jpg")) {
                        pictureArray.shift();
                    }
                    self.model.attributes.pictures = pictureArray;
                    self.saveProject();
                } 
            });
            imageDropzone.on("error", function(file, errorMessage) {
                utils.hideLoading();
                utils.showAlert('Error', 'An error occurred while trying to save' + file, 'alert-error');
                console.log(errorMessage);
            });  
        }
        return false;
    },

    saveProject: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('cms/projects/' + model.id, false);
                utils.showAlert('Success!', 'project saved successfully', 'alert-success');   
            },
            error: function (model, xhr) {
                utils.showAlert('Error', 'An error occurred while trying to save this item', 'alert-error');
                console.log(model, xhr);

            }
        });
    },

    deleteProject: function () {
        var imageArray = this.model.attributes.pictures;
        this.model.destroy({
            success: function () {
                for (var i = 0; i < imageArray.length; i++) {
                    $.ajax({
                          type: "POST"
                        , url: "/image-delete"
                        , data: { "imageName" : imageArray[i] }
                        , success: function(response) {
                            $(event.currentTarget).closest('.picture-frame').remove();
                          }
                        , error: function(response) {
                            utils.showAlert('Error', 'An error occurred while deleting this picture', 'alert-error');
                            console.log("error");
                          }
                    });
                };
                alert('Project deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    deletePicture: function(event) {
        event.preventDefault();

        var self = this;
        var imageName = $(event.currentTarget).attr("title");
        var imageID = $(event.currentTarget).attr("id");
        var image = $(event.currentTarget);

        if (imageID == "tempImage"){ 
            var index = imageDropzone.filesQueue.indexOf(imageName);
            imageDropzone.filesQueue.splice(index, 1);
            $(event.currentTarget).closest('.picture-frame').remove();

        } else {
            var index = this.model.attributes.pictures.indexOf(imageName);
            this.model.attributes.pictures.splice(index, 1);
            console.log("DELETETED", this.model.attributes.pictures);
            $.ajax({
                  type: "POST"
                , url: "/image-delete"
                , data: { "imageName" : imageName }
                , success: function(response) { 
                    $(event.currentTarget).closest('.picture-frame').remove(); 
                  }
                , error: function(response) {
                    utils.showAlert('Error', 'An error occurred while deleting this picture', 'alert-error');
                    console.log("error");
                  }
            });
        }
    }

});