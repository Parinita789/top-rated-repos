import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpRequestService {
  private logger = new Logger(HttpRequestService.name);

  constructor(
    private readonly httpService: HttpService
  ) {}

  /**
   * Performs a generic GET request.
   * @param url The URL of the endpoint.
   * @param options Optional request options (e.g., headers, params).
   * @returns An Observable of the response data or an error.
  */
  async get<T>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = firstValueFrom(this.httpService.get<T>(url, options));
      return response;
    } catch (err) {
      this.logger.error(`error while making HTTP request, ${err}`)
      throw err;
    }
  }
}

