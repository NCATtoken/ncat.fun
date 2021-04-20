// Angular Modules
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


export class QueryStringParameters {
    private paramsAndValues: string[];
    constructor() {
        this.paramsAndValues = [];
    }
    public push(key: string, value: any): void {
        value = encodeURIComponent(value.toString());
        this.paramsAndValues.push([key, value].join('='));
    }
    public toString = (): string => this.paramsAndValues.join('&');
}

class UrlBuilder {
    public url: string;
    public queryString: QueryStringParameters;
    constructor(
        private baseUrl: string,
        private action: string,
        queryString?: QueryStringParameters
    ) {
        this.url = [baseUrl, action].join('/');
        this.queryString = queryString || new QueryStringParameters();
    }
    public toString(): string {
        const qs: string = this.queryString ?
            this.queryString.toString() : '';
        return qs ? `${this.url}?${qs}` : this.url;
    }
}

@Injectable()
export class ApiHttpService {
    constructor(
        private http: HttpClient
    ) { }
    public get(url: string, options?: any) {
        return this.http.get(url, options);
    }
    public post(url: string, data: any, options?: any) {
        return this.http.post(url, data, options);
    }
    public put(url: string, data: any, options?: any) {
        return this.http.put(url, data, options);
    }
    public delete(url: string, options?: any) {
        return this.http.delete(url, options);
    }

    // URL
    public createUrl(action: string): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiBaseurl,
            action
        );
        return urlBuilder.toString();
    }
    // URL WITH QUERY PARAMS
    public createUrlWithQueryParameters(
        action: string,
        queryStringHandler?:
            (queryStringParameters: QueryStringParameters) => void
    ): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiBaseurl,
            action
        );
        // Push extra query string params
        if (queryStringHandler) {
            queryStringHandler(urlBuilder.queryString);
        }
        return urlBuilder.toString();
    }

    // URL WITH PATH VARIABLES
    public createUrlWithPathVariables(
        action: string,
        pathVariables: any[] = []
    ): string {
        let encodedPathVariablesUrl = '';
        // Push extra path variables
        for (const pathVariable of pathVariables) {
            if (pathVariable !== null) {
                encodedPathVariablesUrl +=
                    `/${encodeURIComponent(pathVariable.toString())}`;
            }
        }
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiBaseurl,
            `${action}${encodedPathVariablesUrl}`
        );
        return urlBuilder.toString();
    }
}
