var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://pxbbokwozifjgf:b1fed072049e91cbb43e715e79986591d52e2a1c2fdf7d542cafb121eda1ede2@ec2-54-243-147-162.compute-1.amazonaws.com:5432/d2gohfsvsd43rm?ssl=true')
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', function (request, response) {
//     response.send('<h1>Hello, Express.js<h1>');
// });

// app.get('/test', function (request, response) {
//     response.send('<h1>Test</h1>');
// });

// app.use(express.static('static'));


app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('pages/index');
});
app.get('/index', function (req, res) {
    res.render('pages/index');
});
app.get('/about', function (req, res) {
    var name = 'Chootigarn Tanapibalwongsa';
    var hobbies = ['Music', 'Movie', 'Programing'];
    var dob = '10/10/1997';
    res.render('pages/about', { fullname: name, hobbies: hobbies, dob: dob });
});
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id = ' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//display products
app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id =" + pid;
    db.any(sql)
        .then(function (data) {
            //console.log('DATA:'+data);
            res.render('pages/product_edit', { product: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })


});
//add new product
app.get('/addnewproduct', function (req, res) {
    res.render('pages/addnew');
});


app.post('/products/addnewproduct', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `INSERT INTO products (id, title, price)
    VALUES ('${id}', '${title}', '${price}')`;
    //db.none 
    console.log('UPDATE:' + sql);
    db.query(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})

// update product
app.post('/products/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products 
    set title =  '${title}' , price = '${price}'
    where id = '${id}'`;

    //db.none 
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})

// delete product
app.get('/prodelete/:id', function (req, res) {

    var id = req.params.id;
    var sql = 'DELETE FROM products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.redirect('/products')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

})


/////USER////
app.get('/user', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' where id = ' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/user', { usesr: data });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

//display products
app.get('/user/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from users where id =" + pid;
    db.any(sql)
        .then(function (data) {
            //console.log('DATA:'+data);
            res.render('pages/', { product: data[0] });
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })


});








// app.get('/creat_at', function (request, response) {
// var time = moment().format('mm/dd/yyyy');
// response.render('pages/update', { time: time });
//  });

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});



