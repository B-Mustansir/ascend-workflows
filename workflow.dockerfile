FROM n8nio/n8n:latest
USER root

ENV NODE_ENV=development

RUN npm install -g typescript gulp rimraf

ENV N8N_CUSTOM_EXTENSIONS="/home/node/n8n-custom-nodes"
RUN mkdir -p $N8N_CUSTOM_EXTENSIONS/node_modules

COPY ./workflow-nodes $N8N_CUSTOM_EXTENSIONS/node_modules/workflow-nodes

RUN cd $N8N_CUSTOM_EXTENSIONS/node_modules/workflow-nodes && \
    npm install && \
    npm run build && \
    npm install gulp && \
    ls -la dist/

USER node