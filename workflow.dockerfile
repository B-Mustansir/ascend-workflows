FROM n8nio/n8n:latest
USER root

ENV NODE_ENV=development

RUN npm install -g typescript gulp rimraf

ENV CUSTOM_EXTENSIONS="/home/node/n8n-custom-nodes"
RUN mkdir -p $CUSTOM_EXTENSIONS/node_modules

COPY ./workflow-nodes-starter $CUSTOM_EXTENSIONS/node_modules/workflow-nodes-starter

RUN cd $CUSTOM_EXTENSIONS/node_modules/workflow-nodes-starter && \
    npm install && \
    npm run build && \
    npm install gulp && \
    ls -la dist/

USER node