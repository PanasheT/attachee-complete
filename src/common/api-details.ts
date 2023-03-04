export interface APIDetails {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
}

export function APIDetailsFactory({
  name,
  version,
  description,
  author,
  license,
}: any): APIDetails {
  return {
    name,
    version,
    description,
    author,
    license,
  };
}
