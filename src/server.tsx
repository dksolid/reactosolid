import path from 'path';

import { runServer } from 'dk-bff-server';

import { env } from '../env';
import { paths } from '../paths';

process.title = 'node: bff-server';

const self = `'self'`;
const unsafeEval = `'unsafe-eval'`;
const unsafeInline = `'unsafe-inline'`;

void runServer({
  port: env.EXPRESS_PORT,
  https: env.HTTPS_BY_NODE,
  templatePath: path.resolve(paths.build, 'template.html'),
  template500Path: path.resolve(paths.build, 'error500.html'),
  staticFilesPath: paths.build,
  versionIdentifier: 'local',
  compressedFilesGenerated: env.GENERATE_COMPRESSED,
  templateModifier: ({ template, req }) => {
    return Promise.resolve().then(() => {
      const hotReloadUrl = `${env.HTTPS_BY_NODE ? 'https' : 'http'}://${
        req.headers.host?.split(':')[0]
      }:${env.HOT_RELOAD_PORT}`;

      return template.replace(
        '<!-- HOT_RELOAD -->',
        env.HOT_RELOAD ? `<script src="${hotReloadUrl}"></script>` : ''
      );
    });
  },
  helmetOptions: {
    crossOriginOpenerPolicy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [self],
        childSrc: [self],
        styleSrc: [self, unsafeInline],
        scriptSrc: [
          self,
          unsafeEval,
          unsafeInline,
          env.HOT_RELOAD ? `localhost:${env.HOT_RELOAD_PORT}` : '',
        ],
        fontSrc: [self, `data:`],
        objectSrc: [self],
        connectSrc: [self, `ws:`],
        imgSrc: [self, `data:`, `blob:`],
        frameSrc: [self],
        mediaSrc: [self],
        formAction: [],
      },
      reportOnly: false,
    },
  },
});
