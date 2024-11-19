import { Intro, ProfileDetail } from '@/components'
import React from 'react'
import { ProfessionalsDetails } from '@/utils/ProfessionalsDetails'
import { useParams } from 'react-router-dom';

function ProfessionalsProfile() {
  const { id: param_id } = useParams();
  const professional = ProfessionalsDetails.find((user) => user.userId === param_id);
  return (
    <>
      <div className='grid sm:grid-cols-12 '>
        <div className="sm:col-span-12">
          <Intro
            image={professional.profile.image}
            name={professional.profile.name}
            fullTitle={professional.profile.fullTitle}
            role={professional.profile.role}
            specialty={professional.profile.specialty}
            expertise={professional.profile.expertise}
          />
        </div>
        <div className='sm:col-span-12'>
          <ProfileDetail
            expertise={professional.profile.expertise}
            education={professional.profile.education}
            highlights={professional.profile.highlights}
            experience={professional.profile.experience}
            educationDetails={professional.profile.educationDetails}
            organizationName={professional.organization.name}
            organizationDescription={professional.organization.description}
            editorialProcess={professional.organization.editorialProcess}
          />
        </div>
      </div>
    </>
  );
}

export default ProfessionalsProfile;
