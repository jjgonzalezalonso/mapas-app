export interface PlacesResponse {
    type:        string;
    query:       string[];
    features:    Feature[];
    attribution: string;
}

export interface Feature {
    id:            string;
    type:          string;
    place_type:    string[];
    relevance:     number;
    properties:    Properties;
    text_es:       string;
    language_es?:  ShortCodeEnum;
    place_name_es: string;
    text:          string;
    language?:     ShortCodeEnum;
    place_name:    string;
    bbox?:         number[];
    center:        number[];
    geometry:      Geometry;
    context:       Context[];
}

export interface Context {
    id:           string;
    mapbox_id:    string;
    wikidata?:    string;
    short_code?:  ShortCodeEnum;
    text_es:      string;
    language_es?: PurpleLanguage;
    text:         string;
    language?:    PurpleLanguage;
}

export enum PurpleLanguage {
    Es = "es",
    Fr = "fr",
}

export enum ShortCodeEnum {
    Es = "es",
    EsBI = "ES-BI",
}

export interface Geometry {
    type:        string;
    coordinates: number[];
}

export interface Properties {
    mapbox_id?: string;
    wikidata?:  string;
    accuracy?:  string;
}
