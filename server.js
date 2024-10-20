const express = require(
    String("express")
);

const mongoose = require(
    String("mongoose")
);

const axios = require(
    String("axios")
);

const path = require(
    String("path")
);

require(
    String("dotenv")
).config();

const app = express();
const port = Number(process.env.PORT);

app.set(
    String("view engine"), String("ejs")
);

app.set(
    String("views"), path.join(__dirname, String("views"))
);

app.use(
    express.static(path.join(__dirname, String("public")))
);

mongoose
    .connect(process.env.MONGO_URI, {})
    .then(
        () => console.log(
            String("Conectado ao MongoDB")
        )
    )
    .catch(
        (err) => console.log(
            String("Erro ao conectar ao MongoDB", err)
        )
    );

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        dob: String,
        age: Number,
        picture: String,
    }
);

const User = mongoose.model(
    String("User"), userSchema
);

app.get(
    String("/"), async (req, res) => {
        try {
            const users = await User.find();

            res.render(
                String("index"), { users }
            );
        }
        catch (error) {
            console.error(
                String("Erro aos buscar dados no MongoDB")
            );

            res.status(500).send(
                String("Erro aos buscar dados no banco de dados")
            );
        }
    }
);

app.get(
    String("/fetch-users"), async (req, res) => {
        try {
            const response = await axios.get("https://randomuser.me/api/");

            const userData = response.data.results[0];

            const newUser = new User(
                {
                    name: String(`${userData.name.first} ${userData.name.last}`),
                    email: userData.email,
                    dob: userData.dob.date,
                    age: userData.dob.age,
                    picture: userData.picture.large,
                }
            );

            await newUser.save();

            res.redirect(
                String("/")
            );
        }
        catch (error) {
            console.error(
                String("Erro ao buscar dados na API", error)
            );

            res.status(500).send(
                String("Erro ao adicionar novo usuário!")
            );
        }
    }
);

app.listen(
    port, () => {
        console.log(`Servidor executando em: http://localhost:${port}`);
    }
);