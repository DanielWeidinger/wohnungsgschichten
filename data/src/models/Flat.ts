export interface AdvertStatus {
  id: string;
  description: string;
  statusId: number;
}

export interface Attributes {
  attribute: any[];
}

export interface AdvertImageList {
  advertImage: any[];
}

export interface ContextLinkList {
  contextLink: any[];
}

export interface Child {
  id: string;
  verticalId: number;
  adTypeId: number;
  productId: number;
  advertStatus?: any;
  description?: any;
  attributes: Attributes;
  advertImageList: AdvertImageList;
  selfLink?: any;
  contextLinkList: ContextLinkList;
  advertiserInfo?: any;
  upsellingOrganisationLogo?: any;
  children?: any;
}

export interface Flat {
  id: string;
  lastCheck: Date;
  distance_tu: number;
  distance_wu: number;
  distance_tu_text: string;
  distance_wu_text: string;
  verticalId: number;
  adTypeId: number;
  productId: number;
  advertStatus: AdvertStatus;
  description: string;
  selfLink: string;
  upsellingOrganisationLogo: string;
  children: Child[];
  location: string;
  free_area_area_total: number;
  postcode: number;
  state: string;
  body_dyn: string;
  orgname: string;
  virtual_view_link: string;
  estate_size_living_area: number;
  district: string;
  heading: string;
  location_quality: number;
  floor: number;
  published: number;
  country: string;
  location_id: number;
  property_type: string;
  project_id: number;
  number_of_rooms: number;
  adtype_id: number;
  property_type_id: number;
  adid: number;
  orgid: number;
  seo_url: string;
  free_area_type: string;
  all_image_urls: string;
  published_string: Date;
  estate_preference: string;
  upselling_ad_searchresult: string;
  categorytreeids: number;
  rent_per_month_lettings: number;
  advertiser_ref: number;
  product_id: number;
  mmo: string;
  rooms: string;
  estate_size_useable_area: number;
  address: string;
  ad_searchresult_logo: string;
  coordinates: string;
  price: number;
  price_for_display: string;
  estate_size: number;
  isprivate: number;
  property_type_flat: string;
  unit_title: number;
  free_area_type_name: string;
  number_of_children: number;
}
