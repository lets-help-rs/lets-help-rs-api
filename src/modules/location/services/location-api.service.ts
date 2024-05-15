import { Injectable } from '@nestjs/common';
import { BrazilianStates } from 'src/shared/domain/enums/brazilian-states.enum';
import fetch from 'node-fetch';

@Injectable()
export class LocationApiService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1';

  async findCitiesForState(stateId: BrazilianStates) {
    const requestPath = this.getCityQueryUrl(stateId);

    const agent = new (fetch as any).Agent({ rejectUnauthorized: false });

    return fetch(requestPath, { agent }).then((response) => response.json());
  }

  private getCityQueryUrl(stateId: BrazilianStates) {
    return `${this.baseUrl}/localidades/estados/${stateId}/municipios`;
  }
}
