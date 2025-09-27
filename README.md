![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# workflow-nodes-starter

This repo contains nodes to help you get started building your own web3 workflows for [n8n](https://n8n.io). It includes the node linter and other dependencies.

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* [docker](https://www.docker.com/products/docker-desktop/)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).

## Using this starter

These are the basic steps for working with the starter.

1. Clone your new repo:
   ```
   git clone https://github.com/SanRishikesh7/Ascend-Workflows.git
   ```
2. Run `docker compose build workflow-editor` to build the docker image.
3. Run `docker compose up` to start and run your application.
4. Open the project in your editor.
5. Browse the examples in `/workflow-nodes-starter/nodes` and `/workflow-nodes-starter/credentials`.

## More information

Refer to [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
