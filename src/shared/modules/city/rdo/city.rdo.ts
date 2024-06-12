import { Expose } from 'class-transformer';

export class CityRdo {
  @Expose()
  public name: string;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  @Expose()
  public zoom: number;
}
