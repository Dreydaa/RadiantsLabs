// import { motion } from 'framer-motion';
// import { User, Trophy, Globe2, Clock, Plus, Mail } from 'lucide-react';
import { User as UserType } from '../types';
import { useState, useEffect } from 'react';
import { api } from "../lib/api";

interface UserProfilePageProps {
  user: UserType;
}

function UserProfilePage({ user }: UserProfilePageProps) {
  const [me, setMe] = useState<UserType | null>(null);

  useEffect(() => {
    // On affiche d'abord les infos déjà disponibles (user)
    setMe(user);

    // Puis on actualise depuis le backend (si besoin)
    api<UserType>("/api/profile")
      .then(setMe)
      .catch(console.error);
  }, [user]);

  if (!me) {
    return <p>Loading…</p>;
  }

  const fullName = me.firstName && me.lastName
    ? `${me.firstName} ${me.lastName}`
    : me.email;

  return (
    <div className="max-w-xl mx-auto p-4 text-cream-100">
      <h2 className="text-2xl font-semibold mb-4">Bienvenue {fullName}</h2>
      <div className="space-y-2 bg-olive-800 p-4 rounded-xl shadow">
        <p><strong>ID :</strong> {me.id}</p>
        <p><strong>Email :</strong> {me.email}</p>
        <p><strong>Nom :</strong> {me.lastName ?? "Non renseigné"}</p>
        <p><strong>Prénom :</strong> {me.firstName ?? "Non renseigné"}</p>
        <p><strong>Âge :</strong> {me.age ?? "Non renseigné"}</p>
        <p><strong>Rang :</strong> {me.rank ?? "Non renseigné"}</p>
        <p><strong>Rôle :</strong> {me.role ?? "Non renseigné"}</p>
        <p><strong>Région :</strong> {me.region ?? "Non renseigné"}</p>
        <p><strong>Status :</strong> {me.status ?? "Non renseigné"}</p>
        <p><strong>Type de profil :</strong> {me.profileType}</p>
        <p><strong>Followers :</strong> {me.followers ?? 0}</p>
        <p><strong>Following :</strong> {me.following ?? 0}</p>
        <p><strong>Team :</strong> {me.teamName ?? "Non renseignée"}</p>
        <p><strong>Avatar :</strong> {me.avatar ? (
          <img src={me.avatar} alt="avatar" className="h-24 w-24 rounded-full mt-2" />
        ) : "Aucun"}</p>
      </div>
    </div>
  );
  // const [agentPool] = useState<string[]>([]);

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <motion.div
  //       className="bg-cream-50 rounded-lg shadow-md overflow-hidden"
  //       initial={{ opacity: 0, y: 20 }}
  //       animate={{ opacity: 1, y: 0 }}
  //       transition={{ duration: 0.5 }}
  //     >
  //       <div className="p-6">
  //         <div className="flex items-start gap-6">
  //           <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center">
  //             {user.avatar ? (
  //               <img
  //                 src={user.avatar}
  //                 alt={user.firstName}
  //                 className="w-full h-full object-cover rounded-full"
  //               />
  //             ) : (
  //               <User size={32} className="text-olive-700" />
  //             )}
  //           </div>

  //           <div className="flex-1">
  //             <div className="flex items-center gap-3 mb-2">
  //               <h1 className="text-2xl font-serif text-olive-900">
  //                 {user.firstName} {user.lastName}
  //               </h1>
  //               <span className="px-3 py-1 bg-blue-400 text-olive-900 rounded-full text-sm">
  //                 Radiant
  //               </span>
  //             </div>

  //             <div className="text-olive-600 mb-4">
  //               {user.firstName} • {user.age || '23'} years old
  //             </div>

  //             <div className="flex items-center gap-6 text-olive-700">
  //               <div className="flex items-center gap-2">
  //                 <User size={18} />
  //                 <span>Flex</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Trophy size={18} />
  //                 <span>Achievements</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Globe2 size={18} />
  //                 <span>France</span>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <Clock size={18} />
  //                 <span>Experience</span>
  //               </div>
  //             </div>
  //           </div>

  //           <div className="flex gap-3">
  //             <button className="btn btn-secondary">
  //               <Plus size={18} className="mr-2" />
  //               Add socials media
  //             </button>
  //             <button className="btn btn-primary">
  //               <Mail size={18} className="mr-2" />
  //               Contact for Teams
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </motion.div>

  //     <div className="grid grid-cols-12 gap-6 mt-6">
  //       <div className="col-span-12 lg:col-span-8">
  //         <motion.div
  //           className="bg-cream-50 rounded-lg shadow-md p-6"
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.5, delay: 0.1 }}
  //         >
  //           <h2 className="text-xl font-serif text-olive-900 mb-4">Agents Specialities</h2>
  //           {agentPool.length === 0 ? (
  //             <button className="w-full py-8 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //               <Plus size={24} className="mx-auto mb-2" />
  //               Add your agent pool
  //             </button>
  //           ) : (
  //             <div className="grid grid-cols-5 gap-4">
  //               {/* Agent pool would be rendered here */}
  //             </div>
  //           )}
  //         </motion.div>

  //         <motion.div
  //           className="bg-cream-50 rounded-lg shadow-md p-6 mt-6"
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.5, delay: 0.2 }}
  //         >
  //           <h2 className="text-xl font-serif text-olive-900 mb-4">Team Preferences</h2>
  //           <div className="grid grid-cols-2 gap-6">
  //             <div>
  //               <h3 className="font-medium text-olive-800 mb-3">Preferred Play Style</h3>
  //               <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //                 Add your play style
  //               </button>
  //             </div>

  //             <div>
  //               <h3 className="font-medium text-olive-800 mb-3">Availability</h3>
  //               <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //                 Add available times
  //               </button>
  //             </div>

  //             <div>
  //               <h3 className="font-medium text-olive-800 mb-3">Goals</h3>
  //               <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //                 Add your goal(s)
  //               </button>
  //             </div>

  //             <div>
  //               <h3 className="font-medium text-olive-800 mb-3">Preferred Regions</h3>
  //               <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //                 Add one or more regions
  //               </button>
  //             </div>
  //           </div>

  //           <div className="mt-6">
  //             <h3 className="font-medium text-olive-800 mb-3">Commitment Level</h3>
  //             <button className="w-full py-4 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //               Add a status
  //             </button>
  //           </div>
  //         </motion.div>
  //       </div>

  //       <div className="col-span-12 lg:col-span-4">
  //         <motion.div
  //           className="bg-cream-50 rounded-lg shadow-md p-6"
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.5, delay: 0.3 }}
  //         >
  //           <h2 className="text-xl font-serif text-olive-900 mb-4">Achievements</h2>
  //           <button className="w-full py-8 border-2 border-dashed border-cream-200 rounded-lg text-olive-600 hover:bg-cream-100 transition">
  //             <Trophy size={24} className="mx-auto mb-2" />
  //             Add achievements
  //           </button>
  //         </motion.div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default UserProfilePage;