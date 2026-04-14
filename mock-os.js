const os = require('os');
const originalHostname = os.hostname;
os.hostname = () => 'MyPC';
// also mock userInfo just in case
const originalUserInfo = os.userInfo;
if(originalUserInfo) {
  os.userInfo = () => {
    try {
      const info = originalUserInfo();
      if(info && info.username) info.username = 'User';
      return info;
    } catch(e) {
      return { username: 'User' };
    }
  };
}
