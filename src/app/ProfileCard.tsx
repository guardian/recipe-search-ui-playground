import { useEffect, useState } from 'react';
import { LookupProfileTag } from '../service/CapiService';
import { CapiProfileTag } from '../service/schema';
import { ResultCard } from './ResultCard';
import { Person3 } from '@mui/icons-material';

interface ProfileCardProps {
  profileId: string;
  onClick: (profile:CapiProfileTag)=>void;
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

  const maybeIcon = profile?.bylineImageUrl ? undefined : <Person3/>;

  return profile ?
      <ResultCard title={profile.webTitle} imageUrl={profile.bylineImageUrl} icon={maybeIcon} error={error} onClick={()=>onClick(profile)}/>
      : undefined
}