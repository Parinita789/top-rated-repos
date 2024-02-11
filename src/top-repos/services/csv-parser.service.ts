import { EOL } from 'os';
import { parseString } from '@fast-csv/parse';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CSVParserService {
  private logger = new Logger(CSVParserService.name);

  /**
   * Parse a csv string.
   * @param csvData the data to be parsed.
   * @returns An array of parsed RepoData.
  */
  public async parseCsv(csvData: string): Promise<RepoData[]> {
    const csvString: string = [csvData].join(EOL);
    return new Promise((resolve, reject) => {
      const parser = parseString<RepoData, RepoData>(csvString, { headers: true });
      parser.on('error', (error: Error, rowNumber: number) => {
        this.logger.error(`Error parsing row ${rowNumber}: ${error.message}`);
        reject(error);
      });
  
      const parsedData: RepoData[] = [];
      parser.on('data', (row: RepoData) => {
        parsedData.push(row);
      });
  
      parser.on('end', (rowCount: number) => {
        this.logger.log(`Successfully parsed ${rowCount} rows`);
        resolve(parsedData);
      });
    })
  }
}
