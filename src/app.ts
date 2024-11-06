import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import type { Writable } from 'node:stream';
import { App as CdktfApp } from 'cdktf';
import logger from './logger';
import type CustomerInfrastructure from './customerInfrastructure';

const CDKTF_STATE_DIRECTORY = '/tmp/cdktf.state';
const TF_PLUGIN_CACHE_DIR = process.env.TF_PLUGIN_CACHE_DIR || '/tmp/.terraform.d/plugin-cache';

const exec = (command: string) => new Promise<void>((resolve, reject) => {
  const [cmd, ...args] = command.split(' ');
  const child = spawn(cmd, args);
  child.stdout.pipe(process.stdout as Writable);
  child.stderr.pipe(process.stderr as Writable);

  child.on('close', (code) => {
    if (code === 0) resolve();
    else reject(new Error(`Terraform exited with status code ${code}`));
  });

  child.on('error', (err) => reject(err));
});

export class App extends CdktfApp {
  constructor(...args: any) {
    // These directories are not created automatically
    mkdirSync(CDKTF_STATE_DIRECTORY, { recursive: true });
    mkdirSync(TF_PLUGIN_CACHE_DIR, { recursive: true });
    super(args);
  }

  /**
   * A wrapper for Terraform Plan via the CDKTF CLI
   * @param infrastructure - The customer infrastructure to plan
   */
  public async plan(infrastructure: CustomerInfrastructure) {
    const stack = infrastructure.toString();
    logger.info(`CDKTF: Running Terraform plan on stack ${stack}`);

    try {
      this.synth();

      await exec(`npx cdktf diff ${stack} --skip-synth`);
      logger.info(`Terraform Plan executed on stack ${stack}.`);
    } catch (error: any) {
      logger.error(`Terraform Plan failed to execute on stack ${stack}.`);
      throw new Error(error);
    }
  }

  /**
   * A wrapper for Terraform Apply via the CDKTF CLI
   * @param infrastructure - The customer infrastructure to deploy
   */
  public async apply(infrastructure: CustomerInfrastructure) {
    const stack = infrastructure.toString();
    logger.info(`CDKTF: Running Terraform apply on stack ${stack}`);

    try {
      this.synth();

      await exec(`npx cdktf deploy --auto-approve ${stack} --skip-synth`);
      logger.info(`Terraform Apply executed on stack ${stack}.`);
    } catch (error: any) {
      logger.error(`Terraform Apply failed to execute on stack ${stack}.`);
      throw new Error(error);
    }
  }

  /**
   * A wrapper for Terraform Destroy stack
   * @param infrastructure - The customer infrastructure to destroy
   */
  public async destroy(infrastructure: CustomerInfrastructure) {
    const stack = infrastructure.toString();
    logger.info(`CDKTF: Running Terraform destroy on stack ${stack}`);

    try {
      this.synth();

      await exec(`npx cdktf destroy --auto-approve ${stack} --skip-synth`);
      logger.info(`Terraform Destroy executed on stack ${stack}.`);
    } catch (error: any) {
      logger.error(`Terraform Destroy failed to execute on stack ${stack}.`);
      throw new Error(error);
    }
  }
}

// We don't need more than one CDKTF app for our purposes, so just export a singleton
export default new App({ outdir: CDKTF_STATE_DIRECTORY });
