<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/8ebc384b-93e5-427c-b842-a88a386b375a" />

# workflow-nodes

This repo contains nodes to help you get started building your own web3 workflows for [n8n](https://n8n.io). It includes the node linter and other dependencies.

## Demo

https://ethglobal.com/showcase/ascend-workflows-pw4jk

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
5. Browse the examples in `/workflow-nodes/nodes` and `/workflow-nodes/credentials`.

## More information

Refer to [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
