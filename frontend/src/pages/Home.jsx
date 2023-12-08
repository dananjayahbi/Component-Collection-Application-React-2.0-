import React from 'react'
import { Button } from 'antd';

const Home = () => {

  function handleSignOut() {
    window.localStorage.removeItem("LoggedIn");
    window.location.href = "/login";
  }

  return (
    <div style={{float:"right"}}>
      <Button type='primary' onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

export default Home