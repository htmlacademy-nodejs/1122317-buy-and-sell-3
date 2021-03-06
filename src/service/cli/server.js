'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const routes = require(`../api`);

const {
  HttpCode,
  API_PREFIX
} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_PATH = `./src/service/mocks.json`;

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_PATH);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.send(`[]`);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }
        return console.info(chalk.green(`Ожидаю соединений на порту ${port}`));
      });
    } catch (err) {
      console.error(`Ошибка при создании сервера`, err);
      process.exit(1);
    }
  }
};
