// Here's my data model
var ViewModel = function() {
    var self = this;

    /**
     * Available app types
     */
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

    /**
     * Constructor for Server Object.
     * Each server keeps count of apps running on it, and can add and remove apps, if there is room.
     */
    var BlankServer = function(){
        var self = this;
        var count = 0;
        self.firstApp = ko.observable(null);
        self.secondApp = ko.observable(null);
        self.addApp = function(appType){
            if(count === 0){
                self.firstApp(appType);
                count++;
                return true;
            } else if (count == 1){
                self.secondApp(appType);
                count++;
                return true;
            } else {
                return false;
            }
        };

        self.removeApp = function(appType){
            if(self.firstApp() == appType){
                self.firstApp(self.secondApp());
                self.secondApp(null);
                count--;
            } else if(self.secondApp() == appType) {
                self.secondApp(null);
                count--;
            } else {
                throw new Error("Trying to remove app that wasn't on the server");
            }
            return true;
        };

        self.getApps = function(){
            if(count === 0){
                return [];
            } else if (count === 1){
                return [self.firstApp()];
            } else if (count === 2) {
                return [self.firstApp(), self.secondApp()];
            } else {
                throw new Error("BlankServer count is invalid");
            }

        };
        self.getCount = function(){
            return count;
        };
        return self;
     };

    /**
     * Checks if there are servers that are available to run apps
     * Makes sure that each server at least running one app, before
     * running another app on same server.
     */
    var getAvailableServer = function(){
        var servers = self.servers();
        var availableServer;

        availableServer = _.find(servers, function(server){
            return server.getCount() === 0;
        });

        if(availableServer) {
            return availableServer;
        }

        //Else no empty servers found, get one with only 1 app running
        availableServer = _.find(servers, function(server){
            return server.getCount() == 1;
        });

        if(availableServer) {
            return availableServer;
        } else { //Looks like all servers are already running 2 apps each
            return false;
        }
    };

    /**
     * Check for the last server to run a particular type of app
     */
    var getLastUsedServerFor = function(appType){
        var servers = self.servers();
        var lastUsedServer;

        lastUsedServer = _.findLast(servers, function(server){
            return server.secondApp() == appType;
        });

        if(lastUsedServer){
            return lastUsedServer;
        }

        //Else no secondary app was found, check for primary
        lastUsedServer = _.findLast(servers, function(server){
            return server.firstApp() == appType;
        });

        if(lastUsedServer) {
            return lastUsedServer;
        } else { //No apps was found
            return false;
        }
    };

    /**
     * Adds app to an available server, if there is room.
     * @param appType
     */
    var addApp = function(appType){
        var availableServer = getAvailableServer();
        if(!availableServer){
            swal({
                title: "Uh Oh... No room for new apps",
                text: "Looks like all servers are taken.\nTry adding more servers or removing some apps.",
                type: "error"
            });
            return false;
        }
        return availableServer.addApp(appType);
    };

    /**
     * Initialize  the app with 4 blank servers
     */
    self.servers = ko.observableArray([
        new BlankServer(),
        new BlankServer(),
        new BlankServer(),
        new BlankServer()
    ]);

    /**
     * Add server click listener
     */
    self.addServer = function(){
        if(self.servers().length >= 32) {
            swal({
                title: "Hmm...",
                text: "Let's keep it below 32 servers for demo purposes, shell we?" +
                    "\nTry removing some servers or apps instead!",
                type: "warning"
            });
            return true;
        }
        self.servers.push(new BlankServer());
    };


    /**
     * Destroy server click listener
     */
    self.destroyServer = function(){
        if(self.servers().length === 0) {
            swal({
                title: "Uh oh...",
                text: "There are no more servers to Destroy!\n Try adding more servers first.",
                type: "warning"
            });
            return true;
        }
        var server = self.servers.pop();

        if(server.getCount() > 0){ //Need to remove apps
            var apps = server.getApps();
            _.each(apps, function(app){
                addApp(app);
            });
        }

        return true;
    };

    /**
     * Add app click listener
     */
    self.addApp = function(vm, event){
        var appType = event.target.parentNode.id;
        return addApp(appType);

    };

    /**
     * Remove app click listener
     */
    self.removeApp = function(){
        var appType = event.target.parentNode.id;
        var lastUsedServerForApp = getLastUsedServerFor(appType);
        if(!lastUsedServerForApp){
            swal({
                title: "Uh Oh... No such app is running",
                text: "You tried to kill an app that is not currently running.\nTry running some apps first",
                type: "error"
            });
            return false;
        }
        return lastUsedServerForApp.removeApp(appType);
    };

};

ko.applyBindings(new ViewModel()); //Run knockout bindings