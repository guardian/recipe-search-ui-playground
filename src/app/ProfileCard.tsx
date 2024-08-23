import { useEffect, useState } from 'react';
import { LookupProfileTag } from '../service/CapiService';
import { CapiProfileTag } from '../service/schema';
import { ResultCard } from './ResultCard';

interface ProfileCardProps {
  profileId: string;
  onClick: ()=>void;
}

export const ProfileCard = ({profileId, onClick}:ProfileCardProps) => {
  const [profile, setProfile] = useState<CapiProfileTag|undefined>();
  const [error, setError] = useState<string|undefined>();

  useEffect(()=>{
    setError(undefined);
    LookupProfileTag(profileId)
      .then(setProfile)
      .catch((err:Error)=>setError(err.toString()))
  }, [profileId]);

  console.log(`ProfileCard: ${profileId}`);

  console.log(profile);
  console.log(error);

  return profile ?
      <ResultCard title={profile.webTitle} imageUrl={profile.bylineImageUrl} error={error} onClick={onClick}/>
      : undefined
}