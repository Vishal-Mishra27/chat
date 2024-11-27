import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info';
import NewDm from './components/new-dm';
import apiClient from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTES  } from '@/utils/constants';
import { useAppStore } from '@/stores';
import ContactList from '@/components/contact-list'

export default function ContactsContainer() {

  const {setdirectMessagesContacts,directMessagesContacts}=useAppStore()

  useEffect(()=>{
    const  getContacts =async ()=>{
      const response= await apiClient.get(GET_DM_CONTACTS_ROUTES,{
        withCredentials:true,
      })
      if(response.data.contacts){
        console.log(response.data.contacts)
        setdirectMessagesContacts(response.data.contacts);
      }
    }
    getContacts();
  },[])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages"></Title>
          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels"></Title>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}




// const Logo = () => {
//   return (
//     <div className="flex p-0 justify-start items-center gap-2">
//       {/* Replace the SVG with an image tag for your new logo */}
//       <img
//         src="chatAppLogo2.jpg"
//         alt="New Logo"
//         // width="78"
//         // height="32"
//         className="w-40 h-40"
//       />
//       <div className="flex flex-col mb-7">
//         <span className="text-4xl font-semibold">Chat</span>
//         <span className="text-2xl font-semibold">Friendly</span>
//       </div>
//     </div>
//   );
// };


const Logo = () => {
  return (
    <div className="flex p-0 justify-start items-center gap-4">
      {/* Logo image with circular styling and visual effects */}
      <img
        src="chatAppLogo2.jpg"
        alt="New Logo"
        className="w-24 h-24 rounded-full border-4 border-[#8417ff] shadow-lg object-cover" // Make image circular with a border
      />
      <div className="flex flex-col mb-7">
        <span className="text-4xl font-semibold text-[#1c1d25]">Chat</span>
        <span className="text-2xl font-semibold text-[#8417ff]">Friendly</span>
      </div>
    </div>
  );
};


const Title=({text})=>{
  return(
    <h6 className='uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm'>
      {text}
    </h6>
  )
}