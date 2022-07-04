import { Injectable } from '@nestjs/common';
import * as StellarSdk from 'stellar-sdk';
import * as fs from 'fs';
import * as TOMLParser from '@iarna/toml';
import { writeFileSyncRecursive } from 'src/common/helper/command.helper';

@Injectable()
export class StellarService {
  private readonly sdk = StellarSdk;
  private readonly server = new StellarSdk.Server(
    'https://horizon-testnet.stellar.org',
  );

  public genSeed() {
    return StellarSdk.Keypair.random();
  }

  public defaultConfigFile() {
    const file = fs.readFileSync('./stellar/stellar-core.cfg');

    return TOMLParser.parse(file.toString());
  }

  public rewriteConfigFile(title: string, config: { [key: string]: any }) {
    const file = fs.readFileSync('./stellar/stellar-core.cfg');

    const parsed = TOMLParser.parse(file.toString());

    Object.keys(config).forEach((key) => {
      parsed[key] = config[key];
    });

    writeFileSyncRecursive(
      `./stellar/${title}/stellar-core.cfg`,
      TOMLParser.stringify(parsed),
    );
  }
}
