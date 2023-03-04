export interface ApiDetails {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

export function ApiDetailsFactory({
  name,
  version,
  description,
  author,
  license,
}: any): ApiDetails {
  return {
    name,
    version,
    description,
    author,
    license,
  };
}
