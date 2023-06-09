const mongoose = require("mongoose");
const express = require("express");
const multer = require('multer');
const cors = require("cors");
const { copyFileSync } = require("fs");
const { Console } = require("console");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
	destination: 'public/images',
	filename: (req, file, cb) => {
		return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
	}
})
const upload = multer({ storage: storage });

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	profilePicture: String,
	businessName: String,
	businessAddress: String,
	address: String,
	name: String,
	distributionHub: String,
	type: String,
});

const productSchema = new mongoose.Schema({
	name: String,
	price: Number,
	image: String,
	description: String,
	vendor: String,
	distributionHub: String,
});

const distributionHubSchema = new mongoose.Schema({
	name: String,
	address: String,
});

const orderSchema = new mongoose.Schema({
	ordererName: String,
	ordererAddress: String,
	productList: String,
	activity: String,
	hubName: String,
});

const uri =
	"mongodb+srv://quynguyen:xfqM6RcvtWw22Ozf@lazadaclone.cqg5ikw.mongodb.net/lazadaWebsite?retryWrites=true&w=majority";

mongoose
	.connect(uri)
	.then(() => {
		console.log("Connect to database successful");
	})
	.catch((error) => {
		console.log(error.message);
	});

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use('/image', express.static('public/images'))


const Product = mongoose.model("products", productSchema);
const Account = mongoose.model("accounts", userSchema);
const Hubs = mongoose.model("distributionHubs", distributionHubSchema);
const Order = mongoose.model("orders", orderSchema);


module.exports = { Account };
module.exports = { Hubs };
module.exports = { Product };
module.exports = { Order };

// -----------------------Product-----------------------
// READ - Find all product
app.get("/products", (req, res) => {
	// console.log(data)
	Product.find()
		.then((product) => {
			res.send(product);
		})
		.catch((error) => {
			console.log(error.message);
		});
});

// READ - Find product and sort by descending price
app.get('/products/descending', (req, res) => {
	Product.find()
		.sort({ price: 'descending' })
		.then((product) => {
			res.send(product)
		})
		.catch((error) => {
			console.log(error.message)
		})
})

// READ - Find product and sort by ascending price
app.get('/products/ascending', (req, res) => {
	Product.find()
		.sort({ price: 'ascending' })
		.then((product) => {
			res.send(product)
		})
		.catch((error) => {
			console.log(error.message)
		})
})

// READ - Find product by id
app.get('/products/:id', (req, res) => {
	Product.findById(req.params.id)
		.then((product) => {
			dataProduct = product
			if (!product) {
				return res.send("Cannot found that ID!");
			}
			res.send(product);
		})
		.catch((error) => res.send(error));
});

// READ - Find product by vendor
app.get('/products/vendor/:id', (req, res) => {
	Product.find({ 'vendor': req.params.id })
		.then((product) => {
			if (!product) {
				return res.send("Cannot found that ID!");
			}
			res.send(product);
		})
		.catch((error) => res.send(error));
});

// CREATE - Create a new product
app.post("/products", upload.single('image'), (req, res) => {

	const product = new Product(req.body);
	product.image = `http://localhost:3000/image/${req.file.filename}`
	product
		.save()
		.then(() => res.redirect("http://127.0.0.1:5500/vendor.html"))
		.catch((error) => res.send(error));
});

// -----------------------Account-----------------------
// READ - Find all accounts
app.get("/accounts", (req, res) => {
	// console.log(data)
	Account.find()
		.then((accounts) => {
			res.send(accounts);
		})
		.catch((error) => {
			console.log(error.message);
		});
});

// READ - Find accounts by username
app.get("/accounts/findUsername/:id", (req, res) => {
	// console.log(data)
	Account.find({ 'username': req.params.id })
		.then((accounts) => {
			if (!accounts) {
				res.send("Cannot found that ID!");
			}
			res.send(accounts);
		})
		.catch((error) => {
			console.log(error.message);
		});
});

// READ - Find accounts by id
app.get("/accounts/:id", (req, res) => {
	Account.findById(req.params.id)
		.then((account) => {
			if (!account) {
				return res.send("Cannot found that ID!");
			}
			res.send(account);
		})
		.catch((error) => res.send(error));
});

// CREATE - Create a new account
app.post("/accounts", upload.single('image'), (req, res) => {
	const account = new Account(req.body);
	account.profilePicture = `http://localhost:3000/image/${req.file.filename}`
	account
		.save()
		.then(() => res.redirect("http://127.0.0.1:5500/accounts.html"))
		.catch((error) => res.send(error));
});

// UPDATE - Update an account by id
app.get("/accounts/:id/update", (req, res) => {
	Account.findById(req.params.id)
		.then((account) => {
			res.send(account);
		})
		.catch((error) => res.send(error));
});

// UPDATE - Update an account by id
app.post('/accounts/:id/update', (req, res) => {
	Account.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, })
		.then(account => {
			account.profilePicture = `http://localhost:3000/image/${req.file.filename}`
			if (!account) {
				return res.send('Not found any product matching the ID!');
			}
			res.redirect('http://127.0.0.1:5500/myAccount.html');
		})
		.catch(error => res.send(error));
});

// -----------------------Distribution Hub-----------------------
// READ - Find all distribution hubs
app.get("/distributionHubs", (req, res) => {
	// console.log(dataHubs)
	Hubs.find()
		.then((hubs) => {
			res.send(hubs);
		})
		.catch((error) => {
			console.log(error.message);
		});
});

// -----------------------Order-----------------------
// READ - Find all orders
app.get("/orders", (req, res) => {
	Order.find()
		.then((orders) => {
			res.send(orders);
		})
		.catch((error) => {
			console.log(error.message);
		});
});

// READ - Find order by id
app.get("/orders/:id", (req, res) => {
	Order.findById(req.params.id)
		.then((order) => {
			if (!order) {
				return res.send("Cannot found that ID!");
			}
			res.send(order);
		})
		.catch((error) => res.send(error));
});

// CREATE -Create a new order
app.post("/orders", (req, res) => {
	const order = new Order(req.body);
	// console.log(req.body);
	order
		.save()
		.then((order) => {
			res.redirect('http://127.0.0.1:5500/customer.html');
		})
		.catch((error) => res.send(error));
});

// UPDATE - Show update product form
app.get("/orders/:id/update", (req, res) => {
	Order.findById(req.params.id)
		.then((order) => {
			res.send(order);
		})
		.catch((error) => res.send(error));
});

app.post("/orders/:id/update", (req, res) => {
	Order.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
		.then((order) => {
			if (!order) {
				return res.send("Not found any product matching the ID!");
			}

			res.redirect('http://127.0.0.1:5500/shipper.html');
		})
		.catch((error) => res.send(error));
});

// ------------- Loading image file to the mongodb -------------


// Start server
app.listen(3000, () => {
	console.log("Server started on port 3000");
});
