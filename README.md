	COMENZAMOS:  🚀

	npm init (y completamos con todos los parametros que necesitemos, "nombre","version",etc) 
	npm i express 
	npm i dotenv 
	npm i sequelize  
	npm i mysql2 --G 

##npm i sequelize-cli --D (Instalar en etapa de desarrollo, por eso la D)



##DENTRO DE LA RAIZ, VAMOS A CREAR ARCHIVOS CON LA SIGUIENTE EXTENSION:
	.gitignore (Pondremos los modulos de node que no queremos exportar "/node_modules/")
	.env
	.sequelizerc


##CREDENCIALES: .env (dotenv)

	DB_USERNAME= root
	DB_PASSWORD=
	DB_HOST= localhost
	DB_DATABASE=parcial_sequelize
	DB_PORT=3306
	DB_DIALECT=mysql


##BUSCAMOS LA DOCUMENTACION OFICIAL DE SEQUELIZE Y COMPLETAMOS CON LO SIGUIENTE EN EL ARCHIVO .sequelizerc

	const path = require('path')
	
	module.exports = {
	config: path.resolve('./src/database/config', 'config.js'),
	'models-path': path.resolve('./src/database/models'),
	'seeders-path': path.resolve('./src/database/seeders'),
	'migrations-path': path.resolve('./src/database/migrations'),
	}



##CREAMOS CARPETAS SRC Y PUBLIC

  En src creamos app.js
  En src creamos carpeta controller
  En src creamos carpeta routes

	En el package.json indicamos al app.js como main
	En el package.json se cambia el "test" por "dev"
	y en su interior colocamos: "nodemon src/app.js"

.............................................................................


##EN EL APP.JS PONEMOS: 

	const express = require('express');
	const app = express();
	const path = require('path');

  const PORT = process.env.PORT || 3000

  app.use(express.static(path.resolve(__dirname, '../public')));

  app.use(express.json())
  //URL encode  - Para que nos pueda llegar la información desde el formulario al req.body
  app.use(express.urlencoded({ extended: false }));

  app.use('/', (req, res) => res.json({ clave: "respuesta desde server" }));

  app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto' + PORT)
  }

  );

...........................................................................

##ESCRIBIREMOS sequelize init 
	esto ejecutara el contenido de .sequelizerc (se crean la carpeta database y su contenido)
	

...........................................................................

##INGRESAMOS A: src/database/config/config.js vamos a modificar todo
##Y COLOCAMOS LO SIGUIENTE:

	require('dotenv').config()

	module.exports =

	{

    	"username": process.env.DB_USERNAME,
    	"password": process.env.DB_PASSWORD,
   	 "database": process.env.DB_DATABASE,
   	 "host": process.env.DB_HOST,
    	"port": process.env.DB_PORT,
    	"dialect": process.env.DB_DIALECT,

    seederStorage: "sequelize",
    seederStorageTableName: "seeds",

    migrationStorage: "sequelize",
    migrationStorageTableName: "migrations"

}

...........................................................................

##Crear todos los modelos intervinientes
##IMPORTANTE VERIFICAR EL ORDEN DE EJECUCION
...........................................................................

	sequelize model:generate --name Brand --attributes name:string
	sequelize model:generate --name Category --attributes name:string
	sequelize model:generate --name Size --attributes centimeter:integer
	sequelize model:generate --name Gender --attributes type:string
	sequelize model:generate --name Payment --attributes type:string
	sequelize model:generate --name State --attributes description:string
	sequelize model:generate --name Address --attributes street:string,number:integer

	sequelize model:generate --name Product --attributes name:string,price:decimal,stock:integer,stock_min:integer,stock_max:integer,brands_id:integer,categories_id:integer,sizes_id:integer,genders_id:integer
	sequelize model:generate --name User --attributes first_name:string,last_name:string,username:string,email:string,password:string,addresses_id:integer

	sequelize model:generate --name Image --attributes name:string,products_id:integer
	sequelize model:generate --name Order --attributes number:integer,date:date,total:decimal,payments_id:integer,users_id:integer,user_addresses_id:integer,states_id:integer

	sequelize model:generate --name OrderDetail --attributes quantity:decimal,subtotal:decimal,products_id:integer,orders_id:integer
	sequelize model:generate --name Shipping --attributes street:string,number:integer,orders_id:integer

...........................................................................

##CREAMOS LAS RELACIONES NECESARIAS:  HasOne, BelongsTo, HasMany, BelongsToMany
##NO EXISTEN RELACIONES MUCHOS A MUCHOS, POR ENDE NO USAREMOS EL: BelongsToMany

...........................................................................
# --- DEFINIMOS LAS RELACIONES EN LOS MODELOS: ---

   static associate(models) {

      // belongsTo
      Product.belongsTo(models.Brand);
      // belongsTo
      Product.belongsTo(models.Category);
      // belongsTo
      Product.belongsTo(models.Size);
      // belongsTo
      Product.belongsTo(models.Gender);

      // hasMany
      Product.hasMany(models.Image, {
        foreignKey: 'products_id',
        as: "images"
      })

      // hasOne
      Product.hasOne(models.OrderDetail,{
        foreignKey: 'products_id',
        as: 'orderdetails'
      })
    }
...........................................................................
    static associate(models) {

      // hasMany
      Brand.hasMany(models.Product, {
        foreignKey: 'brands_id',
        as: "products"
      })
    }
...........................................................................
    static associate(models) {

      // hasMany
      Category.hasMany(models.Product, {
        foreignKey: 'categories_id',
        as: "products"
      })
    }
...........................................................................
    static associate(models) {

      // hasMany
      Size.hasMany(models.Product, {
        foreignKey: 'sizes_id',
        as: "products"
      })
    }
...........................................................................
    static associate(models) {

      // hasMany
      Gender.hasMany(models.Product, {
        foreignKey: 'genders_id',
        as: "products"
      })
    }
...........................................................................
    static associate(models) {

      // belongsTo
      Image.belongsTo(models.Product);
    }
...........................................................................
    static associate(models) {

      // belongsToOne
      OrderDetail.belongsTo(models.Product);

      // belongsTo
      OrderDetail.belongsTo(models.Order);
    }
...........................................................................
    static associate(models) {

      // belongsToOne
      Order.belongsTo(models.Payment);
      // belongsToOne
      Order.belongsTo(models.State);
      
      // belongsTo
      Order.belongsTo(models.User);

      // hasMany
      Order.hasMany(models.OrderDetail, {
        foreignKey: 'orders_id',
        as: "orderdetails"
      })

      // hasOne
      Order.hasOne(models.Shipping, {
        as: 'shippings',
        foreignKey: 'orders_id'
      })
    }
...........................................................................
    static associate(models) {

      // hasOne
      Payment.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'payments_id'
      })
    }
...........................................................................
    static associate(models) {

      // hasOne
      State.hasOne(models.Order, {
        as: 'orders',
        foreignKey: 'states_id'
      })
    }
...........................................................................
    static associate(models) {

      // hasMany
      User.hasMany(models.Order, {
        foreignKey: 'users_id',
        as: "orders"
      })

      // belongsToOne
      User.belongsTo(models.Address);
    }
...........................................................................
    static associate(models) {

      // belongsToOne
      Shipping.belongsTo(models.Order);
    }
...........................................................................
    static associate(models) {

      // hasOne
      Address.hasOne(models.User, {
        as: 'users',
        foreignKey: 'addresses_id'
      })
    }
...........................................................................

#Y LUEGO DE LOS MODELOS, SEGUIMOS CON LAS CLAVES FORANEAS EN LAS MIGRACIONES:

...........................................................................


🔧Product

      brands_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'brands',
          key: 'id'
        }
      },
      categories_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      sizes_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sizes',
          key: 'id'
        }
      },
      genders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'genders',
          key: 'id'
        }
      },
----------------------------------
🔧User

      addresses_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id'
        }
      },
----------------------------------
🔧Image

      products_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
----------------------------------
🔧Order

      payments_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payments',
          key: 'id'
        }
      },
      users_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      user_addresses_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'addresses_id'
        }
      },
      states_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'states',
          key: 'id'
        }
      },
----------------------------------
🔧OrderDetail

      products_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      orders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
----------------------------------
🔧Shipping

      orders_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
----------------------------------
#HACEMOS LA DEPURACION PARA VERIFICAR QUE NO TENGAMOS ERRORES:
	##EN CONSOLA: nodemon src/app
	
.....................................................


#MIGRAMOS HACIA LA BASE DE DATOS DESDE: .env(dotenv)
	##sequelize db:migrate
