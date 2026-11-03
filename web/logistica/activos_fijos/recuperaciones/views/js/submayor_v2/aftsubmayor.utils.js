Log.aft.submayor_v2.Utils = {
    toPromise: function(obj){
        if(obj instanceof Promise){
            return obj;
        }else{
            return new Promise(function(fulfill, reject){
                fulfill(obj);
            });
        }
    }
};