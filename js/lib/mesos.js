// Here's my data model
var ViewModel = function() {
    var self = this;

    self.availableApps = [
        {
            appType: "Hadoop"
        },
        {
            appType: "Rails"
        },
        {
            appType: "Chronos"
        },
        {
            appType: "Storm"
        },
        {
            appType: "Spark"
        }
    ];

    var BlankServer = function(){
        return {
            firstApp: null,
            secondApp: null
        };
    }

    self.servers = ko.observableArray([
        new BlankServer(),
        new BlankServer(),
        new BlankServer(),
        new BlankServer()
    ]);

    self.addServer = function(){
        if(self.servers().length >= 32) {
            swal({
                title: "Hmm...",
                text: "Let's keep it below 32 servers for demo purposes, shell we?" +
                    "\nTry removing some servers or apps instead!",
                type: "warning"
            });
            return;
        }
        self.servers.push(new BlankServer());
    };

    self.destroyServer = function(){
        if(self.servers().length == 0) {
            swal({
                title: "Uh oh...",
                text: "There are no more servers to Destroy!\n Try adding more servers first.",
                type: "warning"
            });
            return;
        }
        self.servers.pop();
    };

    self.addApp = function(vm, event){
        var appType = event.target.parentNode.id;
        console.log(appType);
    };

    self.removeApp = function(){
        var appType = event.target.parentNode.id;
        console.log(appType);
    };


};

ko.applyBindings(new ViewModel()); // This makes Knockout get to work