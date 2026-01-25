export const getUserId = () => {
  let userId = localStorage.getItem('research_user_id');
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('research_user_id', userId);
    console.log('Created new user session:', userId);
  }
  
  return userId;
};

export const clearUserSession = () => {
  localStorage.removeItem('research_user_id');
};