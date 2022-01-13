// import styles from './create-user.module.scss';
// import axios, { AxiosError } from 'axios';

// import { TextField, Button, Snackbar } from '@material-ui/core';
// import { Alert } from '@material-ui/lab';
// import React, { useState } from 'react';
// import { NewUserRequest } from '../../models/api/new-user-request';
// import Image from 'next/image';
// import LogoPortrait from 'public/logo-landscape.svg';

// export default function CreateUserPage() {
//   const ddd = new NewUserRequest();
//   const [newUser, setNewUser] = useState(ddd);
//   const [error, setError] = useState<any>(null);

//   const submitUser = async () => {
//     try {
//       await axios.post('/api/create-user', newUser);
//     } catch (e) {
//       const error = e as AxiosError<any>;

//       if (error.isAxiosError) {
//         setError(error.response?.data.message);
//       }
//     }
//   };
//   return (
//     <>
//       <div className={styles['create-user-page']}>
//         <header className={styles.header}>Create a new account</header>
//         <div className={styles.content}>
//           <div className={styles.input}>
//             <TextField
//               defaultValue={newUser.userEmailAddress}
//               label="Email Address"
//               onChange={e =>
//                 setNewUser({ ...newUser, userEmailAddress: e.target.value })
//               }
//             />
//           </div>
//           <div className={styles.input}>
//             <TextField
//               defaultValue={newUser.userFullName}
//               label="Full Name"
//               onChange={e =>
//                 setNewUser({ ...newUser, userFullName: e.target.value })
//               }
//             />
//           </div>
//           <div className={styles.input}>
//             <TextField
//               defaultValue={newUser.userHandle}
//               label="Handle"
//               onChange={e =>
//                 setNewUser({ ...newUser, userHandle: e.target.value })
//               }
//             />
//           </div>
//           <div className={styles.button}>
//             <Button variant="contained" color="primary" onClick={submitUser}>
//               Create account
//             </Button>
//           </div>
//         </div>
//         <div className={styles['logo-footer']}>
//           <LogoPortrait />
//         </div>
//       </div>
//       <Snackbar open={!!error} autoHideDuration={6000}>
//         <Alert
//           elevation={6}
//           variant="filled"
//           severity="error"
//           onClose={() => setError(null)}
//         >
//           {error}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }
