/* eslint-disable @typescript-eslint/no-explicit-any */
import { Divider } from '@mui/material'

const ProfileFildCard = ({ value, keys }: any) => {
  return (
    <div className='p-4 lg:p-5 flex items-center bg-[#16161D] hover:bg-[#1C1C24] transition-colors'>
      <p className='w-28 sm:w-36 lg:w-48 pr-4 text-[#A0A0A9] text-sm lg:text-base font-medium tracking-wide shrink-0'>{keys}</p>
      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <p className='pl-4 lg:pl-8 font-semibold text-sm sm:text-base lg:text-lg text-[#F5F5F7] tracking-wide break-all'>
        {value ? value : <span className="text-[#52525B] font-normal italic">Not provided</span>}
      </p>
    </div>
  )
}

export default ProfileFildCard