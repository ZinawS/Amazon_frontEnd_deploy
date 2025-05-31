import React from 'react';
import { FadeLoader } from 'react-spinners';

function Loader() {
  return (
    <div style={styles.container}>
      <FadeLoader
        color="#36d7b7"
        height={15}
        width={5}
        radius={2}
        margin={2}
        loading={true}
        
    
      />
      <h2 style={styles.text}>Loading...</h2>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
   
  },
  text: {
    marginTop: '1rem',
    color: '#36d7b7',
    fontFamily: 'sans-serif',
  },
};

export default Loader;