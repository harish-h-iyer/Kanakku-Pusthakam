var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var dateformat = require("dateformat");

app.use('/images', express.static('images'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
var Record = require("./models/records");
var Balance = require("./models/allBalances");
var Transfer = require("./models/transfers");
mongoose.connect("mongodb://localhost:27017/kanakkupusthakam", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    Record.find({}, function(err, allRecord){
        if(err){
            console.log(err);
        }
        else{
            Balance.findOne({}, function(err, allBalances){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(allBalances.cash);
                    res.render("first.ejs", {allBalances : allBalances, allRecord: allRecord});
                }
            });
        }
    });
});


app.get("/enterbalance", function(req, res){
    res.render("enterbalance.ejs");
});

app.post("/enterbalance", function(req, res){
    //find and update correct product

    var cash = parseInt(req.body.cash);
    var axis = parseInt(req.body.axis);
    var hsbc = parseInt(req.body.hsbc);
    var sbi = parseInt(req.body.sbi);
    var date =req.body.date;
    var gd = req.body.gd;
    var cash1, axis1, hsbc1, sbi1;

    var paidto = req.body.cash + "(C) " +req.body.axis + "(A) " +req.body.sbi + "(S) " +req.body.hsbc + "(H) "; 

    Balance.findOne({}, function(err, B){
        if(err){
            console.log(err);
        }else{
            //var cash = B.cash;
            cash1 = cash + B.cash;
            axis1 = axis + B.axis;
            hsbc1 = hsbc + B.hsbc;
            sbi1 = sbi + B.sbi;
            console.log(parseInt(cash1));

            var newBalance = {$set:{"cash":cash1, "axis":axis1, "hsbc":hsbc1, "sbi": sbi1}};

            Balance.findOneAndUpdate({"id": "1"}, newBalance, function(err, createdNew){
                if(err){
                    console.log(err);
                }else{
                    Balance.findOne({}, function(err, foundUpBal){
                        var newRecord1 =  {date:date, paid:paidto, from:gd, paidto:"Me", cash:foundUpBal.cash, axis: foundUpBal.axis, sbi: foundUpBal.sbi, hsbc:foundUpBal.hsbc};
                        Record.create(newRecord1, function(err, newlyCreated){
                            if(err){
                                console.log(err)
                            }
                            else{
                                res.redirect("/");
                            }
                        }); 
                    });
                }

            });
        }
    });
});




app.post("/record", function(req, res){

    var date = req.body.date;
    var paid = req.body.paid;
    var from = req.body.from;
    var paidto = req.body.paidto;

    if(req.body.from === ("Cash")){
       Balance.findOneAndUpdate({"id": "1"}, {$inc : {cash : -parseInt(paid)}}, function(err, updatedNew){
        if(err){
            console.log(err);
        }else{
        Balance.findOne({}, function(err, B){
            if(err){
                console.log(err);
            }else{
                //var cash = B.cash;
                if(paidto ===("Axis")){
                    var fromT = from + "(D)"
                    var tAxis = B.axis + parseInt(paid);
                    console.log(tAxis);
                    var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: tAxis, sbi: B.sbi, hsbc:B.hsbc};
                    Balance.findOneAndUpdate({"id" : "1"},{$inc :{ axis : parseInt(paid)}},function(){});
                }else if(paidto ===("SBI")){
                    var fromT = from + "(D)"
                    var tSbi = B.sbi + parseInt(paid);
                    console.log(tSbi);
                    var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: tSbi, hsbc:B.hsbc};
                    Balance.findOneAndUpdate({"id" : "1"},{$inc :{ sbi : parseInt(paid)}},function(){});
                }else if(paidto ===("HSBC")){
                    var fromT = from + "(D)"
                    var tHsbc = B.hsbc + parseInt(paid);
                    console.log(tHsbc);
                    var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:tHsbc};
                    Balance.findOneAndUpdate({"id" : "1"},{$inc :{ hsbc : parseInt(paid)}},function(){});
                }else{
                    var newRecord = {date:date, paid:paid, from:from, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                }   
                
                Record.create(newRecord, function(err, newlyCreated){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.redirect("/");
                    }
                });
            }
        });
        }
     });
    }else if(req.body.from === ("Axis")){
        Balance.findOneAndUpdate({"id": "1"}, {$inc : {axis : -parseInt(paid)}}, function(err, updatedNew){
         if(err){
             console.log(err);
         }else{
            Balance.findOne({}, function(err, B){
                if(err){
                    console.log(err);
                }else{
                    //var cash = B.cash;
                    if(paidto ===("Cash")){
                        var fromT = from + "(W)"
                        var tCash = B.cash + parseInt(paid);
                        console.log(tCash);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:tCash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ cash : parseInt(paid)}},function(){});
                    }else if(paidto ===("SBI")){
                        var fromT = from + "(T)"
                        var tSbi = B.sbi + parseInt(paid);
                        console.log(tSbi);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: tSbi, hsbc:B.hsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ sbi : parseInt(paid)}},function(){});
                    }else if(paidto ===("HSBC")){
                        var fromT = from + "(T)"
                        var tHsbc = B.hsbc + parseInt(paid);
                        console.log(tHsbc);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:tHsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ hsbc : parseInt(paid)}},function(){});
                    }else{
                        var newRecord = {date:date, paid:paid, from:from, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                    }
                    
                    Record.create(newRecord, function(err, newlyCreated){
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.redirect("/");
                        }
                    });
                }
            });
         }
      });
    }else if(req.body.from === ("SBI")){
        Balance.findOneAndUpdate({"id": "1"}, {$inc : {sbi : -parseInt(paid)}}, function(err, updatedNew){
         if(err){
             console.log(err);
         }else{
            Balance.findOne({}, function(err, B){
            if(err){
                console.log(err);
            }else{
            //var cash = B.cash;
            if(paidto ===("Cash")){
                var fromT = from + "(W)"
                var tCash = B.cash + parseInt(paid);
                console.log(tCash);
                var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:tCash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                Balance.findOneAndUpdate({"id" : "1"},{$inc :{ cash : parseInt(paid)}},function(){});
            }else if(paidto ===("Axis")){
                var fromT = from + "(T)"
                var tAxis = B.axis + parseInt(paid);
                console.log(tAxis);
                var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: tAxis, sbi: B.sbi, hsbc:B.hsbc};
                Balance.findOneAndUpdate({"id" : "1"},{$inc :{ axis : parseInt(paid)}},function(){});
            }else if(paidto ===("HSBC")){
                var fromT = from + "(T)"
                var tHsbc = B.hsbc + parseInt(paid);
                console.log(tHsbc);
                var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:tHsbc};
                Balance.findOneAndUpdate({"id" : "1"},{$inc :{ hsbc : parseInt(paid)}},function(){});
            }else{
                var newRecord = {date:date, paid:paid, from:from, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
            }
            
            Record.create(newRecord, function(err, newlyCreated){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect("/");
                }
            });
        }
    });
 }
});
}else if(req.body.from === ("HSBC")){
        Balance.findOneAndUpdate({"id": "1"}, {$inc : {hsbc : -parseInt(paid)}}, function(err, updatedNew){
         if(err){
             console.log(err);
         }else{
            Balance.findOne({}, function(err, B){
                if(err){
                    console.log(err);
                }else{
                    //var cash = B.cash;
                    if(paidto ===("Cash")){
                        var fromT = from + "(W)"
                        var tCash = B.cash + parseInt(paid);
                        console.log(tCash);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:tCash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ cash : parseInt(paid)}},function(){});
                    }else if(paidto ===("SBI")){
                        var fromT = from + "(T)"
                        var tSbi = B.sbi + parseInt(paid);
                        console.log(tSbi);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: B.axis, sbi: tSbi, hsbc:B.hsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ sbi : parseInt(paid)}},function(){});
                    }else if(paidto ===("Axis")){
                        var fromT = from + "(T)"
                        var tAxis = B.axis + parseInt(paid);
                        console.log(tAxis);
                        var newRecord = {date:date, paid:paid, from:fromT, paidto:paidto, cash:B.cash, axis: tAxis, sbi: B.sbi, hsbc:B.hsbc};
                        Balance.findOneAndUpdate({"id" : "1"},{$inc :{ axis : parseInt(paid)}},function(){});
                    }else{
                        var newRecord = {date:date, paid:paid, from:from, paidto:paidto, cash:B.cash, axis: B.axis, sbi: B.sbi, hsbc:B.hsbc};
                    }
                    
                    Record.create(newRecord, function(err, newlyCreated){
                        if(err){
                            console.log(err)
                        }
                        else{
                            res.redirect("/");
                        }
                    });
                }
            });
         }
      });
     }else{
        Balance.findOne({}, function(err, l){
            if(err){
                console.log(err);
            }else{
            var newRecord = {date:date, paid:paid, from:from, paidto:paidto, cash:l.cash, axis: l.axis, sbi: l.sbi, hsbc:l.hsbc};
            Record.create(newRecord, function(err, newlyCreated){
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect("/");
                }
            });
        }
}); 
     }
});


app.get("/records",function(req, res){
        Record.find({}, function(err, allRecord){
            if(err){
                console.log(err);
            }
            else{
                Balance.findOne({}, function(err, allBalancesa){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.render("records.ejs", {allBalances : allBalancesa, allRecord: allRecord});
                    }
                });
            }
        });
});

app.get("/transfer",function(req, res){
    Balance.findOne({}, function(err, allBalancess){
        if(err){
            console.log(err);
        }
        else{
            res.render("transfer.ejs", {allBalances : allBalancess});
        }
    });
});

app.listen(3000,'0.0.0.0', function(){
    console.log("KP server has started!");
});