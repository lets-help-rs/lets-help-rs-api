import { Injectable } from '@nestjs/common';
import { BrazilianStates } from 'src/shared/domain/enums/brazilian-states.enum';
import axios from 'axios';

@Injectable()
export class LocationApiService {
  private baseUrl = 'https://servicodados.ibge.gov.br/api/v1';

  async findCitiesForState(stateId: BrazilianStates) {
    const requestPath = this.getCityQueryUrl(stateId);

    const axiosConfig = {
      httpsAgent: { rejectUnauthorized: false },
    };

    const response = await axios.get(requestPath, axiosConfig);

    return response.data;
  }

  private getCityQueryUrl(stateId: BrazilianStates) {
    return `${this.baseUrl}/localidades/estados/${stateId}/municipios`;
  }
}
