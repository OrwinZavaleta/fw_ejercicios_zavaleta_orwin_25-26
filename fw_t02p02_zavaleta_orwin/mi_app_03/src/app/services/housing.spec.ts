import { TestBed } from '@angular/core/testing';
import { Housing } from './housing';
import { HousingLocationInfo } from '../interfaces/housinglocation';

describe('Housing', () => {
  //Declaramos variables que vamos a usar en cada test
  //y que no son necesario re-crear en cada test

  let service: Housing;

  // Helper: crea una Response “fake” mínima para fetch
  // fetch() devuelve un objeto Response que distintos campos
  // Aquí estamos construyendo una versión mínima simulada
  function mockFetchResponse<T>(opts: { ok?: boolean; status?: number; json: T }) {
    const { ok = true, status = 200, json } = opts;

    return {
      ok,
      status,
      json: vi.fn().mockResolvedValue(json),
    } as unknown as Response;
  } //mockResolvedValue simula una promesa resuelta

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Housing],
    });

    service = TestBed.inject(Housing);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    //Muy importante en tests con mocks:
    //Restauramos todos los spies después de cada test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(Housing);
  });

  it('getAllHousingLocations() should return locations from fetch().json()', async () => {
    const locationsFake: HousingLocationInfo[] = [
      { id: 1, name: 'House 1' } as any,
      { id: 2, name: 'House 2' } as any,
    ];

    //estamos reemplazando un fetch REAL por uno simulado.
    //globalThis.fetch = la función fetch nativa del navegador

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockFetchResponse({ json: locationsFake }));

    const result = await service.getAllHousingLocations();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(locationsFake);
  });

  it('getAllHousingLocations() should return [] when json is null/undefined', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse<{ whatever: string } | null>({
        json: null,
      }),
    );

    const result = await service.getAllHousingLocations();

    expect(result).toEqual([]);
  });
  it('getAllHousingLocations() should throw error when fetch fails', async () => {
    // Simular error de red
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    await expect(service.getAllHousingLocations()).rejects.toThrow('Network error');
  });

  it('getHousingLocationById() should call fetch with ?id= and return first element', async () => {
    const id = 7;
    const apiResult: HousingLocationInfo[] = [{ id, name: 'Only one' } as any];

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockFetchResponse({ json: apiResult }));

    const result = await service.getHousingLocationById(id);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0][0])).toContain(`?id=${id}`);
    //calls: Es un array que guarda TODAS las llamadas al spy.
    //fetchSpy.mock.calls[0][0] = primer argumento de la primera llamada

    expect(result).toEqual(apiResult[0]);
  });

  it('getHousingLocationById() should return {} when API returns empty array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse<HousingLocationInfo[]>({ json: [] }),
    );

    const result = await service.getHousingLocationById(999);

    expect(result).toEqual({});
  });

  it('getHousingLocationById() should build URL with id parameter', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockFetchResponse({ json: [] }));

    await service.getHousingLocationById(42);

    expect(fetchSpy).toHaveBeenCalledWith('https://dwec-fw-gp.vercel.app/api/houses?id=42');
  });

  it('getAllHousingLocations2() should return [] when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse({
        ok: false,
        status: 500,
        json: null,
      }),
    );

    const result = await service.getAllHousingLocations();

    expect(result).toEqual([]);
  });
});
