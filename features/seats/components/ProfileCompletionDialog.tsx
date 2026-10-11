'use client';

import PersonalInformation from '@/features/account/components/composites/PersonalInformation';
import PopupWrapper from '@/features/common/components/primitives/PopupWrapper';
import { useFilterOptions } from '@/features/sessions/hook/use-filter-options';

interface ProfileCompletionDialogProps {
  onClose: () => void;
}

const ProfileCompletionDialog = ({ onClose }: ProfileCompletionDialogProps) => {
  const { data } = useFilterOptions();

  return (
    <PopupWrapper onClose={onClose}>
      <h2 className="pr-8 text-[22px] font-bold text-white">
        Complete your profile
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-[#A9A9A9]">
        Add your details to continue selecting seats.
      </p>
      <div className="mt-6">
        <PersonalInformation
          venues={data?.venues.map(({ id, name }) => ({ id, name })) ?? []}
        />
      </div>
    </PopupWrapper>
  );
};

export default ProfileCompletionDialog;
