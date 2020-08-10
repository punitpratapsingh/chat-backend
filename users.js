const users = [];

const addUser = ({ id, name,gender, email }) => {
  name = name.trim().toLowerCase();
  email = email.trim().toLowerCase();
  
  const existingUser = users.find((user) => user.email === email);

  if(!name || !email) return { error: 'Username and email are required.' };
  if(existingUser) return { error: 'email is taken.' };

  const user = { id, name, email ,gender,isInRoom:false,room:''};

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getByEmail = (email) => users.filter((user) => user.email === email.trim().toLowerCase())[0];

const getAllUsers=()=> [...users]


const getUsersInRoom=(room)=>{users.filter((user)=>user.room===room)}
module.exports = { addUser, removeUser, getUser, getByEmail,getAllUsers ,getUsersInRoom};