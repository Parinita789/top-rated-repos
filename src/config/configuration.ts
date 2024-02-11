import { readFileSync } from 'fs';
import * as yml from 'js-yaml';
import { join } from 'path';

const env = process.env.NODE_ENV || 'development';
let YML_CONFIG_FILE = `${env}.yml`;

if (process.env.NODE_ENV === 'test') {
  YML_CONFIG_FILE = `../../config/${env}.yml`;
}

export default () => {
  return yml.load(
    readFileSync(join(__dirname, YML_CONFIG_FILE), 'utf8')
  ) as Record<string, any>;
}