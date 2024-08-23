import { CapiProfileResponse, CapiProfileTag } from './schema';

const baseUrl = "https://content.guardianapis.com";
const apiKey = "test";

export async function LookupProfileTag(profile:string):Promise<CapiProfileTag> {
  if(!profile.startsWith("profile/")) {
    throw new Error(`${profile} is not a valid profile tag ID`)
  }

  const response = await fetch(baseUrl + "/" + profile + `?api-key=${apiKey}&page-size=0`);
  if(response.status===200) {
    const rawContent = await response.json();
    const content = CapiProfileResponse.parse(rawContent);
    return content.response.tag;
  } else {
    throw new Error(`Could not search: server error ${response.status}`);
  }
}