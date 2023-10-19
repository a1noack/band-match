import React from 'react';

const Navbar = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>MyWebsite</div>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}><a href="/">Home</a></li>
          <li style={styles.navItem}><a href="/about">About</a></li>
          <li style={styles.navItem}><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 50px',
    backgroundColor: '#333',
    color: '#fff'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    gap: '15px'
  },
  navItem: {
    cursor: 'pointer'
  }
};

export default Navbar;