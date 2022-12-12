# github-as-a-database

A Node.js API server that uses GitHub as a database. This project demonstrates how to use GitHub as a database for storing and retrieving data in JSON files.

## Getting Started

To get started, you will need to have a GitHub account and a personal access token with the appropriate permissions to access your repository.

You can then use the GitHub API to retrieve, create, update, and delete data in JSON files in your repository.

## Prerequisites

Before you get started, make sure you have the following tools installed on your machine:

- [Git](https://git-scm.com/): A version control system that is used to clone the repository and track changes to the codebase.
- [Node.js](https://nodejs.org/en/): A JavaScript runtime environment for building server-side applications.
- [Typescript](https://www.typescriptlang.org/): A typed superset of JavaScript that can be used to develop JavaScript applications, including those built with Node.js.
- [Express.js](https://expressjs.com/): A fast, lightweight, and flexible web application framework for Node.js that provides a wide range of features to help you build web applications quickly and easily.

You will also need an editor to modify the code. Some popular options include [Visual Studio Code](https://code.visualstudio.com/), [Sublime Text](https://www.sublimetext.com/), and [Atom](https://atom.io/).

## Installation

1. Clone the [repository](https://github.com/beratiyilik/github-as-a-database)
2. Run `npm install` to install dependencies

## Configuration

Copy the `.env.example` file to `.env` and fill in the necessary environment variables.

Do not forget to set these environment variables

- PORT = 3000
- LOG_FORMAT = dev
- LOG_DIR = ../logs
- ORIGIN = *
- CREDENTIALS = true
- GITHUB_PERSONAL_ACCESS_TOKEN = 
- GITHUB_OWNER =
- GITHUB_REPO =

## Usage

TODO: Describe the API and how to use it.

## Running the server

Run `npm run dev` to start the server.

## Endpoints

TODO: List the endpoints and their functions

## Tips and Considerations

- Git is a version control system, so it is designed for storing and managing code and text-based files, not binary data.
- GitHub has a rate limit on the number of API requests that can be made in a certain period of time. You will need to be mindful of this rate limit and design your application to avoid making too many requests.
- When modifying data in a JSON file, you will need to retrieve the file, make the desired changes, and then commit and push the changes back to the repository.

## Contributing

We welcome contributions to this project. If you are interested in contributing, please follow these guidelines:

1. Fork the repository.
2. Make your changes in a new branch.
3. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
