// Here's my data model
var ViewModel = function() {
    var self = this;
    self.addWhat = ko.observable("Magic");
};

ko.applyBindings(new ViewModel()); // This makes Knockout get to work